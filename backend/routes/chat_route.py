from typing import AsyncIterator, cast
from agents import Agent, Runner, StreamEvent, WebSearchTool
from flask_restful.reqparse import RequestParser
from openai.types.responses import ResponseTextDeltaEvent 
from quart import Blueprint, Response, request

chat_bp = Blueprint("chat", __name__)

# async def stream(gpt_stream: AsyncIterator[StreamEvent]):
#     loop = asyncio.get_event_loop()

#     async def get_next(agen: AsyncIterator[StreamEvent]):
#         try:
#             return await agen.__anext__()
#         except StopAsyncIteration:
#             return None

#     while True:
#         chunk = loop.run_until_complete(get_next(gpt_stream))
#         if chunk is None:
#             break
#         print(chunk)
#         yield chunk['delta']

#     async for stream_event in gpt_stream:
#         print(f"result -> {stream_event}\n")
#         if (type(stream_event.data) == ResponseTextDeltaEvent): # type: ignore
#             response = cast(ResponseTextDeltaEvent, stream_event.data)  # type: ignore
#             yield response.delta 

async def stream(stream: AsyncIterator[StreamEvent]):
    async for chunk in stream:
        if (hasattr(chunk, "data") and type(chunk.data) == ResponseTextDeltaEvent): # type: ignore
            response = cast(ResponseTextDeltaEvent, chunk.data)  # type: ignore
            yield response.delta 


chat_query_args = RequestParser()
chat_query_args.add_argument("query", type=str, required=True, help="Mensagem de query para o chatbot") # type:ignore
@chat_bp.route("/send", methods=["GET"])
async def send_message():
    # query = cast(str, (await request.get_json())["query"]) # type:ignore
    query = request.args.get("query")

    if not query or len(query) == 0:
        return Response("Please send a valid query", status=401)

    # return query
    agent = Agent(
        name="Fan da Furia",
        instructions="Apenas responda se for sobre o time de E-sports 'Fúria' ou seus participantes. Seja breve e com entusiasmo",
        model="gpt-4.1-nano",
        # tools=[WebSearchTool()],
    )

    result = Runner.run_streamed(agent, query)

    
    return Response(stream(result.stream_events()), 200)