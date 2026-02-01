from fastapi import HTTPException, Depends
from typing import Optional
from app.core.constants import ROLES

def verify_role(user_role: str, required_role: str):
    """
    Verify if the user has the required role to perform an action.
    """
    if user_role not in ROLES:
        raise HTTPException(status_code=403, detail="Invalid user role.")
    if user_role != required_role:
        raise HTTPException(status_code=403, detail=f"Action requires role: {required_role}")
    return True

def get_current_user(token: Optional[str] = None):
    """
    Placeholder function to get current user from token.
    Extend this function to integrate with real authentication.
    """
    # Example mock user
    if token:
        return {"username": "user1", "role": "participant"}
    else:
        raise HTTPException(status_code=401, detail="Missing authentication token")
