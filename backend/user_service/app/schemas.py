# app/schemas.py
from pydantic import BaseModel, EmailStr, validator
from typing import Optional, Dict, Any
from datetime import datetime
from uuid import UUID

from .models import UserType

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    id: Optional[str] = None
    role: Optional[str] = None

# OTP Schemas
class OTPRequest(BaseModel):
    email: EmailStr

class OTPVerify(BaseModel):
    email: EmailStr
    otp: str

# Password Reset Schemas
class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetVerify(BaseModel):
    email: EmailStr
    otp: str

class PasswordResetComplete(BaseModel):
    email: EmailStr
    new_password: str
    token: str  # Token received after OTP verification

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    phone: str
    role: UserType
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class UserCreate(UserBase):
    password: str
    email_verified: Optional[bool] = False

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    role: str
    googleToken: Optional[str] = None

class GoogleAuth(BaseModel):
    email: EmailStr
    role: str
    googleToken: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None

class AppleAuth(BaseModel):
    email: EmailStr
    role: str
    appleToken: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    role: str
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    email_verified: Optional[bool] = False

    class Config:
        orm_mode = True

class AuthResponse(BaseModel):
    token: str
    user: UserResponse

# Pre-registration schema for email verification
class PreRegistration(BaseModel):
    email: EmailStr
    role: str
    
class VerifyEmailOTP(BaseModel):
    email: EmailStr
    otp: str
    
class CompleteRegistration(BaseModel):
    email: EmailStr
    password: str
    role: str
    phone: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    verified_token: str  # Token received after email verification