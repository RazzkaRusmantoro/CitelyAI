from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import threading
import time
import psutil
import humanize

from pathlib import Path
from dotenv import load_dotenv

print("We're getting there")
env_path = Path(__file__).resolve().parents[1] / '.env.local'
print("Here again")

load_dotenv(dotenv_path=env_path)
app = Flask(__name__)
CORS(app)
print("Life")

# Memory monitoring function
def monitor_memory():
    """Continuously monitor and print memory usage every second"""
    process = psutil.Process(os.getpid())
    
    while True:
        try:
            # Get memory info
            memory_info = process.memory_info()
            rss_mb = memory_info.rss / (1024 * 1024)  # RSS in MB
            rss_gb = memory_info.rss / (1024 * 1024 * 1024)  # RSS in GB
            
            # Get virtual memory
            virtual_memory = psutil.virtual_memory()
            
            print(f"\n=== Memory Usage ===")
            print(f"Process RSS: {rss_mb:.2f} MB ({rss_gb:.3f} GB)")
            print(f"Total System Memory: {humanize.naturalsize(virtual_memory.total)}")
            print(f"Available System Memory: {humanize.naturalsize(virtual_memory.available)}")
            print(f"Memory Percent Used: {virtual_memory.percent}%")
            print("====================\n")
            
            time.sleep(1)
            
        except Exception as e:
            print(f"Error monitoring memory: {e}")
            time.sleep(5)

# Start memory monitoring in a daemon thread
memory_thread = threading.Thread(target=monitor_memory, daemon=True)
memory_thread.start()


# Keyword Extraction API
from app.routes.key_bert_upload import keyword_extraction_bp
app.register_blueprint(keyword_extraction_bp, url_prefix='/api')

from app.routes.cite import cite_bp
app.register_blueprint(cite_bp, url_prefix = '/api')

from app.routes.recite import recite_bp
app.register_blueprint(recite_bp, url_prefix = '/api')

from app.routes.rephrase import rephrase_bp
app.register_blueprint(rephrase_bp, url_prefix = '/api')

from app.routes.cite_link import cite_link_bp
app.register_blueprint(cite_link_bp, url_prefix='/api')

from app.routes.update_citation import update_citation_bp
app.register_blueprint(update_citation_bp)

from app.routes.summarize import summarize_bp
app.register_blueprint(summarize_bp, url_prefix='/api')

from app.routes.summarize_link import summarize_link_bp
app.register_blueprint(summarize_link_bp, url_prefix = '/api')

from app.routes.source_checker import source_checker_bp
app.register_blueprint(source_checker_bp, url_prefix = '/api')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)