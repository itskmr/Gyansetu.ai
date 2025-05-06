# app/main.py
from fastapi import FastAPI, Depends, HTTPException, status, Body
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
import uuid
import os
import json
from dotenv import load_dotenv

from . import models, schemas, crud, auth, auth_utils
from .database import engine, get_db

# Load environment variables
load_dotenv()

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Gyansetu API",
    description="User authentication and management for Gyansetu",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "ok", "service": "gyansetu-user-service"}

# Email OTP Verification
@app.post("/api/auth/send-verification-otp")
def send_verification_otp(request: schemas.OTPRequest):
    """Send OTP for email verification during registration"""
    result = auth_utils.send_verification_otp(request.email)
    
    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send verification OTP"
        )
    
    return {"message": "Verification OTP sent successfully", "email": request.email}

@app.post("/api/auth/verify-email-otp", response_model=Dict[str, Any])
def verify_email_otp(request: schemas.VerifyEmailOTP, db: Session = Depends(get_db)):
    """Verify OTP for email verification during registration"""
    # Check if the OTP is valid
    is_valid = auth_utils.verify_otp(request.email, request.otp, "verification")
    
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP"
        )
    
    # Generate a temporary token for completing registration
    access_token_expires = timedelta(minutes=30)  # 30 minutes to complete registration
    verification_token = auth.create_access_token(
        data={"sub": request.email, "purpose": "email_verification"},
        expires_delta=access_token_expires
    )
    
    return {
        "message": "Email verified successfully",
        "verified_token": verification_token
    }

# Password Reset
@app.post("/api/auth/forgot-password")
def forgot_password(request: schemas.PasswordResetRequest, db: Session = Depends(get_db)):
    """Initiate password reset process"""
    # Check if user exists
    user = crud.get_user_by_email(db, email=request.email)
    if not user:
        # Don't reveal if email exists
        return {"message": "If your email is registered, you will receive a password reset OTP"}
    
    # Send password reset OTP
    result = auth_utils.send_password_reset_otp(request.email)
    
    return {"message": "If your email is registered, you will receive a password reset OTP"}

@app.post("/api/auth/verify-reset-otp", response_model=Dict[str, Any])
def verify_reset_otp(request: schemas.PasswordResetVerify, db: Session = Depends(get_db)):
    """Verify OTP for password reset"""
    # Check if user exists
    user = crud.get_user_by_email(db, email=request.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email"
        )
    
    # Check if the OTP is valid
    is_valid = auth_utils.verify_otp(request.email, request.otp, "password_reset")
    
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP"
        )
    
    # Generate a temporary token for resetting password
    access_token_expires = timedelta(minutes=15)  # 15 minutes to reset password
    reset_token = auth.create_access_token(
        data={"sub": request.email, "purpose": "password_reset", "id": str(user.id)},
        expires_delta=access_token_expires
    )
    
    return {
        "message": "OTP verified successfully",
        "reset_token": reset_token,
        "email": request.email
    }

@app.post("/api/auth/reset-password")
def reset_password(request: schemas.PasswordResetComplete, db: Session = Depends(get_db)):
    """Complete password reset process"""
    # Verify the reset token
    try:
        payload = auth.jwt.decode(request.token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email = payload.get("sub")
        purpose = payload.get("purpose")
        
        if email != request.email or purpose != "password_reset":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid token"
            )
    except auth.JWTError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token"
        )
    
    # Update user's password
    user = crud.get_user_by_email(db, email=request.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User not found"
        )
    
    # Update password
    hashed_password = auth.get_password_hash(request.new_password)
    user.password = hashed_password
    db.commit()
    
    return {"message": "Password reset successfully"}

# Authentication routes
@app.post("/api/auth/pre-signup")
def pre_signup(request: schemas.PreRegistration, db: Session = Depends(get_db)):
    """First step of registration - check email availability and send OTP"""
    # Check if email already exists
    db_user = crud.get_user_by_email(db, email=request.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    # Send verification OTP
    result = auth_utils.send_verification_otp(request.email)
    
    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send verification OTP"
        )
    
    return {"message": "Verification OTP sent successfully", "email": request.email}

@app.post("/api/auth/complete-signup", response_model=schemas.AuthResponse)
def complete_signup(request: schemas.CompleteRegistration, db: Session = Depends(get_db)):
    """Complete registration after email verification"""
    try:
        # Verify the token
        payload = auth.jwt.decode(request.verified_token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email = payload.get("sub")
        purpose = payload.get("purpose")
        
        if email != request.email or purpose != "email_verification":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid verification token"
            )
    except auth.JWTError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification token"
        )
    
    # Check if email already exists
    db_user = crud.get_user_by_email(db, email=request.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    # Create user object
    user_data = schemas.UserCreate(
        email=request.email,
        password=request.password,
        phone=request.phone,
        role=request.role,
        first_name=request.first_name,
        last_name=request.last_name,
        email_verified=True
    )
    
    # Create user in database
    new_user = crud.create_user(db=db, user=user_data)
    
    # Generate token
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={
            "sub": new_user.email,
            "id": str(new_user.id),
            "role": new_user.role
        }, 
        expires_delta=access_token_expires
    )
    
    # Map to the format expected by frontend
    user_response = {
        "id": str(new_user.id),
        "email": new_user.email,
        "role": new_user.role,
        "firstName": new_user.first_name,
        "lastName": new_user.last_name,
        "email_verified": new_user.email_verified
    }
    
    return {
        "token": access_token,
        "user": user_response
    }

