# CONTEXTO DO PROJETO: Gerador de Importação Auvo (Escopo Focado)

## 🎯 Objetivo do Projeto
Criar uma aplicação interna focada na organização dinâmica de uma lista de clientes para a criação rápida de pautas de atendimento. O sistema tem como objetivo final gerar um arquivo de planilha estritamente formatado segundo o padrão do aplicativo Auvo, permitindo a importação em massa das tarefas e manutenções (preventivas e corretivas).

## 🛠️ Stack Tecnológica (A definir/confirmar)
* **Front-end:** React.js (Vite) para a interface de organização dinâmica das tarefas.
* **Back-end:** Python (FastAPI) para processamento da lista e geração do arquivo final.
* **Persistência de Dados:** Arquivo local `mestre.json` (ou processamento direto em memória/arquivos temporários).

## ⚖️ Regras de Negócio Inegociáveis (Core Logic)
1. **Fidelidade ao Modelo Auvo:** A aplicação deve gerar um arquivo com as colunas exatamente idênticas ao modelo fornecido (`Tarefas_Modelo.xls - Tarefas.csv`), respeitando a nomenclatura e a ordem dos cabeçalhos.
2. **Validação de Campos Obrigatórios:** O sistema não pode exportar a linha de uma tarefa sem que os seguintes campos exigidos pelo Auvo estejam preenchidos:
   * "Tarefa para (Colaborador, Equipe ou Membro da equipe) Obrigatório"
   * "Prioridade (Alta, Média ou Baixa) Obrigatório"
   * "Descrição da tarefa Obrigatório"
   * "Nome do cliente Obrigatório para clientes cadastrados" (ou, na sua ausência, o "Endereço do cliente Obrigatório para clientes não cadastrados").
   * "Roteirizar (Sim ou Não) Obrigatório"
3. **Cálculo de Preventiva (Opcional mantido):** Se aplicável, a Data do Próximo Atendimento continua sendo gerada com base na frequência do contrato.
4. **Exportação Direta:** O resultado final deve ser um arquivo limpo, pronto para ser jogado na tela de importação do Auvo sem necessidade de edição manual posterior.

## 💻 Estrutura das Telas (Front-end)
1. **Tela de Gestão e Organização:** Listagem dinâmica dos clientes pendentes.
2. **Configuração de Lote:** Opções para definir rapidamente quem será o colaborador responsável e a data/hora para um grupo de tarefas.
3. **Exportação:** Botão dedicado para "Gerar Planilha Auvo", que executa a validação das regras e baixa o arquivo formatado.