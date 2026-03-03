# CONTEXTO DO PROJETO: Painel de Despacho Logístico (Escopo Zero)

## 🎯 Objetivo do Projeto
Criar uma aplicação interna para roteirização e gestão da agenda de técnicos de manutenção (preventiva e corretiva) de equipamentos fitness. A aplicação deve consolidar dados, permitir roteirização automática e manual (Kanban Drag-and-Drop) e gerar como saída um arquivo `.csv` estritamente formatado para importação em massa no sistema Auvo.

## 🛠️ Stack Tecnológica (Monolito Modular / 3-Tier)
* **Front-end:** React.js (inicializado via Vite), focado em Single Page Application (SPA).
* **Back-end:** Python utilizando o framework FastAPI.
* **Persistência de Dados:** Arquivo local `mestre.json` (com estrutura pronta para migração futura para NoSQL/SQLite).

## ⚖️ Regras de Negócio Inegociáveis (Core Logic)
1.  **Capacidade Diária:** A jornada de trabalho dos técnicos (Técnico A e Técnico B) é de Segunda a Sexta, das 08h às 17h, com 1 hora de almoço. O limite estrito de alocação é de **8 horas diárias úteis por técnico**.
2.  **Bloqueios de Calendário:** O sistema nunca deve agendar atendimentos em sábados e domingos. Se o vencimento cair no fim de semana, realocar para o dia útil mais próximo. Feriados nacionais, estaduais (SP) e municipais de Jacareí-SP devem ser bloqueados da mesma forma.
3.  **Lógica de Afinidade (Zonas):** Os endereços devem ser classificados em Macro-regiões (Ex: Zona 1 - SJC Oeste, Zona 3 - Jacareí). O motor de roteirização deve agrupar clientes da mesma zona no mesmo dia para um mesmo técnico, evitando grandes deslocamentos.
4.  **Cálculo de Preventiva:** A Data Limite do Próximo Atendimento é sempre: `Data do Último Atendimento + Frequência contratual` (30 dias para mensal, 90 dias para trimestral, etc.).

## 💻 Estrutura das Telas (Front-end)
1.  **Tela de Gestão de Clientes (Tabela):** Listagem de todos os clientes pendentes do mês. Permite edição rápida (inline) do "Tempo Estimado (horas)" e correção manual da "Zona" antes de enviar para roteirização.
2.  **Tela de Despacho (Kanban):** * Exibe a semana ou o mês montado pela roteirização automática.
    * Permite Drag-and-Drop de cards de clientes entre dias e técnicos.
    * Possui um somador dinâmico de horas no cabeçalho de cada dia/técnico que alerta (fica vermelho) se ultrapassar as 8 horas.
    * Contém o botão final: "Exportar CSV Auvo".

## 📄 Contrato de Dados Base (JSON Mestre)
O Back-end deve processar e salvar as informações neste formato central:
```json
[
  {
    "id_tarefa": "SOL-1042",
    "cliente": {
      "nome": "CONDOMINIO SMART RESIDENCE",
      "endereco_completo": "R. Itajai, 161 - SJC",
      "zona_roteirizacao": "Zona 1"
    },
    "contrato": {
      "origem": "Solução Fitness",
      "frequencia_original": "Mensal",
      "tempo_estimado_horas": 1.5
    },
    "datas": {
      "ultimo_atendimento": "2026-02-02",
      "proximo_vencimento": "2026-03-04"
    },
    "agendamento_atual": {
      "status": "Pendente", 
      "tecnico_alocado": null,
      "data_alocada": null
    }
  }
]