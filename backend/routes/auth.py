from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel
from models.auth_users import Users
from utils.jwt_token_config import create_token
from utils.get_db_session import get_db
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from sqlalchemy import or_
from dotenv import load_dotenv
import os
from jose import JWTError, jwt
from jose.exceptions import ExpiredSignatureError
from utils.send_email import send_password_reset_email, send_verification_email


load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
JWT_ALGORITHM = os.getenv("ALGORITHM")
FRONTEND_URL = os.getenv('FRONTEND_URL')

router = APIRouter()
passwd_contxt = CryptContext(schemes=["bcrypt"], deprecated="auto")

class LoginPayload(BaseModel):
    username: str
    password: str


class SignUpPayload(BaseModel):
    username: str
    email: str
    password: str
    mobile: str


class ForgotPasswordPayload(BaseModel):
    email: str


class ResetPasswordRequest(BaseModel):
    token: str
    email: str
    new_password: str


def hash_password(password: str) -> str:
    return passwd_contxt.hash(password)

def verify_password(plain_password, hash_password: str) -> str:
    return passwd_contxt.verify(plain_password, hash_password)


@router.post("/login")
def login_func(payload: LoginPayload, db: Session = Depends(get_db)):

    username = payload.username
    password = payload.password
    
    existing_user = db.query(Users).filter(
        or_(
            Users.username == username,
            Users.email == username
        )
    ).first()

    if not existing_user:
        raise HTTPException(status_code=400, detail="User Not Found")

    password_matched = verify_password(password, existing_user.hashed_password)

    if password_matched and not existing_user.is_verified:
        raise HTTPException(status_code=401, detail="Verify your email first!")

    elif password_matched and existing_user.is_verified:
        token = create_token(1)
        return {
            "message": "Login Succesfull!", 
            "token": token, 
            "token_type": "bearer",
            "user_id": existing_user.id,
            "username": existing_user.username,
            "email": existing_user.email,
            "mobile": existing_user.mobile,
            }
    
    else:
        raise HTTPException(status_code=401, detail="Invalid Password!")


@router.post("/register")
def signup_func(payload: SignUpPayload, db: Session = Depends(get_db), background_tasks: BackgroundTasks = None):

    username = payload.username
    password = payload.password
    email = payload.email
    mobile = payload.mobile
    
    existing_user = db.query(Users).filter(Users.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered. Please login!")

    existing_username = db.query(Users).filter(Users.username == username).first()
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already taken!")
    
    existing_mobile = db.query(Users).filter(Users.mobile == mobile).first()
    if existing_mobile:
        raise HTTPException(status_code=400, detail="Mobile number already registered.")

    encrypted_password = hash_password(password)

    new_user_entry = Users(email=email, username=username, mobile=mobile, hashed_password=encrypted_password)
    db.add(new_user_entry)
    db.commit()
    db.refresh(new_user_entry)

    # Generate a 12-hour email verification token
    verify_token = create_token(new_user_entry.id, expiry_minutes=720)  # 12 hours
    verification_link = f"{FRONTEND_URL}/verify-email?token={verify_token}"
    background_tasks.add_task(send_verification_email, to_email=email, username=username, link=verification_link)

    return {"message": "Registration successful. Please check your email to verify your account."}


@router.get("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
        user_id = int(payload.get("sub"))

        user = db.query(Users).filter(Users.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found.")

        if user.is_verified:
            return {"message": "Email already verified."}

        user.is_verified = True
        db.commit()

        return {"message": "Email verified successfully. You can now login."}
    except ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Verification link has expired.")
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid verification token.")


@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordPayload, db: Session = Depends(get_db), background_tasks: BackgroundTasks = None):
    user = db.query(Users).filter(Users.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")

    reset_token = create_token(user.id, expiry_minutes=15)
    reset_link = f"{os.getenv('FRONTEND_URL')}/reset-password?token={reset_token}&email={user.email}"

    background_tasks.add_task(
        send_password_reset_email,
        to_email=user.email,
        username=user.username,
        link=reset_link
    )

    return {"message": "Password reset email sent."}


@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    try:
        payload_data = jwt.decode(payload.token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
        user_id = int(payload_data.get("sub"))
    except ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Reset link expired.")
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid reset token.")

    user = db.query(Users).filter(Users.id == user_id, Users.email == payload.email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found or email mismatch.")

    user.hashed_password = hash_password(payload.new_password)
    db.commit()

    return {"message": "Password reset successful."}
