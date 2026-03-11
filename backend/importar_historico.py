import json
import pandas as pd
import os

def limpar_nome(nome):
    if pd.isna(nome): return ""
    return str(nome).strip()

def formatar_data(valor):
    """Converte o valor do Excel para uma data legível, ignorando lixo"""
    if pd.isna(valor) or str(valor).strip().lower() in ['', 'x', 'junho', 'mensal']:
        return None
    try:
        # Se for uma data reconhecível, converte para o formato PT-BR
        dt = pd.to_datetime(valor)
        return dt.strftime('%d/%m/%Y')
    except:
        # Se for um texto estranho mas válido, limpa e guarda
        return str(valor).strip()

def executar_importacao():
    print("=== INICIANDO MIGRAÇÃO DO HISTÓRICO DE VISITAS ===\n")

    arquivo_json = 'mestre.json'
    with open(arquivo_json, 'r', encoding='utf-8') as f:
        db_clientes = json.load(f)

    # Cria um índice rápido para achar o cliente exato no JSON
    index_clientes = {limpar_nome(c['cliente']['nome']): c for c in db_clientes if 'cliente' in c}

    # Carregar o Dicionário De/Para
    dicionario_de_para = {}
    df_depara = pd.read_excel('Tabela_De_Para_Clientes.xlsx', engine='openpyxl')
    for _, linha in df_depara.iterrows():
        antigo = limpar_nome(linha.iloc[0])
        novo = limpar_nome(linha.iloc[1])
        if antigo and novo:
            dicionario_de_para[antigo] = novo

    # Ler o arquivo de Visitas
    planilhas = pd.read_excel('Controle de Visita Solução Fitness.xlsx', sheet_name=None, engine='openpyxl')

    total_clientes_atualizados = 0
    total_datas_importadas = 0

    for nome_aba, df in planilhas.items():
        colunas_reais = df.columns.tolist()
        
        for _, linha in df.iterrows():
            nome_antigo = limpar_nome(linha.iloc[0])
            if not nome_antigo or nome_antigo.lower() in ['contratos', 'contrato']:
                continue

            nome_oficial = dicionario_de_para.get(nome_antigo, nome_antigo)

            # Se o cliente existir no nosso sistema
            if nome_oficial in index_clientes:
                cliente_ref = index_clientes[nome_oficial]
                
                # Cria a gaveta de histórico se não existir
                if 'historico_visitas' not in cliente_ref:
                    cliente_ref['historico_visitas'] = []

                datas_encontradas = 0
                
                # Vasculha todas as colunas daquela linha à procura de datas
                for col in colunas_reais:
                    nome_coluna = str(col).strip().lower()
                    
                    # Só olha para as colunas que são meses ou começam por "DATA"
                    meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
                    if nome_coluna in meses or nome_coluna.startswith('data'):
                        valor_celula = linha[col]
                        data_formatada = formatar_data(valor_celula)
                        
                        # Adiciona se não for repetida
                        if data_formatada and data_formatada not in cliente_ref['historico_visitas']:
                            cliente_ref['historico_visitas'].append(data_formatada)
                            datas_encontradas += 1
                            total_datas_importadas += 1

                if datas_encontradas > 0:
                    total_clientes_atualizados += 1

    # Guarda as alterações permanentemente no mestre.json
    with open(arquivo_json, 'w', encoding='utf-8') as f:
        json.dump(db_clientes, f, ensure_ascii=False, indent=4)

    print("==================================================")
    print(f"✅ SUCESSO ABSOLUTO!")
    print(f"   - Clientes atualizados: {total_clientes_atualizados}")
    print(f"   - Total de visitas arquivadas: {total_datas_importadas}")
    print("==================================================")
    print("O seu 'mestre.json' agora tem o histórico completo. Já pode apagar as planilhas se quiser!")

if __name__ == "__main__":
    executar_importacao()