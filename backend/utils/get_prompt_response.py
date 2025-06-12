from fastapi import Depends, HTTPException, APIRouter, Query
from datetime import datetime
from pydantic import BaseModel
from models.auth_users import Users, ChatThreads, ChatHistory
from utils.get_db_session import get_db
from sqlalchemy.orm import Session


def get_ai_response(prompt: str) -> str:
    
    if not prompt:
        raise HTTPException(status_code=400, detail="Missing user prompt")

    return "Hey there! This is a test response from promptace."

