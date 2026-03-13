# 🧠 DOCUMENTO DE ARQUITETURA E REQUISITOS (PRD) - IA INJECTION

**Projeto:** Sistema de Gestão de Rotas e Extração de Tarefas  
**Organização:** Solução Fitness  
**Data do Snapshot:** Março de 2026

Este documento define o escopo, arquitetura, regras de negócio e diretrizes técnicas do sistema de roteirização e gestão de preventivas, servindo como base de conhecimento (Single Source of Truth) para LLMs e desenvolvedores.

---

## 1. 🎯 CONTEXTO E ESCOPO

**Stakeholders:**
- **Desenvolvimento e Manutenção:** Coordenador Técnico (Talis).
- **Usuários Finais:** Equipe de Backoffice / Operações da Solução Fitness.
- **Executores:** Técnicos de campo (ex: Wilson, equipes externas) que recebem os dados via Auvo.

**Escopo do Sistema:**
- **Dentro do Escopo:** Gestão visual de rotas de manutenção preventiva, distribuição de técnicos e zonas, controle de histórico de visitas, extração de relatórios de tarefas em PDF e higienização/validação de dados (Left Join) com a base do Auvo.
- **Fora do Escopo:** Controle financeiro, faturamento, CRM de vendas e sincronização bidirecional em tempo real via API com o Auvo (atualmente operando via flat-files).

**Objetivos de Negócio (Métricas de Sucesso):**
- Reduzir em 80% o tempo gasto na roteirização mensal.
- Garantir 100% de integridade na nomenclatura dos clientes entre o sistema interno e o Auvo.
- Eliminar falhas humanas no cálculo de próximas visitas preventivas.

---

## 2. ⚙️ REQUISITOS FUNCIONAIS

**Principais Casos de Uso (User Stories):**

1. **Filtro de Fila:** O coordenador precisa ver apenas os clientes pendentes no mês atual para focar nas lacunas da agenda.
2. **Edição em Lote:** O coordenador seleciona 15 clientes de uma mesma zona e atribui um técnico e uma data de uma só vez.
3. **Extração de Relatório:** O coordenador precisa gerar um PDF limpo das tarefas do mês para prestação de contas.

**Fluxo Detalhado: "Conclusão de Visita"**

1. O usuário clica em "Concluir" num card de cliente (individual) ou no lote.
2. O sistema invoca o `<ModalGenerico />` solicitando confirmação.
3. Ao confirmar, a `data_alocada` do agendamento atual é injetada no array `historico_visitas`.
4. O objeto `agendamento_atual` é limpo (liberando o cliente para a próxima rota).
5. A UI re-renderiza, removendo o cliente da visualização "Pendentes do Mês".

**Regras de Validação:**
- O nome do cliente (`cliente.nome`) atua como Chave Primária natural.
- Não é permitido concluir uma visita que não possua uma data alocada válida.

---

## 3. 🛡️ REQUISITOS NÃO FUNCIONAIS

- **Performance:** A interface React deve renderizar centenas de cards instantaneamente (<1s) utilizando hooks de memoização (`useMemo` para filtros).
- **Segurança:** Sistema de uso interno. A base de dados (`mestre.json`) reside no backend local, sem exposição de portas públicas.
- **Escalabilidade:** Arquitetura flat-file suporta a carga atual (~100 clientes) de forma ultra-rápida. A separação de lógica nos hooks permite fácil migração futura para um banco SQL/NoSQL sem refatorar a UI.
- **Manutenibilidade:** Padrão estrito de Componentização (Composition Pattern). Proibida a repetição de estruturas visuais de modais ou botões.

---

## 4. 📐 ARQUITETURA TÉCNICA

**Diagrama de Alto Nível:**

```
[ UI React (Tailwind) ] <--> [ Hooks de Estado ] <--> [ mestre.json (SSOT) ]
[ Scripts Python (Data-Ops) ] <--> [ mestre.json ] & [ clientes_auvo.xlsx ]
```

**Fluxo de Dados e Integração:**
- O React consome o `mestre.json` para montar a interface.
- O script Python (`validar_nomes.py`) atua como middleware de sanitização, lendo o JSON e o XLSX exportado do Auvo, usando `difflib` para encontrar discrepâncias ortográficas e garantir o de-para (Left Join).

---

