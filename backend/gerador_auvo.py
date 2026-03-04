import json
import pandas as pd

def gerar_planilha_auvo(caminho_json="mestre.json"):
    with open(caminho_json, 'r', encoding='utf-8') as f:
        dados = json.load(f)

    # As 29 colunas EXATAS do modelo
    colunas_auvo = [
        "Tarefa para\n(Colaborador, Equipe ou Membro da equipe) \nObrigatório\nColaborador - A tarefa será atribuida ao colaborador escolhido. \n\nEquipe – A tarefa será apresentada a todos da equipe e somente um colaborador poderá ser o responsavel \n\nMembro da equipe - A tarefa será distribuída para os membros da equipe, escolhida pelo sistema através da roteirização. ",
        "Nome do Colaborador ou da Equipe\n\n\nSe a tarefa for para o colaborador colocar o cargo  (igual do sistema) separado por traço na frente do seu nome. \nEx: João - Gestor",
        "Data da tarefa\n(DD/MM/AAAA)\nEx: 31/12/2018",
        "Hora início da tarefa\n(HH:MM)\nEx: 13:00",
        "Hora fim da tarefa\n(HH:MM)\nEx: 14:00\n",
        "Tipo de tarefa\n\n\nSomente os Tipos que já foram criados na Plataforma.",
        "Questionário\n\n\nCaso o campo fique vazio, o sistema irá usar o Questionário Padrão do tipo de tarefa informado.",
        "Prioridade\n(Alta, Média ou Baixa)\nObrigatório\nSe todas as tarefas estiverem com a mesma Prioridade, o sistema irá distribuir por Endereço.",
        "Descrição da tarefa\nObrigatório\n",
        "Tipo de check in\n(Automático ou Manual)\n\nSe o campo ficar vazio, o sistema irá usar o check in configurado para o usuário.",
        "Palavras chave\nSeparadas por vírgula\n\nEx.: Palavra 1, Palavra 2, Palavra 3",
        "Usar pesquisa de satisfacão\n(Sim ou Não)\n\nSe o campo ficar vazio, o sistema irá usar a mesma configuração do Tipo de Tarefa ",
        "Email do destinatário da pesquisa\n\n\nSe o campo ficar vazio, o sistema irá usar o e-mail configurado para o cliente. ",
        "Nome do cliente\nObrigatório para clientes cadastrados\n\nInforme o nome do cliente cadastrado no sistema.\nObs: Caso você deseje criar uma tarefa para um endereço sem precisar cadastrá-lo no sistema, preencha o campo Endereço ou Latitude e Longitude ao lado.\n",
        "Endereço do cliente\nObrigatório para clientes não cadastrados\n\nObs: Caso o endereço seja informado não será cadastrado um novo cliente no sistema.\nA tarefa será aberta para o local, não ficando vinculada a nenhum cliente.\n",
        "Latitude do cliente\nEx: -16,6871539224095\n\nObs: Caso a Latitude e Longitute sejam informadas não será cadastrado um novo cliente no sistema.\nA tarefa será aberta para o local, não ficando vinculada a nenhum cliente.",
        "Longitude do cliente\nEx: -49,2998795304907",
        "Equipamentos\nInformar o identificador\n\nCaso seja mais de um equipamento separa-los por \";\"",
        "Repetir Tarefa?\n(sim, não)",
        "Data término da repetição\n(DD/MM/AAAA)\n\n",
        "Tipo da repetição\n(Todos os dias, semanal, mensal, anual)",
        "Repetir a cada\n(1 a 30) - dia, semana, mês ou ano",
        "Repetição semanal\n(dom, seg, ter, qua, qui, sex, sab)\n\nCaso o tipo de repetição seja semanal, é obrigatório escolher, no mínimo, uma dessas opções\nEx: seg, ter, qua, qui",
        "Repetição mensal\n(dia do mês, dia da semana)\n\nCaso o tipo de repetição seja mensal, é obrigatório escolher uma dessas opções",
        "Roteirizar\n(Sim ou Não)\nObrigatório",
        "Código Externo\n(Código de identificação personalizável para a tarefa)\n\nÉ um código editável que permite identificar uma ou várias tarefas, complementar ao código gerado automaticamente pelo sistema.",
        "Categoria financeira\nEx: Categoria01\n\nPreencha o nome exato da categoria financeira cadastrada no módulo financeiro",
        "Enviar OS digital automaticamente por email\n(Sim ou Não)\n\nSe o campo ficar vazio, o sistema irá usar a mesma configuração do Tipo de Tarefa ",
        "Email da OS digital\n\nSe o campo ficar vazio, o sistema irá usar o e-mail configurado para o cliente.\n"
    ]

    linhas = []

    for item in dados:
        linha = {col: "" for col in colunas_auvo}
        
        agendamento = item.get("agendamento_atual", {})
        cliente = item.get("cliente", {})
        
        # --- REGRAS BÁSICAS ---
        linha[colunas_auvo[0]] = agendamento.get("tarefa_para", "Colaborador")
        linha[colunas_auvo[7]] = agendamento.get("prioridade", "Média")
        linha[colunas_auvo[24]] = agendamento.get("roteirizar", "Sim")
        linha[colunas_auvo[13]] = cliente.get("nome", "")
        linha[colunas_auvo[14]] = ""
        # --- CORREÇÃO 1: Hora e Tipo de Tarefa Obrigatórios ---
        linha[colunas_auvo[3]] = agendamento.get("hora_inicio", "08:00") # Padrão 08:00
        
        # ATENÇÃO: Mude "Manutenção Preventiva" abaixo para o nome exato que está no seu Auvo
        linha[colunas_auvo[5]] = agendamento.get("tipo_tarefa", "Manutenção Preventiva") 
        
        # --- CORREÇÃO 2: Zona jogada para a Descrição ---
        zona = cliente.get("zona_roteirizacao", "")
        descricao_base = agendamento.get("descricao", f"Manutenção Preventiva - {item.get('id_tarefa', '')}")
        
        if zona:
            linha[colunas_auvo[8]] = f"{descricao_base} | Região: {zona}"
        else:
            linha[colunas_auvo[8]] = descricao_base
        
        # --- DATAS E TÉCNICOS ---
        if agendamento.get("data_alocada"):
            partes_data = agendamento["data_alocada"].split("-")
            if len(partes_data) == 3:
                linha[colunas_auvo[2]] = f"{partes_data[2]}/{partes_data[1]}/{partes_data[0]}"
        
        if agendamento.get("tecnico_alocado"):
            linha[colunas_auvo[1]] = agendamento["tecnico_alocado"]

        linhas.append(linha)

    # Cria a tabela
    df = pd.DataFrame(linhas, columns=colunas_auvo)

    # --- CORREÇÃO 3: Força ser XLSX e obriga o nome da aba a ser "Tarefas" ---
    nome_arquivo = "Importacao_Auvo.xlsx"
    df.to_excel(nome_arquivo, index=False, engine="openpyxl", sheet_name="Tarefas")
        
    return nome_arquivo