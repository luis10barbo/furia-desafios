import os
import dotenv
from quart import Quart
from quart_cors import cors # type:ignore 

from db import db
from routes.chat_route import chat_bp
from routes.kyf_route import kyf_bp
from routes.auth_route import auth_bp

app = Quart(__name__)
app = cors(app, allow_origin=["http://localhost:4200", "https://furia.luisbrb.com.br", "http://192.168.0.195:4200"], allow_credentials=True)
app.register_blueprint(chat_bp, url_prefix='/api/chat')
app.register_blueprint(kyf_bp, url_prefix='/api/kyf')
app.register_blueprint(auth_bp, url_prefix='/api/auth')


@app.before_serving
async def startup():
    print("connecting to DB...")
    await db.connect()

def main() -> None:
    dotenv.dotenv_values(".env")
    port = 8000
    try:
        port = int(os.environ["SERVER_PORT"])
    except Exception:
        pass

    print("starting server!")
    app.run(host="0.0.0.0", port=port)
    

if __name__ == "__main__":
    main()
    