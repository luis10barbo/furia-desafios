import asyncio
from quart import Quart
from quart_cors import cors # type:ignore 

from db import db
from routes.chat_route import chat_bp
from routes.kyf_route import kyf_bp

app = Quart(__name__)
app = cors(app, allow_origin="*")
app.register_blueprint(chat_bp, url_prefix='/chat')
app.register_blueprint(kyf_bp, url_prefix='/kyf')

async def main() -> None:
    await db.connect()

    await app.run_task(debug=True, port=8000)
    

if __name__ == "__main__":
    asyncio.run(main=main())
    