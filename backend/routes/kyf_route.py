import base64
import json
from typing import TypedDict, cast
import bcrypt
from quart import Blueprint, Response, make_response, request
from controller.auth import auth_logout, create_session, get_user, set_session_id
from utils.validation import validate_attributes

from controller.chatgpt import gpt_client

from quart.datastructures import FileStorage

from db import db

from prisma.types import PurchaseCreateWithoutRelationsInput, EventCreateWithoutRelationsInput


kyf_bp = Blueprint("kyf", __name__)

class Purchase(TypedDict):
    name: str
    url: str

class Event(TypedDict):
    name: str
    url: str


class LoginBody(TypedDict):
    email: str
    password: str

@kyf_bp.route("/login", methods=["POST"])
async def login():
    body: LoginBody = await request.get_json()
    validation_result = validate_attributes(body, required_parameters=["email", "password"])
    if validation_result:
        return Response(f"{validation_result}", 400)

    user = await db.user.find_unique({"email": body["email"]})
    if not user:
        return Response(f"Invalid login", 400)

    result = bcrypt.checkpw(body["password"].encode(), user.password.encode())
    if not result:
        return Response(f"Invalid login", 400)

    user.password = ""

    response = await make_response(user.model_dump_json())

    set_session_id(response)
    await create_session(user.id)
    return response

class RegisterBody(TypedDict):
    email: str
    password: str

    first_name: str
    last_name: str

    phone: str

    # Gerenal area, not very specific address
    state: str
    city: str
    neighborhood: str

    # All related to furia
    interests: str
    purchases: list[Purchase]
    events: list[Event]

@kyf_bp.route("/register", methods=["POST"])
async def register():
    body: RegisterBody = await request.get_json()
    print(body)
    
    validation_result = validate_attributes(body, required_parameters=['email', 'password', 'first_name', 'last_name', 'phone', 'neighborhood', 'state', 'city', 'purchases', 'events'])
    if validation_result:
        return Response(f"{validation_result}", 200)


    db_user = await db.user.find_unique({'email': body["email"]})
    if db_user:
        return Response("Usuário já existe.", 400)

    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(str.encode(body["password"]), salt)
    purchases: list[PurchaseCreateWithoutRelationsInput] = []
    events: list[EventCreateWithoutRelationsInput] = []

    for purchase in body["purchases"]:
        purchases.append({"name": purchase["name"], "url": purchase["url"]})

    for event in body["events"]:
        events.append({"name": event["name"], "url": event["url"]})

    user = await db.user.create(data={
        'email': body['email'],
        "password": hashed_password.decode(),
        'firstName': body["first_name"],
        'lastName': body["last_name"],

        'phone': body["phone"],

        "state": body["state"],
        "city": body["city"],
        "neighborhood": body["neighborhood"],
        
        "interests": body["interests"],
        "purchases": {"create": purchases},
        "events": {"create": events},
    })
    
    response = await make_response(user.model_dump_json())
    set_session_id(response)

    await create_session(user.id)

    user.password = ""

    return response

@kyf_bp.route("/logout", methods=["POST"])
async def logout():
    await auth_logout()
    return await make_response("", 204)

@kyf_bp.route("/user", methods=["GET"])
async def user():
    user = await get_user()
    if not user:
        return await make_response("", 204)

    return await make_response(user.model_dump_json())

class DocumentVerificationReturn(TypedDict):
    tipo_documento: str | None
    imagens_documento_pessoa: bool

@kyf_bp.route("/document", methods=["POST"])
async def submit_documents():
    user = await get_user()
    if not user:
        return await make_response("Você precisa estar logado para utilizar essa rota", 401)
    
    front_document = cast(FileStorage, (await request.files).get("frontDocument")) #type: ignore
    back_document = cast(FileStorage, (await request.files).get("backDocument")) #type: ignore
    
    front_bytes = front_document.stream.read()
    front_base64 = base64.b64encode(front_bytes).decode("utf-8")

    back_bytes = back_document.stream.read()
    back_base64 = base64.b64encode(back_bytes).decode("utf-8")

    front_data_url = f"data:{front_document.mimetype};base64,{front_base64}"
    back_data_url = f"data:{back_document.mimetype};base64,{back_base64}"

    response = gpt_client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": """Responda apenas com JSON sem utilizar markdown nesse formato: {
  "tipo_documento": ..., # Caso as imagens enviadas não pareçam um ser um documento brasileiro, escreva o tipo de dado null. Se parecerem documentos, escreva o tipo do documento.
  "imagens_documento_pessoa": ..., # Responda em booleano se as duas imagens são frente e verso do documento da pessoa com nome enviado no prompt. Pode ser que o nome do prompt não esteja completo que nem no documento.
  "motivo_imagens_documento_pessoa": ... # Justifique a resposta do campo 'imagens_documento_pessoa'
}""" + f"\n nome da pessoa: {user.firstName} {user.lastName}"},
                    {"type": "image_url", "image_url": {"url": front_data_url}},
                    {"type": "image_url", "image_url": {"url": back_data_url}},
                ],
            }
        ],
        max_tokens=500,
    )
    
    result = response.choices[0].message.content
    if not result: 
        return await make_response("Nao foi possivel analisar os documentos, tente novamente", 500)
    
    result_json: DocumentVerificationReturn = json.loads(result)
    if not result_json["tipo_documento"]:
        return await make_response("Imagem informada nao é um documento", 400)
    if not result_json["imagens_documento_pessoa"]:
        return await make_response("Nome cadastrado na conta não corresponde com o do documento", 400)
        
    result = await db.user.update({"verified": True}, {"id": user.id})
    if not result:
        return await make_response("Usuario não encontrado no banco de dados, erro inesperado.", 500)
    return await make_response("", 200)