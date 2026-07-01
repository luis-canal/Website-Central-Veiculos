import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIST = os.path.join(BASE_DIR, 'frontend', 'dist')

app = Flask(__name__)
CORS(app)

def carregar_carros():
    with open(os.path.join(BASE_DIR, 'carros.json'), encoding='utf-8') as f:
        return json.load(f)

@app.route('/api/carros')
def api_carros():
    carros = carregar_carros()
    return jsonify(carros)

@app.route('/api/carro/<string:id>')
def api_carro(id):
    carros = carregar_carros()
    carro = next((carro for carro in carros if carro.get('id') == id), None)
    if carro is not None:
        return jsonify(carro)
    return jsonify({'error': 'Carro não encontrado'}), 404

@app.route('/assets/<path:filename>')
def serve_assets(filename):
    return send_from_directory(os.path.join(FRONTEND_DIST, 'assets'), filename)

@app.route('/<path:filename>')
def serve_static(filename):
    file_path = os.path.join(FRONTEND_DIST, filename)
    if os.path.exists(file_path):
        return send_from_directory(FRONTEND_DIST, filename)
    return send_from_directory(FRONTEND_DIST, 'index.html')

@app.route('/')
def serve_index():
    return send_from_directory(FRONTEND_DIST, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
