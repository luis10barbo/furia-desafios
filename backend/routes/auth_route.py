import datetime
from typing import TypedDict
import httpx
from quart import Blueprint, jsonify, request

from controller.reddit import RedditControllerError, add_reddit_furia_related_content, reddit_get_user_info
from controller.twitter import TwitterResponse, twitter_update_user_furia_likes
from db import db
from model.providers import Providers
from utils.auth import get_user


auth_bp = Blueprint("auth", __name__)

CLIENT_ID = 'Qm9TT2k0d2dDSy1GS0VpbjhpVUg6MTpjaQ'
CLIENT_SECRET = 'fZe6PzvkALlnUo8k8QAJmLOKNukqDIVorj5m3e9GaxoDjrOklx'
REDIRECT_URI = 'http://localhost:4200/auth/twitter'



class OAuthResponse(TypedDict):
    access_token: str
    expires_in: int
    refresh_token: str
    scope: str
    token_type: str


class TwitterUserResponse(TypedDict):
    id: str
    username: str
    url: str
    
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

    await add_reddit_furia_related_content()
    return ""

@auth_bp.route("/twitter", methods=["POST"])
async def twitter_callback():
    data = await request.get_json()
    code: str = data['code']
    code_verifier: str = data['code_verifier']

    # credentials = f"{CLIENT_ID}:{CLIENT_SECRET}"
    # b64_credentials = base64.b64encode(credentials.encode()).decode()

    token_url = 'https://api.twitter.com/2/oauth2/token'
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        }
    payload = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'code_verifier': code_verifier
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(token_url, data=payload, headers=headers)

    if response.status_code != 200:
        return jsonify({'error': response.text}), response.status_code

    response_json: OAuthResponse = response.json()

    headers = {
        'Authorization': f'Bearer {response_json["access_token"]}'
    }

    async with httpx.AsyncClient() as client:
        user_response = await client.get('https://api.twitter.com/2/users/me&user.fields=id,username,url', headers=headers)

    if user_response.status_code == 429:
        return "Conta twitter recebeu rate limit, utilize outras opções de login.", 429

    twitter_user: TwitterResponse[TwitterUserResponse] = user_response.json()

    
    user = await get_user()
    if not user:
        return "Voce precisa estar autenticado para realizar essa acao", 401

    await db.socialmedialink.delete_many(where={'provider': {'equals': Providers.Twitter.value}, "userId": {'equals': user.id}})

    expiration_date = datetime.datetime.now() + datetime.timedelta(seconds=response_json['expires_in'])
    await db.socialmedialink.create({
            'accessToken': response_json['access_token'],
            'provider': Providers.Twitter.value,
            "providerUserId": twitter_user["data"]["id"],
            "providerUserNickname": twitter_user['data']['username'],
            'refreshToken': response_json["refresh_token"],
            'user': {'connect': {'id': user.id}},
            'expirationDate': expiration_date,
            'providerUserUrl': twitter_user['data']['url']
    })

    await twitter_update_user_furia_likes()

    return twitter_user
    # return jsonify(response.json())