@app.post("/api/auth/login", response_model=schemas.AuthResponse)
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = auth.authenticate_user(db, credentials.email, credentials.password, credentials.role)
    
    # Check if user exists but has a different role
    if not user:
        user_with_email = crud.get_user_by_email(db, email=credentials.email)
        if user_with_email and user_with_email.role != credentials.role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Role mismatch",
                headers={"WWW-Authenticate": "Bearer", "actualRole": user_with_email.role},
            )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Your account has been deactivated"
        )
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={
            "sub": user.email,
            "id": str(user.id),
            "role": user.role
        }, 
        expires_delta=access_token_expires
    )
    
    # Map to the format expected by frontend
    user_response = {
        "id": str(user.id),
        "email": user.email,
        "role": user.role,
        "firstName": user.first_name,
        "lastName": user.last_name,
        "email_verified": user.email_verified
    }
    
    return {
        "token": access_token,
        "user": user_response
    }

# Google Auth handling
@app.post("/api/auth/google-login", response_model=schemas.AuthResponse)
def google_login(google_auth: schemas.GoogleAuth, db: Session = Depends(get_db)):
    # Here we would normally verify the Google token with Google's API
    # For now, we'll assume the token is valid and use the provided info
    
    # Check if user exists
    db_user = crud.get_user_by_email(db, email=google_auth.email)
    
    if db_user:
        # Check if role matches
        if db_user.role != google_auth.role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Role mismatch",
                headers={"WWW-Authenticate": "Bearer", "actualRole": db_user.role},
            )
    else:
        # Create new user
        user_data = schemas.UserCreate(
            email=google_auth.email,
            password=str(uuid.uuid4()),  # Generate random password
            phone=google_auth.phone if hasattr(google_auth, 'phone') and google_auth.phone else "",
            role=google_auth.role,
            first_name=google_auth.first_name if hasattr(google_auth, 'first_name') else "",
            last_name=google_auth.last_name if hasattr(google_auth, 'last_name') else "",
            email_verified=True  # Email is verified through Google
        )
        db_user = crud.create_user(db=db, user=user_data)
    
    # Generate token
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={
            "sub": db_user.email,
            "id": str(db_user.id),
            "role": db_user.role
        }, 
        expires_delta=access_token_expires
    )
    
    # Map to the format expected by frontend
    user_response = {
        "id": str(db_user.id),
        "email": db_user.email,
        "role": db_user.role,
        "firstName": db_user.first_name,
        "lastName": db_user.last_name,
        "email_verified": db_user.email_verified
    }
    
    return {
        "token": access_token,
        "user": user_response
    }

# Apple Auth handling
@app.post("/api/auth/apple-login", response_model=schemas.AuthResponse)
def apple_login(apple_auth: schemas.AppleAuth, db: Session = Depends(get_db)):
    # Here we would normally verify the Apple token with Apple's API
    # For now, we'll assume the token is valid and use the provided info
    
    # Check if user exists
    db_user = crud.get_user_by_email(db, email=apple_auth.email)
    
    if db_user:
        # Check if role matches
        if db_user.role != apple_auth.role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Role mismatch",
                headers={"WWW-Authenticate": "Bearer", "actualRole": db_user.role},
            )
    else:
        # Create new user
        user_data = schemas.UserCreate(
            email=apple_auth.email,
            password=str(uuid.uuid4()),  # Generate random password
            phone=apple_auth.phone if hasattr(apple_auth, 'phone') and apple_auth.phone else "",
            role=apple_auth.role,
            first_name=apple_auth.first_name if hasattr(apple_auth, 'first_name') else "",
            last_name=apple_auth.last_name if hasattr(apple_auth, 'last_name') else "",
            email_verified=True  # Email is verified through Apple
        )
        db_user = crud.create_user(db=db, user=user_data)
    
    # Generate token
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={
            "sub": db_user.email,
            "id": str(db_user.id),
            "role": db_user.role
        }, 
        expires_delta=access_token_expires
    )
    
    # Map to the format expected by frontend
    user_response = {
        "id": str(db_user.id),
        "email": db_user.email,
        "role": db_user.role,
        "firstName": db_user.first_name,
        "lastName": db_user.last_name,
        "email_verified": db_user.email_verified
    }
    
    return {
        "token": access_token,
        "user": user_response
    }

# Token verification endpoint
@app.get("/api/auth/verify")
def verify_token(current_user: models.User = Depends(auth.get_current_user)):
    # Return user data if token is valid
    return {
        "valid": True,
        "user": {
            "id": str(current_user.id),
            "email": current_user.email,
            "role": current_user.role,
            "firstName": current_user.first_name,
            "lastName": current_user.last_name,
            "email_verified": current_user.email_verified
        }
    }

# User by email endpoint (used for handling role mismatch errors)
@app.get("/api/auth/user-by-email")
def get_user_by_email(email: str, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {
        "email": user.email,
        "role": user.role
    }

# User routes
@app.get("/api/users/me", response_model=schemas.UserResponse)
def get_current_user_info(current_user: models.User = Depends(auth.get_current_user)):
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "role": current_user.role,
        "firstName": current_user.first_name,
        "lastName": current_user.last_name,
        "email_verified": current_user.email_verified
    }

# Start the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=5000, reload=True)