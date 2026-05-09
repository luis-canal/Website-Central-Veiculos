from flask import Flask, render_template, jsonify
import json

app = Flask(__name__)

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

# Manter rotas antigas para compatibilidade, mas focar nas novas
@app.route('/')
def index():
    carros = carregar_carros()
    return render_template('index.html', carros=carros[:3])

@app.route('/estoque')
def estoque():
    carros = carregar_carros()
    return render_template('estoque.html', carros=carros)

@app.route('/carro/<int:id>')
def carro(id):
    carros = carregar_carros()
    carro = carros[id]
    return render_template('carro.html', carro=carro)

if __name__ == '__main__':
    app.run(debug=True)