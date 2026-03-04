# 🚀 Painel de Despacho Logístico (Auvo)

Este projeto é um sistema interno desenvolvido para coordenar e automatizar a roteirização de manutenções preventivas e corretivas de equipamentos fitness. Ele substitui a alocação manual por um motor inteligente e exporta os dados padronizados para o sistema Auvo.

## 🏗️ Arquitetura do Projeto
O projeto foi desenhado em um modelo de 3 camadas (Desacoplado):
- **Back-end (API):** Desenvolvido em Python com **FastAPI**. Responsável por ler planilhas, calcular datas pulando finais de semana e aplicar regras de zonas.
- **Front-end (UI):** Desenvolvido em **React** (Vite). Uma Single Page Application com Kanban interativo (Drag-and-Drop) para o ajuste fino da agenda.
- **Banco de Dados:** Arquivo local `mestre.json` para persistência ágil.

## 📂 Estrutura de Pastas
```
📦 Descomplica 26.1
 ┣ 📂 backend                 # Motor lógico e API (Python)
 ┃ ┣ 📂 venv                  # Ambiente virtual (Oculto no Git)
 ┃ ┣ 📜 importacao.csv        # Planilha limpa com os 70+ clientes
 ┃ ┣ 📜 main.py               # Código principal do servidor FastAPI
 ┃ ┗ 📜 mestre.json           # Nosso Banco de Dados (Gerado automaticamente)
 ┣ 📂 frontend                # Interface Visual (React/Vite)
 ┃ ┣ 📂 node_modules          # Dependências do Node (Oculto no Git)
 ┃ ┣ 📂 public
 ┃ ┣ 📂 src                   # Onde vamos programar as telas
 ┃ ┗ 📜 package.json
 ┣ 📜 .gitignore              # Arquivo de segurança do Git
 ┣ 📜 CONTEXTO_PROJETO.md     # Regras e arquitetura para a IA
 ┗ 📜 README.md               # Apresentação do projeto
````
## ⚙️ Como rodar o Back-end localmente
1. Entre na pasta: `cd backend`
2. Ative o ambiente virtual: `source venv/Scripts/activate` (No Git Bash)
3. Inicie o servidor: `uvicorn main:app --reload`
4. Acesse a documentação da API em: `http://127.0.0.1:8000/docs## ⚙️ Como rodar o projeto localmente

### 1. Back-end (API)
1. Entre na pasta: `cd backend`
2. Ative o ambiente virtual: `source venv/Scripts/activate` (No Git Bash) ou `.\venv\Scripts\activate` (No Windows CMD)
3. Instale as dependências: `pip install -r requirements.txt`
4. Inicie o servidor: `uvicorn main:app --reload`
5. Acesse a documentação da API em: `http://127.0.0.1:8000/docs`

### 2. Front-end (UI)
1. Abra um novo terminal e entre na pasta: `cd frontend`
2. Instale as dependências: `npm install`
3. Inicie a aplicação: `npm run dev`
4. Acesse no navegador: `http://localhost:5173` (ou a porta indicada no terminal)
`

> **Nota:** As regras de negócio estritas e o escopo do projeto estão documentados no arquivo `CONTEXTO_PROJETO.md`.