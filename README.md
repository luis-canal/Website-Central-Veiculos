# 🚗 Website Central Veículos

Website desenvolvido para a Central Veículos com foco na divulgação de veículos disponíveis, catálogo online e páginas detalhadas dos carros.

## ✨ Funcionalidades

- Catálogo de veículos
- Página individual para cada carro
- Layout responsivo
- Design moderno e intuitivo
- Informações de contato

## 🛠️ Tecnologias utilizadas

- React
- Vite
- Flask
- Python
- CSS

## 🚀 Estrutura do projeto

- `app.py` — backend Flask que expõe a API de veículos
- `carros.json` — dados dos veículos
- `frontend/` — aplicação React com Vite

## ▶️ Como rodar em desenvolvimento

1. No terminal principal:
   ```powershell
   python app.py
   ```
2. Em outro terminal:
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

Acesse: `http://localhost:5173`

## 📦 Como rodar em produção

1. No diretório `frontend/`:
   ```powershell
   npm run build
   ```
2. Volte para a raiz do projeto e execute:
   ```powershell
   python app.py
   ```

O Flask servirá o frontend construído em `frontend/dist`.

## 🎯 Objetivo

Criar uma plataforma digital para apresentar veículos de forma profissional e facilitar o contato com clientes.

## 👨‍💻 Autor

**Luis Eduardo Brescansin Canal**

GitHub: https://github.com/luis-canal
LinkedIn: https://www.linkedin.com/in/luis-eduardo-brescansin-canal-908aba363/
