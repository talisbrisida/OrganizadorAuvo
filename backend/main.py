import json, os, csv
from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from datetime import timedelta, datetime
from datetime import datetime
from fastapi.responses import FileResponse
from gerador_auvo import gerar_planilha_auvo
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from typing import List
from pydantic import BaseModel
import pandas as pd
import io

class LoteConcluir(BaseModel):
    ids_tarefas: List[str]

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
            # Dados que já tinha:
            if "zona" in dados: t["cliente"]["zona_roteirizacao"] = dados["zona"]
            if "tecnico" in dados: t["agendamento_atual"]["tecnico_alocado"] = dados["tecnico"]
            if "data" in dados: t["agendamento_atual"]["data_alocada"] = dados["data"]
            if "hora" in dados: t["agendamento_atual"]["hora_inicio"] = dados["hora"]
            
            # NOVOS DADOS OBRIGATÓRIOS DO AUVO:
            if "prioridade" in dados: t["agendamento_atual"]["prioridade"] = dados["prioridade"]
            if "tarefa_para" in dados: t["agendamento_atual"]["tarefa_para"] = dados["tarefa_para"]
            if "roteirizar" in dados: t["agendamento_atual"]["roteirizar"] = dados["roteirizar"]
            if "descricao" in dados: t["agendamento_atual"]["descricao"] = dados["descricao"]
            
            t["agendamento_atual"]["status"] = "Agendado"
            break
    salvar_json(ARQUIVO_DADOS, tarefas)
    return {"status": "sucesso"}

#
# --- CONCLUSÃO DE VISITA (HISTÓRICO) ---
# Esta rota serve para marcar uma tarefa como finalizada no sistema.
# Ela move a data que estava agendada para a "gaveta" de histórico_visitas do cliente,
# permitindo manter um registro de todas as manutenções já realizadas,
# e limpa os campos de agendamento para que o cliente fique livre para a próxima escala.


@app.post("/clientes/{id_tarefa}/concluir")
def concluir_visita(id_tarefa: str):
    # 1. Abre o banco de dados diretamente
    try:
        with open('mestre.json', 'r', encoding='utf-8') as f:
            db = json.load(f)
    except Exception:
        raise HTTPException(status_code=500, detail="Erro ao ler o mestre.json")

    # 2. Procura o cliente
    for cliente in db:
        if cliente.get("id_tarefa") == id_tarefa:
            # Prevenção extra para evitar erros se o agendamento estiver vazio
            agendamento = cliente.get("agendamento_atual") or {}
            data_atual = agendamento.get("data_alocada")

            if not data_atual:
                raise HTTPException(status_code=400, detail="Sem data para concluir.")

            # Garante que o histórico existe
            if "historico_visitas" not in cliente:
                cliente["historico_visitas"] = []

            # Formata a data de YYYY-MM-DD para DD/MM/YYYY
            data_formatada = data_atual
            try:
                if "-" in data_atual:
                    dt_obj = datetime.strptime(data_atual, "%Y-%m-%d")
                    data_formatada = dt_obj.strftime("%d/%m/%Y")
            except:
                pass 

            # Guarda no histórico se não for repetido
            if data_formatada not in cliente["historico_visitas"]:
                cliente["historico_visitas"].append(data_formatada)

            # Limpa a data e o técnico para o próximo mês
            if "agendamento_atual" not in cliente:
                cliente["agendamento_atual"] = {}
                
            cliente["agendamento_atual"]["data_alocada"] = ""
            cliente["agendamento_atual"]["tecnico_alocado"] = ""

            # 3. Salva no banco de dados diretamente
            try:
                with open('mestre.json', 'w', encoding='utf-8') as f:
                    json.dump(db, f, ensure_ascii=False, indent=4)
            except Exception:
                raise HTTPException(status_code=500, detail="Erro ao salvar no mestre.json")

            # Devolve o cliente atualizado (com a tela limpa) para o Front-end
            return {"mensagem": "Visita concluída com sucesso!", "cliente": cliente}

    raise HTTPException(status_code=404, detail="Cliente não encontrado.")

