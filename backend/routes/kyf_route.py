from typing import TypedDict
import bcrypt
from quart import Blueprint, Response, request
from utils.validation import validate_attributes

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

    
    return user.model_dump_json(), 200

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

    user.password = ""

    return user.model_dump_json(), 200

