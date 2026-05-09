from flask import Flask, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

def carregar_carros():
    with open('carros.json') as f:
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

if __name__ == '__main__':
    app.run(debug=True)