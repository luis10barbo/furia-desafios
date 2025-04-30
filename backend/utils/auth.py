import datetime
from quart import request
from quart.typing import ResponseTypes
import uuid

from db import db

AUTH_COOKIE = "session-id"

def _get_session_id():
    session_id = request.cookies.get(AUTH_COOKIE)
    if not session_id:
        session_id = str(uuid.uuid4())
    
    return session_id

def set_session_id(response: ResponseTypes):
    response.set_cookie(AUTH_COOKIE, _get_session_id())

async def create_session(user_id: str):
    expiration_date = datetime.datetime.today() + datetime.timedelta(days=7)
    await db.session.create({"cookie": _get_session_id(), "expirationDate": expiration_date, "user": {"connect": {"id": user_id}}})

async def get_session(user_id: str | None = None, include_user: bool | None = None):
    session = await db.session.find_unique({"cookie": _get_session_id()}, {"user": {"include": {}}})
    if user_id:
        session = await create_session(user_id)
    
    return session

async def get_user():
    session = await get_session(None, True)
    print(session)
    
    
    if not session or not session.user:
        return None
    
    session.user.password = ""
    return session.user
    
async def auth_logout():
    session = await get_session()
    if session:
        await db.session.delete({"id": session.id})