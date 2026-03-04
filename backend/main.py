import json, os, csv
from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from datetime import timedelta, datetime

app = FastAPI(title="Organizador Auvo - Gestão de Cadastros")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ARQUIVO_DADOS = "mestre.json"
ARQUIVO_TECNICOS = "tecnicos.json"
ARQUIVO_ZONAS = "zonas.json" # Novo arquivo para gerenciar zonas globalmente

def carregar_json(arquivo):
    if not os.path.exists(arquivo): return []
    with open(arquivo, "r", encoding="utf-8") as f:
        return json.load(f)

def salvar_json(arquivo, dados):
    with open(arquivo, "w", encoding="utf-8") as f:
        json.dump(dados, f, ensure_ascii=False, indent=4)

# --- GESTÃO DE ZONAS (GLOBAL) ---

@app.get("/zonas")
def listar_zonas():
    return carregar_json(ARQUIVO_ZONAS)

@app.post("/zonas")
def adicionar_zona(zona: str = Body(..., embed=True)):
    zonas = carregar_json(ARQUIVO_ZONAS)
    if zona not in zonas:
        zonas.append(zona)
        salvar_json(ARQUIVO_ZONAS, zonas)
    return zonas

@app.delete("/zonas/{nome}")
def remover_zona(nome: str):
    zonas = carregar_json(ARQUIVO_ZONAS)
    if nome in zonas:
        zonas.remove(nome)
        salvar_json(ARQUIVO_ZONAS, zonas)
    return zonas

# --- GESTÃO DE TÉCNICOS (EDIÇÃO DE NOME) ---

@app.get("/tecnicos")
def listar_tecnicos():
    return carregar_json(ARQUIVO_TECNICOS)

@app.put("/tecnicos/{id}")
def atualizar_tecnico(id: int, dados: dict):
    tecnicos = carregar_json(ARQUIVO_TECNICOS)
    for t in tecnicos:
        if t["id"] == id:
            if "nome" in dados: t["nome"] = dados["nome"]
            if "cargo" in dados: t["cargo"] = dados["cargo"]
            if "ativo" in dados: t["ativo"] = dados["ativo"]
            # Atualiza o nome_auvo automaticamente ao mudar nome ou cargo
            t["nome_auvo"] = f"{t['nome']} - {t['cargo']}"
            break
    salvar_json(ARQUIVO_TECNICOS, tecnicos)
    return {"status": "ok"}

# --- GESTÃO DE CLIENTES (FILTROS POR BAIRRO E CIDADE) ---

def extrair_bairro_cidade(endereco):
    """Extrai bairro e cidade de forma mais robusta, com base no padrão '... - Bairro - Cidade'."""
    # Divide o endereço pelo hífen e remove partes vazias ou com apenas espaços
    partes = [p.strip() for p in endereco.split('-') if p.strip()]

    bairro = "Centro"  # Valor padrão
    cidade = "Desconhecido"  # Valor padrão

    if len(partes) >= 2:
        # Assume que o formato é '... - Bairro - Cidade'.
        # A última parte é a cidade e a penúltima é o bairro.
        cidade = partes[-1]
        bairro = partes[-2]
    elif len(partes) == 1:
        # Se houver apenas uma parte, é provável que seja a cidade (ex: "São José dos Campos").
        cidade = partes[0]
        # O bairro fica como 'Centro' por padrão.
    else:
        # Caso o endereço esteja vazio, retorna valores padrão de falha.
        bairro = "Não identificado"
        cidade = "Não identificada"

    return bairro, cidade

@app.get("/clientes")
def listar_clientes():
    tarefas = carregar_json(ARQUIVO_DADOS)
    for t in tarefas:
        b, c = extrair_bairro_cidade(t["cliente"]["endereco_completo"])
        t["cliente"]["bairro"] = b
        t["cliente"]["cidade"] = c
    return tarefas

@app.put("/clientes/{id}")
def atualizar_cliente(id: str, dados: dict):
    tarefas = carregar_json(ARQUIVO_DADOS)
    for t in tarefas:
        if t["id_tarefa"] == id:
            if "zona" in dados: t["cliente"]["zona_roteirizacao"] = dados["zona"]
            if "tecnico" in dados: t["agendamento_atual"]["tecnico_alocado"] = dados["tecnico"]
            if "data" in dados: t["agendamento_atual"]["data_alocada"] = dados["data"]
            if "hora" in dados: t["agendamento_atual"]["hora_inicio"] = dados["hora"]
            t["agendamento_atual"]["status"] = "Agendado"
            break
    salvar_json(ARQUIVO_DADOS, tarefas)
    return {"status": "sucesso"}