# --- EXPORTAÇÃO PARA O AUVO ---
@app.get("/exportar/xlsx")
def exportar_xlsx():
    """Gera e devolve o ficheiro XLSX formatado para o Auvo."""
    arquivo = gerar_planilha_auvo(caminho_json=ARQUIVO_DADOS)
    return FileResponse(path=arquivo, filename="Tarefas_Auvo.xlsx", media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")

# ==========================================
# ROTA DO EXTRATOR DE TAREFAS (INTEGRAÇÃO)
# ==========================================
@app.post("/extrator/processar")
async def processar_extrator(
    file: UploadFile = File(...),
    palavras_chave: str = Form("solicitar peça, quebrado, quebrada, quebrados, orçamento, danificada, danificado, danificados, danificadas, trocar cabo, soldar, trocar, instalar")
):
    """Recebe um ficheiro do Auvo, filtra pelos relatos e devolve os dados."""
    contents = await file.read()
    filename = file.filename.lower()

    try:
        if filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(contents), skiprows=5)
        elif filename.endswith(('.xls', '.xlsx')):
            df = pd.read_excel(io.BytesIO(contents), skiprows=5, engine='openpyxl')
        else:
            return {"erro": "Formato de arquivo não suportado. Use .csv, .xls ou .xlsx"}
    except Exception as e:
        return {"erro": f"Erro ao ler o arquivo: {str(e)}"}

    # Prepara as palavras-chave
    keywords_list = [k.strip() for k in palavras_chave.split(',')]
    regex_busca = '|'.join(keywords_list)

    coluna_descricao = 'Relato'
    if coluna_descricao not in df.columns:
        return {"erro": f"A coluna '{coluna_descricao}' não foi encontrada no arquivo."}

    # Filtra as linhas
    necessidades = df[df[coluna_descricao].astype(str).str.contains(regex_busca, case=False, na=False)].copy()

    # Seleciona apenas as colunas desejadas (verificando se elas existem)
    colunas_desejadas = ['Data', 'Cliente', 'Endereco', 'OS Digital', 'Relato']
    colunas_existentes = [col for col in colunas_desejadas if col in necessidades.columns]
    
    resultado_final = necessidades[colunas_existentes].fillna("") # Remove NaN

    # Estatísticas
    total = len(df)
    filtrados = len(resultado_final)
    stats = {
        'total': total,
        'filtrados': filtrados,
        'percentual': round((filtrados/total)*100, 1) if total > 0 else 0,
        'por_palavra': {}
    }

    for palavra in keywords_list:
        if not resultado_final.empty:
            count = int(resultado_final[coluna_descricao].str.contains(palavra, case=False, na=False).sum())
            if count > 0:
                stats['por_palavra'][palavra] = count

    return {
        "estatisticas": stats,
        "dados": resultado_final.to_dict(orient="records"),
        "palavras_utilizadas": keywords_list
    }

    #Exportar Rota 
@app.get("/exportar-historico")
def exportar_historico():
    try:
        with open('mestre.json', 'r', encoding='utf-8') as f:
            db = json.load(f)
    except Exception:
        raise HTTPException(status_code=500, detail="Erro ao ler o banco de dados.")

    dados = []
    meses_nomes = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

    for c in db:
        cliente_info = c.get("cliente", {})
        
        # Cria a base da linha para o Excel
        linha = {
            "Contrato": cliente_info.get("nome", ""),
            "Endereço": f"{cliente_info.get('bairro', '')} - {cliente_info.get('endereco', '')}",
            "Cidade": cliente_info.get("cidade", ""),
            "Zona": cliente_info.get("zona_roteirizacao", "Sem Zona")
        }
        
        # Cria as colunas de todos os meses vazias
        for m in meses_nomes:
            linha[m] = ""
            
        # Distribui as datas do histórico pelos meses corretos
        historico = c.get("historico_visitas", [])
        for data_str in historico:
            try:
                # Exemplo de data_str: "14/01/2026"
                partes = data_str.split("/")
                if len(partes) == 3:
                    mes_numero = int(partes[1])
                    nome_mes_correspondente = meses_nomes[mes_numero - 1]
                    
                    # Se houver mais de uma visita no mesmo mês, junta com vírgula
                    if linha[nome_mes_correspondente]:
                        linha[nome_mes_correspondente] += f", {data_str}"
                    else:
                        linha[nome_mes_correspondente] = data_str
            except:
                continue # Se a data for inválida, ignora
                
        dados.append(linha)

    # Converte para DataFrame do Pandas
