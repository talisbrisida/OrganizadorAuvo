import json

def limpar_tudo():
    with open('mestre.json', 'r', encoding='utf-8') as f:
        db = json.load(f)

    for cliente in db:
        # Esvazia a gaveta de histórico de todos os clientes
        cliente['historico_visitas'] = []

    with open('mestre.json', 'w', encoding='utf-8') as f:
        json.dump(db, f, ensure_ascii=False, indent=4)

    print("🧹 SUCESSO! Todas as datas foram apagadas. O histórico está limpo!")

if __name__ == "__main__":
    limpar_tudo()