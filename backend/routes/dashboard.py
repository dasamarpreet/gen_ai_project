from fastapi import Depends, HTTPException, APIRouter, Query
from datetime import datetime
from utils.jwt_token_config import validate_token
from pydantic import BaseModel
from models.auth_users import Users, ChatThreads, ChatHistory
from utils.get_db_session import get_db
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List
from utils.get_prompt_response import get_ai_response


router = APIRouter()


class NewQueryPayload(BaseModel):
    query: str
    
class ChatHistoryRes(BaseModel):
    id: int
    thread_id: int
    query: str
    response: str
    created_at: str

    class Config:
        orm_mode = True
    
    @classmethod
    def from_orm(cls, obj):
        """ Custom from_orm method to format datetime """
        obj_dict = obj.__dict__
        if isinstance(obj_dict['created_at'], datetime):
            obj_dict['created_at'] = obj_dict['created_at'].isoformat()
        return cls(**obj_dict)

class PaginatedHistoryResponse(BaseModel):
    total: int
    page: int
    limit: int
    histories: List[ChatHistoryRes]


@router.post('/new-query')
def new_query(payload: NewQueryPayload, user_data: dict = Depends(validate_token), db: Session = Depends(get_db)):
    
    if not user_data.get("valid"):
        print('expiredddddd')
        return {"message": "Token Expired! Re-login"}

    user_id = user_data.get("user_id")

    if not user_id:
        raise HTTPException(status_code=400, detail="Missing user Id")

    try:
        # user_obj = db.query(Users).filter_by(id=user_id)

        query = payload.query
        print('user_id ', user_id)

        new_thread_entry = ChatThreads(user_id=user_id)
        db.add(new_thread_entry)
        db.commit()
        db.refresh(new_thread_entry)

        new_history_entry = ChatHistory(thread_id=new_thread_entry.id, query=query, response="Test")
        db.add(new_history_entry)
        db.commit()
        db.refresh(new_history_entry)

        ai_res = get_ai_response(prompt=query)

        return {
            "message": "New Threads and History Created Succesfully!",
            "thread_id": new_thread_entry.id,
            "query": query,
            "ai_response": ai_res
            }

    except Exception as e:
        print("Error here: ", e)
        raise HTTPException(status_code=500, detail="Something went wrong on our side")


@router.get('/user-histories', response_model=PaginatedHistoryResponse)
def user_histories(
    page: int = Query(1, ge=1), 
    limit: int = Query(10, ge=1), 
    user_data: dict = Depends(validate_token), 
    db: Session = Depends(get_db)
    ):
    
    if not user_data.get("valid"):
        print('expiredddddd')
        return {"message": "Token Expired! Re-login"}

    user_id = user_data.get("user_id")
    if not user_id:
        raise HTTPException(status_code=400, detail="Missing user Id")

    try:
        user_threads = db.query(ChatThreads).filter_by(user_id=user_id).order_by(ChatThreads.id.desc()).all()
        histories = []
        for thread in user_threads:
            first_history = (
                db.query(ChatHistory).filter_by(thread_id=thread.id).order_by(ChatHistory.created_at.asc()).first()
            )
            if first_history:
                histories.append(first_history)

        total = len(histories)
        start = (page - 1) * limit
        end = start + limit
        paginated_histories = histories[start:end]

        # Return response with formatted created_at fields
        return {
            "total": total,
            "page": page,
            "limit": limit,
            "histories": [ChatHistoryRes.from_orm(history) for history in paginated_histories]
        }

    except Exception as e:
        print("Error here: ", e)
        raise HTTPException(status_code=500, detail="Something went wrong on our side")