# Converte para DataFrame do Pandas
    df = pd.DataFrame(dados)
    
    # Prepara o ficheiro Excel em memória com formatação premium
    stream = io.BytesIO()
    with pd.ExcelWriter(stream, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name='Controle de Visitas')
        
        # Pega a aba ativa para formatar
        workbook = writer.book
        worksheet = writer.sheets['Controle de Visitas']
        
        # Definir as nossas cores e estilos
        cor_fundo_cabecalho = PatternFill(start_color="0C4D4D", end_color="0C4D4D", fill_type="solid") # Verde da Solução Fitness
        fonte_cabecalho = Font(color="FFFFFF", bold=True)
        borda_fina = Border(
            left=Side(style='thin', color='E0E0E0'), right=Side(style='thin', color='E0E0E0'),
            top=Side(style='thin', color='E0E0E0'), bottom=Side(style='thin', color='E0E0E0')
        )
        alinhar_centro = Alignment(horizontal="center", vertical="center")
        alinhar_esquerda = Alignment(horizontal="left", vertical="center")

        # 1. Pintar o Cabeçalho
        for col_num, celula in enumerate(worksheet[1], 1):
            celula.fill = cor_fundo_cabecalho
            celula.font = fonte_cabecalho
            celula.alignment = alinhar_centro
            celula.border = borda_fina

        # 2. Ajustar o tamanho das colunas e o alinhamento das linhas
        for col in worksheet.columns:
            tamanho_maximo = 0
            letra_coluna = col[0].column_letter # Ex: 'A', 'B', 'C'
            
            for celula in col:
                # Descobre qual é o maior texto daquela coluna para ajustar a largura
                try:
                    if len(str(celula.value)) > tamanho_maximo:
                        tamanho_maximo = len(str(celula.value))
                except:
                    pass
                
                # Formata as linhas normais (abaixo do cabeçalho)
                if celula.row > 1:
                    celula.border = borda_fina
                    # Se for coluna de mês (da coluna E em diante), centraliza. Se for Nome/Endereço, alinha à esquerda.
                    if celula.column > 4:
                        celula.alignment = alinhar_centro
                    else:
                        celula.alignment = alinhar_esquerda

            # Aplica a largura com uma margem de respiro (mas não deixa passar de 45 para não ficar gigante)
            largura_ideal = min(tamanho_maximo + 3, 45)
            worksheet.column_dimensions[letra_coluna].width = largura_ideal
        
    stream.seek(0)
    
    headers = {
        'Content-Disposition': 'attachment; filename="Relatorio_Visitas_SolucaoFitness.xlsx"'
    }
    
    return StreamingResponse(stream, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", headers=headers)

@app.post("/clientes/concluir-lote")
def concluir_visitas_lote(req: LoteConcluir):
    try:
        with open('mestre.json', 'r', encoding='utf-8') as f:
            db = json.load(f)
    except Exception:
        raise HTTPException(status_code=500, detail="Erro ao ler o mestre.json")

    clientes_atualizados = 0

    for cliente in db:
        if cliente.get("id_tarefa") in req.ids_tarefas:
            agendamento = cliente.get("agendamento_atual") or {}
            data_atual = agendamento.get("data_alocada")

            # Só conclui se tiver uma data agendada
            if data_atual:
                if "historico_visitas" not in cliente:
                    cliente["historico_visitas"] = []

                data_formatada = data_atual
                try:
                    if "-" in data_atual:
                        dt_obj = datetime.strptime(data_atual, "%Y-%m-%d")
                        data_formatada = dt_obj.strftime("%d/%m/%Y")
                except:
                    pass 

                if data_formatada not in cliente["historico_visitas"]:
                    cliente["historico_visitas"].append(data_formatada)

                # Limpa a agenda do cliente
                if "agendamento_atual" not in cliente:
                    cliente["agendamento_atual"] = {}
                cliente["agendamento_atual"]["data_alocada"] = ""
                cliente["agendamento_atual"]["tecnico_alocado"] = ""
                
                clientes_atualizados += 1

    try:
        with open('mestre.json', 'w', encoding='utf-8') as f:
            json.dump(db, f, ensure_ascii=False, indent=4)
    except Exception:
        raise HTTPException(status_code=500, detail="Erro ao salvar no mestre.json")

    return {"mensagem": f"{clientes_atualizados} visitas arquivadas com sucesso!"}