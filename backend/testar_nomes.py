import json
import pandas as pd
import os

def limpar_nome(nome):
    """Remove espaços invisíveis e garante que o dado é texto válido"""
    if pd.isna(nome): return ""
    return str(nome).strip()

def executar_teste():
    print("=== INICIANDO TESTE COM ARQUIVO EXCEL ÚNICO (.XLSX) ===\n")

    # 1. Carregar nomes do sistema atual (mestre.json)
    if not os.path.exists('mestre.json'):
        print("❌ Erro: Arquivo 'mestre.json' não encontrado na pasta.")
        return

    with open('mestre.json', 'r', encoding='utf-8') as f:
        db_clientes = json.load(f)
    nomes_sistema = {limpar_nome(c['cliente']['nome']) for c in db_clientes if 'cliente' in c}
    
    # 2. Carregar o Dicionário De/Para (agora lendo do Excel)
    dicionario_de_para = {}
    arquivo_de_para = 'Tabela_De_Para_Clientes.xlsx'
    
    if os.path.exists(arquivo_de_para):
        df_depara = pd.read_excel(arquivo_de_para, engine='openpyxl')
        for _, linha in df_depara.iterrows():
            antigo = limpar_nome(linha.iloc[0])
            novo = limpar_nome(linha.iloc[1])
            if antigo and novo:
                dicionario_de_para[antigo] = novo
        print(f"📘 Dicionário De/Para carregado: {len(dicionario_de_para)} traduções prontas.")
    else:
        print(f"⚠️ Aviso: Arquivo De/Para '{arquivo_de_para}' não encontrado.")

    # 3. Ler o arquivo de Visitas (Lê TODAS as abas automaticamente)
    arquivo_visitas = 'Controle de Visita Solução Fitness.xlsx'
    nomes_nas_visitas_traduzidos = set()

    if os.path.exists(arquivo_visitas):
        # A mágica acontece aqui: sheet_name=None pega todas as abas da planilha
        planilhas = pd.read_excel(arquivo_visitas, sheet_name=None, engine='openpyxl')
        
        for nome_aba, df in planilhas.items():
            print(f"📄 Vasculhando aba: '{nome_aba}'...")
            
            # Assume que os nomes estão na primeira coluna (índice 0)
            nomes_coluna = df.iloc[:, 0].apply(limpar_nome).tolist()
            
            for nome_antigo in nomes_coluna:
                if not nome_antigo: continue
                # Pula a linha se for só o cabeçalho
                if nome_antigo.lower() in ['contratos', 'contrato']: continue
                
                # Traduz se existir no De/Para, senão mantém o que está escrito
                nome_traduzido = dicionario_de_para.get(nome_antigo, nome_antigo)
                nomes_nas_visitas_traduzidos.add(nome_traduzido)
                
        print(f"✅ O arquivo '{arquivo_visitas}' foi processado com sucesso!")
    else:
        print(f"❌ ERRO: Arquivo '{arquivo_visitas}' não encontrado na pasta.")
        return

    # 4. Cruzamento de Dados
    match_perfeito = nomes_nas_visitas_traduzidos.intersection(nomes_sistema)
    nao_encontrados = nomes_nas_visitas_traduzidos - nomes_sistema

    print("\n==================================================")
    print(f"✅ MATCH PERFEITO (Prontos para importar as datas): {len(match_perfeito)}")
    print("==================================================")
    
    print(f"\n❌ ERRO: Nomes nas visitas que não acharam par no sistema: {len(nao_encontrados)}")
    for nome in sorted(nao_encontrados):
        print(f"   - '{nome}'")

    if len(nao_encontrados) > 0:
        print("\n💡 DICA: Adicione os nomes acima na coluna esquerda do seu De/Para ('Tabela_De_Para_Clientes.xlsx') e coloque o nome oficial do Auvo na coluna da direita!")

if __name__ == "__main__":
    executar_teste()