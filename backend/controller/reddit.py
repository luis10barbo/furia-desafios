from enum import Enum
import json
import httpx

from db import db
from model.reddit.user import RedditUser
from model.reddit.listing import Child, RedditListingResponse
from utils.auth import get_user
from prisma.models import User
from controller.chatgpt import gpt_client

class RedditControllerError(Enum):
    RateLimit = ("ERR_REDDIT_RATE_LIMIT", 429)
    Forbidden = ("ERR_REDDIT_FORBIDDEN", 403)
    UserNotLoggedIn = ("ERR_USER_NOT_LOGGED_IN", 401)
    RedditLinkNotFound = ("ERR_REDDIT_LINK_NOT_FOUND", 401)

async def get_user_reddit_link(user: User | None):
    if not user or not user.socialMediaLink:
        return RedditControllerError.UserNotLoggedIn

    for social_media_link in user.socialMediaLink:
        if social_media_link.provider == "reddit":
            return social_media_link
    
    return RedditControllerError.RedditLinkNotFound


async def reddit_get_user_info(access_token: str | None):
    user = await get_user()
    if not access_token:
        reddit_link = await get_user_reddit_link(user)
        if isinstance(reddit_link, RedditControllerError):
            return reddit_link
        
        access_token = reddit_link.accessToken

    headers = {
        "Authorization": f"bearer {access_token}",
        "User-Agent": "MyCoolApp/1.0 by u/YourRedditUsername"
    }

    async with httpx.AsyncClient() as client:
        response = await client.get("https://oauth.reddit.com/api/v1/me", headers=headers)

    if response.status_code == 403:
        return RedditControllerError.Forbidden

    reddit_user: RedditUser = response.json()
    return reddit_user

async def reddit_get_likes(access_token: str | None = None, user: User | None = None):
    user = user if user else await get_user()
    reddit_link = await get_user_reddit_link(user)
    if isinstance(reddit_link, RedditControllerError):
            return reddit_link
    
    if not access_token:
        access_token = reddit_link.accessToken
        
    headers = {
        "Authorization": f"bearer {access_token}",
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(f"https://oauth.reddit.com/user/{reddit_link.providerUserNickname}/upvoted", headers=headers)

    if response.status_code == 403:
        return RedditControllerError.Forbidden

    RedditUpvotes: RedditListingResponse = response.json()
    return RedditUpvotes

def check_if_is_furia_related(like: Child):
    # TODO: add ai checking
    data = like["data"]
    title = data.get("title")
    post = data.get("selftext")
    subreddit = data.get("subreddit")

    response = gpt_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": f"""Responda apenas com 'true' ou 'false' sem utilizar markdown. O post a seguir aparenta ser relacionado ao time de e-sports 'FURIA'?
                     titulo do post: '{title}'
                     conteudo do post: '{post}'
                     subreddit: '{subreddit}'"""},
                ],
            }
        ],
        max_tokens=500,
    )

    if not response.choices[0].message.content:
        return False
    
    return json.loads(response.choices[0].message.content)

    # if title and "furia" in title.lower():
    #     return True
    
    # if post and "furia" in post:
    #     return True

    # return False

async def add_reddit_furia_related_content():
    user = await get_user()
    if not user:
        return "User not found"

    reddit_likes_response = await reddit_get_likes(None, user)


    if isinstance(reddit_likes_response, RedditControllerError):
        return reddit_likes_response

    likes = reddit_likes_response["data"]["children"]
    for like in likes:
        is_furia_related = check_if_is_furia_related(like)
        if not is_furia_related:
            continue

        data = like["data"]
        post_url = "https://reddit.com" + data["permalink"] # type: ignore
        await db.socialmediapost.upsert({"postUrl": "REDDIT"+post_url}, {"create": {"postDescription": data.get("selftext"), "postTitle": data.get("title"), "postUrl": post_url, "socialMedia": "Reddit", "user": {"connect": {"id": user.id}}, "interactionType": "Upvote"}, "update": {}})
    