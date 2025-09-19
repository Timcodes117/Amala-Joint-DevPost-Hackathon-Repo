from flask import Blueprint, jsonify
from datetime import datetime
from ..extensions import mongo_client


health_bp = Blueprint('health', __name__)


@health_bp.get('/')
def health():
    db = mongo_client.get_db()
    try:
        # Quick roundtrip to ensure connection
        db.command('ping')
        db_status = 'connected'
    except Exception as exc:
        db_status = f'error: {exc}'

    return jsonify({
        'status': 'healthy',
        'database': db_status,
        'timestamp': datetime.utcnow().isoformat(),
    })


