# 🏋️‍♂️ Sistema Solução Fitness - Integração Auvo

Plataforma interna desenvolvida para a **Solução Fitness** com o objetivo de centralizar, automatizar e otimizar as operações relacionadas ao sistema Auvo. O projeto atua em duas frentes principais: Roteirização de Manutenções Preventivas e Extração Automática de Orçamentos/Problemas.

---

## 🚀 Funcionalidades

### 1. Gestão de Rotas (Preventivas)
* **Lista Dinâmica de Clientes:** Leitura em tempo real através do banco de dados local (`mestre.json`).
* **Edição em Massa (Lote):** Seleção múltipla para atribuição rápida de Técnicos, Zonas e Datas.
* **Sistema Anti-Concorrência:** Envio de requisições de atualização em fila (loop) para evitar bloqueios do sistema operacional.
* **Motor de Exportação Auvo:** Geração de ficheiro `.xlsx` rigorosamente formatado (29 colunas), enviando apenas o nome exato do cliente e forçando o Auvo a vincular os dados ao cadastro existente.
* **Proteção de Zonas:** Modais de confirmação de segurança para evitar mudanças acidentais nas zonas de roteirização.

### 2. Extrator de Tarefas (Filtro)
* **Upload de Relatórios:** Suporte a ficheiros extraídos do Auvo nos formatos `.csv`, `.xls` e `.xlsx`.
* **Filtro Inteligente:** Busca automatizada por palavras-chave (Regex) nos relatos dos técnicos (ex: *quebrado, solicitar peça, orçamento*).
* **Estatísticas Rápidas:** Apresentação da taxa de ocorrência e volume de problemas encontrados num lote de tarefas.
* **Acesso Direto:** Links clicáveis para abrir diretamente a "OS Digital" do Auvo no navegador.

---

## 🛠️ Tecnologias Utilizadas

O sistema possui uma arquitetura moderna baseada em microsserviços:

**Front-end:**
* [React.js](https://reactjs.org/) (Framework UI)
* [Vite](https://vitejs.dev/) (Build Tool)
* [Tailwind CSS](https://tailwindcss.com/) (Estilização e Componentes Visuais)
* [Axios](https://axios-http.com/) (Consumo de APIs)

**Back-end:**
* [Python 3.10+](https://www.python.org/)
* [FastAPI](https://fastapi.tiangolo.com/) (API REST de alta performance)
* [Pandas](https://pandas.pydata.org/) (Processamento de DataFrames e ficheiros Excel/CSV)
* [OpenPyXL](https://openpyxl.readthedocs.io/) (Geração e manipulação de planilhas Excel)
* [Uvicorn](https://www.uvicorn.org/) (Servidor ASGI)

---

## ⚙️ Como Instalar (Primeiro Uso)

Certifique-se de que tem o **Node.js** e o **Python** instalados no seu computador.

### 1. Instalar dependências do Back-end
Abra um terminal na pasta `backend` e execute:
```bash
# Criar o ambiente virtual (opcional, mas recomendado)
python -m venv venv

# Ativar o ambiente virtual (Windows)
venv\Scripts\activate

# Instalar as bibliotecas necessárias
pip install fastapi uvicorn pandas openpyxl python-multipart
```

### 2. Instalar dependências do Front-end
Abra um terminal na pasta `frontend` e execute:
```bash
npm install
```

---

## ⚡ Como Executar o Sistema

Para facilitar o dia a dia, o projeto conta com um automatizador de inicialização para Windows.

Basta ir até à pasta raiz do projeto (`/SolucaoFitness`) e dar um **duplo clique** no ficheiro:
👉 **`iniciar_sistema.bat`**

O script irá automaticamente:
1. Abrir e iniciar o servidor Back-end (FastAPI) na porta 8000.
2. Abrir e iniciar o servidor Front-end (Vite) na porta 5173.
3. Abrir o seu navegador de internet padrão diretamente no sistema.

---

## 📂 Estrutura do Projeto (Resumo)

````
📦 SolucaoFitness
 ┣ 📜 iniciar_sistema.bat      # Script de auto-inicialização (Windows)
 ┣ 📜 CONTEXTO_PROJETO.md      # Regras de negócio e escopo detalhado
 ┣ 📂 backend
 ┃ ┣ 📜 main.py                # Rotas da API, CRUD e processamento de ficheiros
 ┃ ┗ 📜 mestre.json            # Banco de dados de clientes e agendamentos
 ┗ 📂 frontend
   ┗ 📂 src
     ┣ 📂 components           # Componentes modulares (Extrator, Clientes, Toast)
     ┃ ┗ 📂 clientes           # Subcomponentes da Roteirização (Modais, Tabelas, Filtros)
     ┣ 📂 hooks                # Regras de negócio do React (useClientes.js)
     ┗ 📜 App.jsx              # Gestor de rotas/abas superior
```