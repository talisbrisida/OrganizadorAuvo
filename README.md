# Contexto do Projeto: Sistema Solução Fitness (Integração Auvo)

## 1. Objetivo Principal
Criar uma plataforma interna para a Solução Fitness que automatiza e centraliza duas operações cruciais relacionadas com o sistema Auvo:
1. **Gestão e Roteirização de Preventivas:** Organizar a agenda de manutenções mensais em massa e exportar a lista no formato exato exigido pelo importador do Auvo.
2. **Extrator de Tarefas (Filtro de Relatos):** Ler relatórios de tarefas exportados do Auvo, filtrar automaticamente os relatos dos técnicos à procura de necessidades de manutenção/orçamentos (usando palavras-chave) e exibir os resultados.

## 2. Arquitetura do Sistema
O projeto foi refatorado para uma arquitetura moderna, dividida em duas camadas (Microsserviços):

### Front-end (Interface do Utilizador)
* **Tecnologias:** React.js (com Vite), Tailwind CSS.
* **Estrutura:** Componentizada (`/src/components/`).
* **Módulos Atuais:**
  * `Clientes.jsx`: Interface principal de roteirização. Inclui a Tabela de Clientes, Barra de Filtros, Edição em Massa (Lote) e Modais de Configuração Auvo.
  * `Extrator.jsx`: Interface para upload de relatórios Excel/CSV, definição de palavras-chave e visualização das estatísticas e tarefas filtradas.
  * `Toast.jsx`: Sistema global de notificações não-bloqueantes.

### Back-end (Motor de Lógica)
* **Tecnologias:** Python com FastAPI, Pandas, Uvicorn.
* **Banco de Dados:** Ficheiro físico `mestre.json` (atua como base de dados NoSQL leve).
* **Módulos Atuais (`main.py`):**
  * **Rotas CRUD:** Leitura e atualização de clientes, zonas e técnicos.
  * **Motor de Exportação:** Gera um ficheiro `.xlsx` (com o `openpyxl`) estritamente formatado com as 29 colunas padrão do Auvo.
  * **Motor de Extração:** Recebe ficheiros multipart (`.csv`, `.xls`, `.xlsx`), processa os DataFrames via Pandas através de Regex (palavras-chave) e devolve as ocorrências em formato JSON para o Front-end.

## 3. Regras de Negócio Estabelecidas
* **Importação Auvo (Clientes Avulsos):** O ficheiro exportado para o Auvo deve enviar apenas o `Nome` exato do cliente e deixar o `Endereço` vazio. Isto força o Auvo a vincular a tarefa ao cadastro existente, evitando a criação de "clientes avulsos".
* **Proteção de Zonas:** A alteração de zonas roteirizadas requer confirmação explícita (Modal), pois afeta a logística de distribuição.
* **Fila de Lote:** Atualizações em massa no Front-end são enviadas individualmente em fila (loop) para não causar erros de concorrência (Bloqueio 500) na gravação do `mestre.json`.

## 4. Próximos Passos (Backlog / Ideias Futuras)
* [ ] **Cálculo de Preventivas:** Automatizar o preenchimento da data baseando-se na frequência de contrato do cliente.
* [ ] **Filtros de Pendências Rápidas:** Botões na UI para isolar clientes sem técnico ou data atribuída.
* [ ] **Exportação de PDF no Extrator:** Reimplementar a geração do relatório em PDF do extrator diretamente na nova interface React.