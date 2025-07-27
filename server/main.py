from flask import Flask, request, jsonify
from flask_cors import CORS
import os

from pathlib import Path
from dotenv import load_dotenv

print("We're getting there")
env_path = Path(__file__).resolve().parents[1] / '.env.local'
print("Here again")

load_dotenv(dotenv_path=env_path)
app = Flask(__name__)
CORS(app)
print("Life")

# Keyword Extraction API
from app.routes.key_bert_upload import keyword_extraction_bp
app.register_blueprint(keyword_extraction_bp, url_prefix='/api')
print("Yep")


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)