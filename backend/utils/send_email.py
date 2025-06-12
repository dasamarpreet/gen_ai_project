from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from typing import List
import os, asyncio
from dotenv import load_dotenv

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("EMAIL_USER"),
    MAIL_PASSWORD=os.getenv("EMAIL_PASS"),
    MAIL_FROM=os.getenv("EMAIL_USER"),
    MAIL_PORT=int(os.getenv("EMAIL_PORT", 587)),
    MAIL_SERVER=os.getenv("EMAIL_SERVER", "smtp.gmail.com"),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True
)

def send_verification_email(to_email: str, username: str, link: str):
    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Confirm Your Identity!</title>
    </head>
    <body style="background-color: #f3f4f6; font-family: Arial, sans-serif; padding: 40px;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="font-size: 1.5rem; font-weight: bold; color: #111827;">Confirm Your Identity!</h2>
        <p style="margin-top: 1rem; color: #374151;">Hi <strong>{username}</strong>,</p>
        <p style="color: #374151;">Thank you for registering on SocketioApp! Please click the button below to verify your email address.</p>
        <a href="{link}" style="display: inline-block; margin-top: 1.5rem; background-color: #2563eb; color: white; padding: 0.75rem 1.5rem; border-radius: 6px; text-decoration: none;">Verify Email</a>
        <p style="margin-top: 2rem; color: #9ca3af; font-size: 0.875rem;">If you didn't request this, you can ignore this email.</p>
      </div>
    </body>
    </html>
    """

    message = MessageSchema(
        subject="SocketioApp: Verify your email address",
        recipients=[to_email],
        body=html_content,
        subtype="html",
    )

    fm = FastMail(conf)
    try:
        asyncio.run(fm.send_message(message))
    except Exception as e:
        print(f"Email sending failed: {e}")


def send_password_reset_email(to_email: str, username: str, link: str):
    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Confirm Your Identity!</title>
    </head>
    <body style="background-color: #f3f4f6; font-family: Arial, sans-serif; padding: 40px;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="font-size: 1.5rem; font-weight: bold; color: #111827;">Confirm Your Identity!</h2>
        <p style="margin-top: 1rem; color: #374151;">Hi <strong>{username}</strong>,</p>
        <p style="color: #374151;">You requested a password reset. Click the button below to reset your password. This link will expire in 15 minutes.</p>
        <a href="{link}" style="display: inline-block; margin-top: 1.5rem; background-color: #2563eb; color: white; padding: 0.75rem 1.5rem; border-radius: 6px; text-decoration: none;">Reset Password</a>
        <p style="margin-top: 2rem; color: #9ca3af; font-size: 0.875rem;">If you didn’t request this, you can ignore this email.</p>
      </div>
    </body>
    </html>
    """

    message = MessageSchema(
        subject="SocketioApp: Reset your password",
        recipients=[to_email],
        body=html_content,
        subtype="html",
    )

    fm = FastMail(conf)
    try:
        asyncio.run(fm.send_message(message))
    except Exception as e:
        print(f"Password reset email failed: {e}")
