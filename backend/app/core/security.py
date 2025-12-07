"""
Security utilities for password hashing and JWT
"""
import typing as tp
from datetime import datetime, timedelta

from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from jose import JWTError, jwt

from app.core.config import settings

# Initialize Argon2 password hasher with recommended parameters
# Argon2id is the recommended variant (hybrid of Argon2i and Argon2d)
ph = PasswordHasher(
    time_cost=2,       # Number of iterations
    memory_cost=65536,  # Memory usage in KiB (64 MB)
    parallelism=1,     # Number of parallel threads
    hash_len=32,       # Length of the hash in bytes
    salt_len=16,       # Length of random salt in bytes
)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify password against Argon2 hash
    
    Args:
        plain_password: Plain text password
        hashed_password: Argon2 hashed password from database
        
    Returns:
        True if password matches, False otherwise
    """
    try:
        ph.verify(hashed_password, plain_password)
        
        # Check if hash needs rehashing (parameters changed)
        if ph.check_needs_rehash(hashed_password):
            print(f"ℹ️  Password hash needs update for better security")
        
        return True
    except VerifyMismatchError:
        return False
    except Exception as e:
        print(f"❌ Password verification error: {e}")
        return False


def get_password_hash(password: str) -> str:
    """
    Hash password using Argon2id
    
    Args:
        password: Plain text password
        
    Returns:
        Argon2 hashed password
    """
    if not isinstance(password, str):
        raise ValueError(f"Password must be a string, got {type(password)}")
    
    if not password:
        raise ValueError("Password cannot be empty")
    
    return ph.hash(password)


def create_access_token(data: tp.Dict[str, tp.Any], expires_delta: tp.Optional[timedelta] = None) -> str:
    """
    Create JWT access token
    
    Args:
        data: Data to encode in token
        expires_delta: Token expiration time
        
    Returns:
        JWT token string
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> tp.Optional[tp.Dict[str, tp.Any]]:
    """
    Decode JWT access token
    
    Args:
        token: JWT token string
        
    Returns:
        Decoded token data or None if invalid
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None

