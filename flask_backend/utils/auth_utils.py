import bcrypt
import re
from email_validator import validate_email, EmailNotValidError

def hash_password(password):
    """Hash a password using bcrypt"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(password, hashed_password):
    """Verify a password against its hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

def validate_email_format(email):
    """Validate email format using email-validator"""
    try:
        validate_email(email)
        return True, None
    except EmailNotValidError as e:
        return False, str(e)

def validate_password_strength(password):
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter"
    
    if not re.search(r"[a-z]", password):
        return False, "Password must contain at least one lowercase letter"
    
    if not re.search(r"\d", password):
        return False, "Password must contain at least one digit"
    
    return True, None

def validate_user_data(data):
    """Validate user registration data"""
    errors = {}
    
    # Validate name
    if 'name' not in data or not data['name'].strip():
        errors['name'] = 'Name is required'
    elif len(data['name'].strip()) < 2:
        errors['name'] = 'Name must be at least 2 characters long'
    
    # Validate email
    if 'email' not in data or not data['email'].strip():
        errors['email'] = 'Email is required'
    else:
        is_valid, error_msg = validate_email_format(data['email'])
        if not is_valid:
            errors['email'] = error_msg
    
    # Validate password
    if 'password' not in data or not data['password']:
        errors['password'] = 'Password is required'
    else:
        is_valid, error_msg = validate_password_strength(data['password'])
        if not is_valid:
            errors['password'] = error_msg
    
    return len(errors) == 0, errors
