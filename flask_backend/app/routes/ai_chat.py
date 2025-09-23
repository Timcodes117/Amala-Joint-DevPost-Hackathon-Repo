from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from ..extensions import mongo_client
from ..utils.mongo import serialize_document


ai_chatbot_bp = Blueprint('users', __name__)


@ai_chatbot_bp.get('/ask/')
@jwt_required()
def list_users():
    return jsonify({'success': True, 'data': "respones"}), 200

@ai_chatbot_bp("/translate", methods=["POST"])
def translate():
    data = request.get_json()
    text = data.get("text", "")
    lang = data.get("lang", "yo")  # default to Yoruba

    translated = process_text(text, lang)
    return jsonify({
        "original": text,
        "translated": translated,
        "target_lang": lang
    })



# hey victor
# this is just a comment to help you create endpoints
# if you want to create a new route, start by creating a new file in the same folder as this one

# then, create a bluePrint - this is just like the api router in FAST API
# blueprint_name = Blueprint('route_name', __name__) 

# to create an endpoint 
# use the blueprint decorator to call an api method [GET, POST, PUT, ...OTHERS]
# if you want to make the endpoint secure by expecting an access Token from the frontend
# continue with the @jwt_required() decorator before calling the api function
#  then create the api function
# then do your logic and return a valid response conditionally or not.