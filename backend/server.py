from quart import Quart
from quart_cors import cors # type:ignore 

from routes.chat_route import chat_bp

app = Quart(__name__)
app = cors(app, allow_origin="*")
app.register_blueprint(chat_bp, url_prefix='/chat')


if __name__ == "__main__":
    print(app.url_map)
    app.run(debug=False, port=8000)
    