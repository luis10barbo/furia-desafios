from typing import Any, TypedDict, List, Optional, Union


class RichTextItem(TypedDict):
    e: str
    t: str


class Source(TypedDict):
    url: str
    width: int
    height: int


class Resolution(TypedDict):
    url: str
    width: int
    height: int


class PreviewImage(TypedDict):
    source: Source
    resolutions: List[Resolution]
    variants: dict[Any, Any]
    id: str


class Preview(TypedDict):
    images: List[PreviewImage]
    enabled: bool


class RedditPostData(TypedDict, total=False):
    approved_at_utc: Optional[float]
    subreddit: str
    selftext: str
    author_fullname: str
    saved: bool
    mod_reason_title: Optional[str]
    gilded: int
    clicked: bool
    title: str
    link_flair_richtext: List[RichTextItem]
    subreddit_name_prefixed: str
    hidden: bool
    pwls: int
    link_flair_css_class: str
    downs: int
    thumbnail_height: Optional[int]
    top_awarded_type: Optional[str]
    hide_score: bool
    name: str
    quarantine: bool
    link_flair_text_color: Optional[str]
    upvote_ratio: float
    author_flair_background_color: Optional[str]
    subreddit_type: str
    ups: int
    total_awards_received: int
    media_embed: dict[Any, Any]
    thumbnail_width: Optional[int]
    author_flair_template_id: Optional[str]
    is_original_content: bool
    user_reports: List[Any]
    secure_media: Optional[dict[Any, Any]]
    is_reddit_media_domain: bool
    is_meta: bool
    category: Optional[str]
    secure_media_embed: dict[Any, Any]
    link_flair_text: str
    can_mod_post: bool
    score: int
    approved_by: Optional[str]
    is_created_from_ads_ui: bool
    author_premium: bool
    thumbnail: str
    edited: Union[bool, float]
    author_flair_css_class: Optional[str]
    author_flair_richtext: List[Any]
    gildings: dict[Any, Any]
    post_hint: str
    content_categories: Optional[List[str]]
    is_self: bool
    mod_note: Optional[str]
    created: float
    link_flair_type: str
    wls: int
    removed_by_category: Optional[str]
    banned_by: Optional[str]
    author_flair_type: str
    domain: str
    allow_live_comments: bool
    selftext_html: Optional[str]
    likes: Optional[bool]
    suggested_sort: Optional[str]
    banned_at_utc: Optional[float]
    url_overridden_by_dest: str
    view_count: Optional[int]
    archived: bool
    no_follow: bool
    is_crosspostable: bool
    pinned: bool
    over_18: bool
    preview: Preview
    all_awardings: List[Any]
    awarders: List[Any]
    media_only: bool
    can_gild: bool
    spoiler: bool
    locked: bool
    author_flair_text: Optional[str]
    treatment_tags: List[Any]
    visited: bool
    removed_by: Optional[str]
    num_reports: Optional[int]
    distinguished: Optional[str]
    subreddit_id: str
    author_is_blocked: bool
    mod_reason_by: Optional[str]
    removal_reason: Optional[str]
    link_flair_background_color: Optional[str]
    id: str
    is_robot_indexable: bool
    report_reasons: Optional[List[str]]
    author: str
    discussion_type: Optional[str]
    num_comments: int
    send_replies: bool
    contest_mode: bool
    mod_reports: List[Any]
    author_patreon_flair: bool
    author_flair_text_color: Optional[str]
    permalink: str
    stickied: bool
    url: str
    subreddit_subscribers: int
    created_utc: float
    num_crossposts: int
    media: Optional[dict[Any, Any]]
    is_video: bool


class Child(TypedDict):
    kind: str
    data: RedditPostData


class ListingData(TypedDict):
    after: Optional[str]
    dist: int
    modhash: Optional[str]
    geo_filter: str
    children: List[Child]


class RedditListingResponse(TypedDict):
    kind: str
    data: ListingData