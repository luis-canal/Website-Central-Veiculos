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
- SQLAlchemy
- BeautifulSoup
- APScheduler
- CSS

## 🚀 Estrutura do projeto

- `app.py` — ponto de entrada do backend Flask
- `backend/` — aplicação modular com banco, modelos, scraper e sincronização
- `backend/app.py` — criação da aplicação Flask e endpoints da API
- `backend/database.py` — configuração do banco de dados
- `backend/models.py` — modelo de veículo persistido
- `backend/services/` — scraper e serviço de sincronização
- `frontend/` — aplicação React com Vite
- `vehicles.db` — banco SQLite local gerado automaticamente

## ▶️ Como rodar em desenvolvimento

1. Instale as dependências:
   ```bash
   python3 -m pip install -r requirements.txt
   ```
2. No terminal principal:
   ```bash
   python3 app.py
   ```
3. Em outro terminal:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Acesse: `http://localhost:5173`

## 🔄 Sincronização automática

O backend agora suporta:
- scraping de anúncios a partir de uma URL configurada em `.env`
- persistência dos veículos em banco de dados
- atualização de registros existentes
- marcação de veículos como indisponíveis quando saem da fonte
- endpoint manual de sincronização em `/api/sync`
- endpoint de diagnóstico em `/health` e `/api/status`

Exemplo de configuração:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com a URL do site de origem e outras opções.

## 📦 Como rodar em produção

1. No diretório `frontend/`:
   ```bash
   npm run build
   ```
2. Volte para a raiz do projeto e execute:
   ```bash
   python3 app.py
   ```

O Flask servirá o frontend construído em `frontend/dist`.

## 🎯 Objetivo

Criar uma plataforma digital para apresentar veículos de forma profissional e facilitar o contato com clientes.

## 👨‍💻 Autor

**Luis Eduardo Brescansin Canal**

GitHub: https://github.com/luis-canal
LinkedIn: https://www.linkedin.com/in/luis-eduardo-brescansin-canal-908aba363/
