# app/auth_utils.py
import random
import string
from datetime import datetime, timedelta
from typing import Dict, Optional, Any
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Email configuration
EMAIL_HOST = os.getenv("EMAIL_HOST", "smtp.gmail.com")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", "587"))
EMAIL_USER = os.getenv("EMAIL_USER", "your-email@gmail.com")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD", "your-app-password")
EMAIL_FROM = os.getenv("EMAIL_FROM", "Gyansetu <noreply@gyansetu.com>")

# OTP storage (in-memory for now, should be replaced with a database in production)
otp_store: Dict[str, Dict[str, Any]] = {}

def generate_otp(length: int = 6) -> str:
    """Generate a random OTP of specified length."""
    return ''.join(random.choices(string.digits, k=length))

def store_otp(email: str, otp_type: str, otp: str, expiry_minutes: int = 10) -> None:
    """Store OTP with expiry time."""
    expiry_time = datetime.utcnow() + timedelta(minutes=expiry_minutes)
    otp_store[email] = {
        "otp": otp,
        "type": otp_type,  # 'verification', 'password_reset'
        "expiry": expiry_time,
        "attempts": 0
    }

def verify_otp(email: str, otp: str, otp_type: str) -> bool:
    """Verify OTP for given email and type."""
    if email not in otp_store:
        return False
    
    otp_data = otp_store[email]
    
    # Check OTP type
    if otp_data["type"] != otp_type:
        return False
    
    # Check expiry
    if datetime.utcnow() > otp_data["expiry"]:
        # OTP expired, remove it
        del otp_store[email]
        return False
    
    # Increment attempts
    otp_data["attempts"] += 1
    
    # Check max attempts (3)
    if otp_data["attempts"] > 3:
        del otp_store[email]
        return False
    
    # Check OTP match
    if otp_data["otp"] == otp:
        # OTP verified, remove it
        del otp_store[email]
        return True
    
    return False

def send_otp_email(email: str, otp: str, otp_type: str) -> bool:
    """Send OTP email."""
    try:
        msg = MIMEMultipart()
        msg['From'] = EMAIL_FROM
        msg['To'] = email
        
        if otp_type == "verification":
            msg['Subject'] = "Gyansetu - Email Verification OTP"
            body = f"""
            <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                    <h2 style="color: #8A2BE2;">Gyansetu Email Verification</h2>
                    <p>Thank you for registering with Gyansetu. To complete your registration, please use the following OTP:</p>
                    <div style="background-color: #f0e6ff; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #4B0082;">
                        {otp}
                    </div>
                    <p>This OTP will expire in 10 minutes.</p>
                    <p>If you didn't request this verification, please ignore this email.</p>
                    <p>Regards,<br>Gyansetu Team</p>
                </div>
            </body>
            </html>
            """
        elif otp_type == "password_reset":
            msg['Subject'] = "Gyansetu - Password Reset OTP"
            body = f"""
            <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                    <h2 style="color: #8A2BE2;">Gyansetu Password Reset</h2>
                    <p>You recently requested to reset your password. Please use the following OTP to proceed:</p>
                    <div style="background-color: #f0e6ff; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #4B0082;">
                        {otp}
                    </div>
                    <p>This OTP will expire in 10 minutes.</p>
                    <p>If you didn't request this password reset, please ignore this email or contact support.</p>
                    <p>Regards,<br>Gyansetu Team</p>
                </div>
            </body>
            </html>
            """
        
        msg.attach(MIMEText(body, 'html'))
        
        server = smtplib.SMTP(EMAIL_HOST, EMAIL_PORT)
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASSWORD)
        server.send_message(msg)
        server.quit()
        
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

def send_verification_otp(email: str) -> dict:
    """Generate, store and send verification OTP."""
    otp = generate_otp()
    store_otp(email, "verification", otp)
    success = send_otp_email(email, otp, "verification")
    
    return {
        "success": success,
        "message": "Verification OTP sent successfully" if success else "Failed to send verification OTP"
    }

def send_password_reset_otp(email: str) -> dict:
    """Generate, store and send password reset OTP."""
    otp = generate_otp()
    store_otp(email, "password_reset", otp)
    success = send_otp_email(email, otp, "password_reset")
    
    return {
        "success": success,
        "message": "Password reset OTP sent successfully" if success else "Failed to send password reset OTP"
    }