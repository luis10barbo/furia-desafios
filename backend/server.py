from quart import Quart
from quart_cors import cors # type:ignore 

from db import db
from routes.chat_route import chat_bp
from routes.kyf_route import kyf_bp

app = Quart(__name__)
app = cors(app, allow_origin=["http://localhost:4200", "https://furia.luisbrb.com.br/"], allow_credentials=True)
app.register_blueprint(chat_bp, url_prefix='/chat')
app.register_blueprint(kyf_bp, url_prefix='/kyf')


@app.before_serving
async def startup():
    print("Starting server and connecting to DB...")
    await db.connect()

def main() -> None:
    print("starting server!")
    app.run(debug=True, port=8000)
    

if __name__ == "__main__":
    main()
    