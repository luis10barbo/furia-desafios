from enum import Enum
from typing import TypeVar, TypedDict
import httpx
from db import db
from model.providers import Providers
from utils.auth import AuthControllerErrors, get_user
from prisma.models import SocialMediaLink

TwitterDataT = TypeVar("TwitterDataT")

class TwitterResponse[TwitterDataT](TypedDict):
    data: TwitterDataT

class TwitterControllerErrors(Enum):
    RateLimit = "ERR_TWITTER_RATE_LIMIT"

class TwitterLikesResponse(TypedDict):
    id: str
    text: str

async def twitter_user_furia_likes_lookup():
    user = await get_user()
    if not user:
        return AuthControllerErrors.ERR_USER_NOT_LOGGED_IN
    if not user.socialMediaLink:
        return AuthControllerErrors.ERR_TWITTER_NOT_LINKED
    
    twitter_link: SocialMediaLink | None = None
    for social_media_link in user.socialMediaLink:
        if social_media_link.provider == Providers.Twitter.value:
            twitter_link = social_media_link
            break
    
    if twitter_link == None:
        return AuthControllerErrors.ERR_TWITTER_NOT_LINKED
    
    headers = {
        'Authorization': f'Bearer {twitter_link.accessToken}'
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(f"https://api.twitter.com/2/users/{twitter_link.providerUserId}/liked_tweets", headers=headers)

    if response.status_code == 429:
        return TwitterControllerErrors.RateLimit

    liked_tweets: TwitterResponse[list[TwitterLikesResponse]] = response.json()
    return liked_tweets

async def twitter_update_user_furia_likes():
    # liked_tweets: TwitterResponse[list[TwitterLikesResponse]]
    liked_tweets_response = await twitter_user_furia_likes_lookup()
    if isinstance(liked_tweets_response, AuthControllerErrors) or liked_tweets_response == TwitterControllerErrors.RateLimit:
        return liked_tweets_response
    
    for liked_tweet in liked_tweets_response["data"]:
        post_id ="TWITTER"+liked_tweet["id"]
        await db.socialmediapost.upsert({"postId": post_id}, {"create": {"postId": post_id, "postDescription": liked_tweet["text"], "socialMedia": "TWITTER"},"update":{}})

    
    