## 5. 📂 ESTRUTURA DE PASTAS E ARQUIVOS

```text
/
├── src/                      # Frontend React
│   ├── components/           # Componentes de UI e Telas
│   │   ├── ui/               # Componentes burros/genéricos (ModalGenerico.jsx)
│   │   ├── clientes/         # Fragmentos de negócio (BarraFiltros, ModalAuvo)
│   │   ├── Clientes.jsx      # Tela principal de Gestão de Rotas
│   │   └── Extrator.jsx      # Tela de Relatórios para Impressão
│   ├── hooks/                # Lógica de estado e filtros (useClientes.js)
│   └── App.jsx               # Entrypoint de rotas frontend
├── backend/                  # Data-Ops e Persistência
│   ├── validar_nomes.py      # Script de integridade (Left Join)
│   ├── mestre.json           # Banco de Dados Flat-file (SSOT)
│   └── clientes_auvo.xlsx    # Dump exportado do software de campo
├── docs/
│   └── CONTEXTO_PROJETO.md   # Este arquivo
├── package.json              # Dependências do Frontend (Vite/React/Tailwind)
└── tailwind.config.js        # Configurações de design system corporativo
```

---

## 6. 🗄️ DADOS E MODELOS

**Schema do `mestre.json` (Exemplo Parcial):**

```json
{
    "id_tarefa": "LOC-001",
    "cliente": {
        "nome": "Condomínio Esplanada Resort",
        "zona_roteirizacao": "Zona 6 - SJC Oeste"
    },
    "contrato": {
        "origem": "Casa do Fitness",
        "frequencia_original": "Mensal"
    },
    "datas": {
        "ultimo_atendimento": "2026-02-04",
        "proximo_vencimento": "2026-03-06"
    },
    "agendamento_atual": {
        "tecnico_alocado": "Wilson - auxiliar",
        "data_alocada": "2026-03-30",
        "roteirizar": "Sim"
    },
    "historico_visitas": ["13/05/2025", "04/02/2026"]
}
```

> **Nota:** `cliente.nome` é a Chave Primária de cruzamento com o Auvo.

**Regras de Consistência (Modelo Auvo):**

O campo "Nome" no Auvo (linha 3 em diante no Excel) deve ser correspondência exata (case-sensitive) com o campo `cliente.nome` do JSON.

---

## 7. 🔄 PROCESSOS DE DESENVOLVIMENTO

- **Versionamento:** Uso de Git. O projeto é mantido na branch `master`.
- **Commits:** Mensagens claras descrevendo a ação (ex: `feat: add ModalGenerico na tela principal`).
- **Testes:** Validação visual no React. Validação de dados estritamente via script Python no backend antes de consolidações em massa.

---

## 8. 🚀 BACKLOG E ROADMAP

### Alta Prioridade: Motor de Cálculo Automático

- **O que é:** Lógica para ler `ultimo_atendimento` e `frequencia_original` para gerar o `proximo_vencimento`.
- **Dependência:** A base de nomes e datas do mês atual precisa estar 100% higienizada.

### Baixa Prioridade: Automação API Auvo

- **O que é:** Substituir a importação de `.xlsx` por chamadas diretas à API REST do Auvo para sincronizar clientes.

---

## 9. ⚖️ GOVERNANÇA E DIRETRIZES TÉCNICAS (MASTER RULES PARA IA)

### 1. Aprovação e Modificação de Dados

- Apenas o Coordenador Técnico aprova mudanças estruturais no `mestre.json`.
- **Regra de Ouro:** NUNCA exportar ou aplicar dados em massa sem antes rodar `python validar_nomes.py` e obter "100% SUCESSO ABSOLUTO".

### 2. Diretrizes de Código e UI

- **Tailwind First:** Estilos inline são proibidos. Usar paleta de cores estabelecida (`#4d1c0c` para a marca, tons de pedra para neutros).
- **Composition sobre Herança:** Componentes React devem envelopar outros componentes através da prop `children`. Modais e blocos visuais nunca devem ter HTML repetido.
- **Respeito ao Print:** Componentes de navegação ou controle técnico devem sempre conter a classe `print:hidden` para não sujar as exportações de PDF.
- **Idiomas:** Código-fonte, variáveis e respostas da IA devem ser mantidos estritamente em Português do Brasil (PT-BR).