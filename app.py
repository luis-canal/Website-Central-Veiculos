import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIST = os.path.join(BASE_DIR, 'frontend', 'dist')

app = Flask(__name__, static_folder=FRONTEND_DIST, static_url_path='')
CORS(app)

def carregar_carros():
    with open(os.path.join(BASE_DIR, 'carros.json'), encoding='utf-8') as f:
        return json.load(f)

@app.route('/api/carros')
def api_carros():
    carros = carregar_carros()
    return jsonify(carros)

@app.route('/api/carro/<int:id>')
def api_carro(id):
    carros = carregar_carros()
    if 0 <= id < len(carros):
        return jsonify(carros[id])
    return jsonify({'error': 'Carro não encontrado'}), 404

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    if path != '' and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
