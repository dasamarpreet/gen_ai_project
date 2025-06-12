from fastapi import HTTPException, Depends
from jose import JWTError, jwt
from jose.exceptions import ExpiredSignatureError
import os
from dotenv import load_dotenv
from fastapi.security import OAuth2PasswordBearer
from datetime import timedelta, timezone, datetime

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
JWT_ALGORITHM = os.getenv("ALGORITHM")
JWT_EXPIRE_MINUTE = int(os.getenv("JWT_EXPIRE_MINUTE"))

oauth2Schema = OAuth2PasswordBearer(tokenUrl='/auth/login')


def create_token(user_id: int, expiry_minutes: int = JWT_EXPIRE_MINUTE) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=expiry_minutes)
    to_encode = {"sub": str(user_id), "exp": expire}
    encoded_jwt = jwt.encode(claims=to_encode, key=SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt


def validate_token(encoded_jwt: str = Depends(oauth2Schema)) -> dict:

    try:
        print("Validating tokennnnnnnnnnnnnn")
        decoded_token_value = decode_token(encoded_jwt)
        
        if decoded_token_value.get('valid'):
            print("111111111111111111111")
            return decoded_token_value
        
        elif not decoded_token_value.get('valid'):
            print("22222222222222222222")
            raise ExpiredSignatureError

    except ExpiredSignatureError as e:
        print("Login againnnnnnnnnnnn")
        return {"user_id": None, "expires": "Expired", "valid": False}
        # return "Token has expired"
    #     # decoded_token_value = refresh_token(encoded_jwt)
    #     # return decoded_token_value


def decode_token(encoded_jwt: str = Depends(oauth2Schema)) -> dict:
    token_exception = HTTPException(status_code=401, detail="Invalid or Expired Token", headers={"WWW-Authenticate": "Bearer"})

    try:
        decoded_value = jwt.decode(token=encoded_jwt, key=SECRET_KEY, algorithms=[JWT_ALGORITHM])
        user_id = decoded_value.get("sub")
        expires_at = decoded_value.get("exp")


        if not user_id:
            raise token_exception
        
        return {"user_id": int(user_id), "expires": expires_at, "valid": True}
    
    except JWTError as e:
        try:
            print("TOken expired re-login ", e)
            decoded_value = jwt.decode(token=encoded_jwt, key=SECRET_KEY, algorithms=[JWT_ALGORITHM], options={"verify_exp": False})
            user_id = decoded_value.get("sub")
            expires_at = decoded_value.get("exp")

            return {"user_id": int(user_id), "expires": expires_at, "valid": False}

        except Exception as e:
            print("TOken invalid ", e)
            raise token_exception


def refresh_token(encoded_jwt: str = Depends(oauth2Schema)) -> str:
    token_exception = HTTPException(status_code=401, detail="Invalid Token", headers={"WWW-Authenticate": "Bearer"})

    try:
        decoded_value = jwt.decode(token=encoded_jwt, key=SECRET_KEY, algorithms=[JWT_ALGORITHM], options={"verify_exp": False}) # override to allow expired tokens for refresh
        
        user_id = decoded_value.get("sub")

        if not user_id:
            raise token_exception

        new_expire = datetime.now(timezone.utc) + timedelta(minutes=JWT_EXPIRE_MINUTE)
        to_encode = {"sub": str(user_id), "exp": new_expire}

        new_encoded_jwt = jwt.encode(claims=to_encode, key=SECRET_KEY, algorithm=JWT_ALGORITHM)

        # return new_encoded_jwt
        return {"user_id": int(user_id), "expires": int(new_expire.timestamp()), "new_token": new_encoded_jwt, "valid": True}    
    
    except JWTError:
        raise token_exception
    
