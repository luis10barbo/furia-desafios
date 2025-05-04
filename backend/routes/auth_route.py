import asyncio
import datetime
from typing import TypedDict
import httpx
from quart import Blueprint, request

from controller.reddit import RedditControllerError, add_reddit_furia_related_content, reddit_get_user_info
from db import db
from model.providers import Providers
from controller.auth import get_user


auth_bp = Blueprint("auth", __name__)
    
# TODO: PUT IN .ENV
REDDIT_REDIRECT_URI = "http://localhost:4200/auth/reddit"
REDDIT_CLIENT_ID = "YZ-XJOkoR7Zv6R8fTww3gQ"
REDDIT_CLIENT_SECRET = "naSb0J9bmOcJc0Es3JMOfw2Qb8J_YA"

class RedditTokenResponse(TypedDict):
    access_token: str
    token_type: str
    expires_in: int
    scope: str

@auth_bp.route("/reddit", methods=["POST"])
async def reddit_callback():
    user = await get_user()
    if not user:
        return "Voce precisa estar autenticado para realizar essa acao", 401
    
    data = await request.get_json()
    code: str = data['code']

    token_url = 'https://www.reddit.com/api/v1/access_token'
    auth = httpx.BasicAuth(username=REDDIT_CLIENT_ID, password=REDDIT_CLIENT_SECRET)
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    }
    payload = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDDIT_REDIRECT_URI,
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(token_url, data=payload, headers=headers, auth=auth)

    response_json = response.json()

    if response.status_code != 200:
        return response_json, response.status_code
    
    reddit_token: RedditTokenResponse = response_json

    reddit_user = await reddit_get_user_info(reddit_token['access_token'])
    if isinstance(reddit_user, RedditControllerError):
        return reddit_user.value

    await db.socialmedialink.delete_many(where={'provider': {'equals': Providers.Reddit.value}, "userId": {'equals': user.id}})

    expiration_date = datetime.datetime.now() + datetime.timedelta(seconds=reddit_token["expires_in"])

    await db.socialmedialink.create({
            'accessToken': response_json['access_token'],
            'provider': Providers.Reddit.value,
            "providerUserId": reddit_user["id"],
            "providerUserNickname": reddit_user['name'],
            'user': {'connect': {'id': user.id}},
            'expirationDate': expiration_date,
            'providerUserUrl': "https://www.reddit.com" + reddit_user["subreddit"]["url"]
    })

    # Run task to add furia related posts to account
    asyncio.create_task(add_reddit_furia_related_content())
    return ""
