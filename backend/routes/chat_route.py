import asyncio
from typing import Iterable, TypedDict
from openai import OpenAI, Stream
from openai.types.chat import ChatCompletionChunk, ChatCompletionMessageParam

from quart import Blueprint, Response, request

chat_bp = Blueprint("chat", __name__)

async def stream(stream: Stream[ChatCompletionChunk]):
    for chunk in stream:
        if (type(chunk.choices[0].delta.content) == str):
           await asyncio.sleep(0)
           yield chunk.choices[0].delta.content

class MessagesQuery(TypedDict):
    message: str
    role: str

client = OpenAI()

@chat_bp.route("/send", methods=["POST"])
async def send_message():
    query = request.args.get("query")
    if not query or len(query) == 0:
        return Response("Please send a valid query", status=401)

    messages: Iterable[ChatCompletionMessageParam] = []
    messages.append({
        "role": "system",
        "content": "Apenas responda se for sobre o time de E-sports 'Fúria' ou seus participantes. Seja breve, responda com entusiasmo e com fontes se possível."
    })

    body: list[MessagesQuery] = await request.get_json()
    for message in body:
        if message["role"] == "assistant":
            messages.append({
                "role": "assistant",
                "content": message["message"]
            })
        else:
            messages.append({
                "role": "user",
                "content": message["message"]
            })
    
    messages.append({
        "role": "user",
        "content": query
    })

    completion = client.chat.completions.create(
    model="gpt-4o-mini-search-preview",
    # model="gpt-4o-mini",
    messages= messages,
    stream=True
    )
    
    return Response(stream(completion), 200)