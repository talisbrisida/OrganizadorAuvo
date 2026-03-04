import json
import pandas as pd

def aplicar_de_para():
    arquivo_json = "mestre.json"
    arquivo_de_para = "Tabela_De_Para_Clientes.xlsx" # Certifique-se de que o arquivo salvo no Excel tem este nome

    print("Carregando a tabela De/Para...")
    try:
        df = pd.read_excel(arquivo_de_para)
    except Exception as e:
        # Tenta ler como CSV caso você tenha salvo em CSV
        try:
            df = pd.read_csv("Tabela_De_Para_Clientes.csv")
        except:
            print("Erro: Não foi possível encontrar a planilha Tabela_De_Para_Clientes.xlsx na pasta.")
            return

    # Cria um dicionário para busca rápida: { "Nome Antigo": "Nome Novo" }
    mapa_nomes = {}
    for index, row in df.iterrows():
        nome_antigo = str(row["Nome no Sistema Antigo (JSON)"]).strip()
        nome_novo = str(row["Nome Oficial no Auvo (COLE AQUI)"]).strip()
        
        # Só adiciona se o nome novo foi preenchido e não está vazio (nan)
        if nome_novo != "nan" and nome_novo != "":
            mapa_nomes[nome_antigo] = nome_novo

    print("Carregando mestre.json...")
    with open(arquivo_json, 'r', encoding='utf-8') as f:
        dados = json.load(f)

    clientes_atualizados = 0

    print("\n--- APLICANDO CORREÇÕES ---")
    for item in dados:
        nome_atual = item["cliente"]["nome"].strip()
        
        # Se o nome atual estiver na nossa tabela e tiver um nome novo correspondente
        if nome_atual in mapa_nomes:
            novo_nome = mapa_nomes[nome_atual]
            
            if nome_atual != novo_nome:
                print(f"✔️ Atualizado: '{nome_atual}'  ==>  '{novo_nome}'")
                item["cliente"]["nome"] = novo_nome
                clientes_atualizados += 1

    # Salva o JSON atualizado
    with open(arquivo_json, 'w', encoding='utf-8') as f:
        json.dump(dados, f, ensure_ascii=False, indent=4)

    print("\n--- RESUMO ---")
    print(f"Total de clientes atualizados no mestre.json: {clientes_atualizados}")
    print("Agora o seu sistema está 100% sincronizado com o Auvo!")

if __name__ == "__main__":
    aplicar_de_para()