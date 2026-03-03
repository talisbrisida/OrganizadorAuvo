import json
import os
import pandas as pd
from datetime import timedelta
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="API Roteirização Logística - Escopo Zero")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ARQUIVO_DADOS = "mestre.json"
ARQUIVO_CSV = "importacao.csv"
ARQUIVO_TECNICOS = "tecnicos.json"

# --- FUNÇÕES DE LÓGICA DE NEGÓCIO ---

def ajustar_fim_de_semana(data):
    """Se cair no Sábado (5), volta pra Sexta. Se cair no Domingo (6), joga pra Segunda."""
    if data.weekday() == 5:  # Sábado
        return data - timedelta(days=1)
    elif data.weekday() == 6:  # Domingo
        return data + timedelta(days=1)
    return data

def calcular_proximo_vencimento(ultima_visita_str, frequencia):
    """Calcula a próxima data baseada na frequência e pula finais de semana."""
    try:
        # Converte a string "YYYY-MM-DD" para o formato de data do Python
        data_base = pd.to_datetime(ultima_visita_str).date()
    except Exception:
        # Se a data vier vazia ou quebrada no CSV, retorna None
        return None, None

    # Mapeia a frequência para dias (aproximado para regra de negócio rápida)
    dias_soma = 30
    if frequencia == "Bimestral":
        dias_soma = 60
    elif frequencia == "Trimestral":
        dias_soma = 90

    data_vencimento = data_base + timedelta(days=dias_soma)
    data_ajustada = ajustar_fim_de_semana(data_vencimento)
    
    # Dicionário para traduzir o dia da semana para português
    dias_semana_pt = {0: "Segunda-feira", 1: "Terça-feira", 2: "Quarta-feira", 3: "Quinta-feira", 4: "Sexta-feira"}
    nome_dia = dias_semana_pt.get(data_ajustada.weekday(), "Desconhecido")

    return str(data_ajustada), nome_dia

# --- ROTAS DA API ---

@app.get("/")
def read_root():
    return {"status": "ok", "mensagem": "Motor de roteirização online!"}

@app.get("/clientes")
def listar_clientes():
    """Retorna os clientes que já estão salvos no JSON Mestre."""
    if not os.path.exists(ARQUIVO_DADOS):
        return []
    with open(ARQUIVO_DADOS, "r", encoding="utf-8") as f:
        return json.load(f)

@app.post("/importar")
def importar_csv_para_json():
    """Lê o arquivo CSV, processa as regras de negócio e salva no mestre.json"""
    if not os.path.exists(ARQUIVO_CSV):
        return {"erro": f"Arquivo {ARQUIVO_CSV} não encontrado na pasta."}

    # 1. Lê o CSV usando Pandas
    df = pd.read_csv(ARQUIVO_CSV)
    
    clientes_processados = []
    
    # Contadores para gerar IDs únicos (ex: SOL-001, LOC-001)
    cont_sol = 1
    cont_loc = 1

    # 2. Varre linha por linha do Excel
    for index, row in df.iterrows():
        origem = str(row['ORIGEM'])
        
        # Gera o ID baseado na origem
        if origem == "Solução Fitness":
            id_tarefa = f"SOL-{cont_sol:03d}"
            cont_sol += 1
        else:
            id_tarefa = f"LOC-{cont_loc:03d}"
            cont_loc += 1

        # Calcula as datas usando nossa função inteligente
        ultima_visita = str(row['ULTIMA_VISITA'])
        frequencia = str(row['FREQUENCIA'])
        prox_vencimento, dia_semana = calcular_proximo_vencimento(ultima_visita, frequencia)

        # Monta o contrato exato do nosso mestre.json
        cliente_json = {
            "id_tarefa": id_tarefa,
            "cliente": {
                "nome": str(row['CLIENTE']),
                "endereco_completo": str(row['ENDERECO']),
                "zona_roteirizacao": str(row['ZONA'])
            },
            "contrato": {
                "origem": origem,
                "frequencia_original": frequencia,
                "tempo_estimado_horas": float(row['TEMPO_HORAS'])
            },
            "datas": {
                "ultimo_atendimento": ultima_visita,
                "proximo_vencimento": prox_vencimento,
                "dia_da_semana_vencimento": dia_semana
            },
            "agendamento_atual": {
                "status": "Pendente",
                "tecnico_alocado": None,
                "data_alocada": None
            }
        }
        clientes_processados.append(cliente_json)

    # 3. Salva a lista final no mestre.json
    with open(ARQUIVO_DADOS, "w", encoding="utf-8") as f:
        json.dump(clientes_processados, f, ensure_ascii=False, indent=4)

    return {
        "status": "sucesso", 
        "mensagem": f"{len(clientes_processados)} clientes importados, calculados e salvos com sucesso!"
    }


# --- AUXILIARES ---
def carregar_json(arquivo):
    if not os.path.exists(arquivo): return []
    with open(arquivo, "r", encoding="utf-8") as f:
        return json.load(f)

def salvar_json(arquivo, dados):
    with open(arquivo, "w", encoding="utf-8") as f:
        json.dump(dados, f, ensure_ascii=False, indent=4)

# --- ROTAS DE GESTÃO DE TÉCNICOS ---

@app.get("/tecnicos")
def listar_tecnicos():
    return carregar_json(ARQUIVO_TECNICOS)

@app.post("/tecnicos")
def cadastrar_tecnico(tecnico: dict):
    tecnicos = carregar_json(ARQUIVO_TECNICOS)
    tecnico["id"] = len(tecnicos) + 1
    # Garante o formato exigido pelo modelo do Auvo: "Nome - Cargo"
    tecnico["nome_auvo"] = f"{tecnico['nome']} - {tecnico['cargo']}"
    tecnicos.append(tecnico)
    salvar_json(ARQUIVO_TECNICOS, tecnicos)
    return tecnico

# --- MOTOR DE DISTRIBUIÇÃO AUTOMÁTICA ---

@app.post("/distribuir-tarefas")
def distribuir_tarefas():
    tarefas = carregar_json(ARQUIVO_DADOS)
    tecnicos = carregar_json(ARQUIVO_TECNICOS)
    
    atribuídas = 0
    for tarefa in tarefas:
        # Só tenta alocar se estiver pendente
        if tarefa["agendamento_atual"]["status"] == "Pendente":
            zona_cliente = tarefa["cliente"]["zona_roteirizacao"]
            
            # Busca técnico que atenda a zona do cliente
            for tecnico in tecnicos:
                if tecnico["ativo"] and zona_cliente in tecnico["zonas_atendimento"]:
                    tarefa["agendamento_atual"]["tecnico_alocado"] = tecnico["nome_auvo"]
                    tarefa["agendamento_atual"]["status"] = "Agendado"
                    # No futuro, aqui entra a lógica de data_alocada baseada no calendário
                    tarefa["agendamento_atual"]["data_alocada"] = tarefa["datas"]["proximo_vencimento"]
                    atribuídas += 1
                    break 

    salvar_json(ARQUIVO_DADOS, tarefas)
    return {"mensagem": f"{atribuídas} tarefas foram distribuídas com sucesso!"}