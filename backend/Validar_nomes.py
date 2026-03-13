import json
import difflib
import openpyxl

def validar_nomes():
    caminho_xlsx = 'clientes_auvo_13_03_2026.xlsx' # Coloque o nome exato do seu arquivo Excel aqui
    nomes_auvo = set()

    print("⏳ Carregando banco de dados do Auvo (Excel)...")
    try:
        # data_only=True garante que ele pegue os valores reais e não fórmulas
        wb = openpyxl.load_workbook(caminho_xlsx, data_only=True)
        planilha = wb.active
        
        # Lê a primeira linha para descobrir em qual coluna está o "Nome"
        cabecalho = [celula.value for celula in planilha[1]]
        
        if "Nome" not in cabecalho:
            print("❌ Erro: Coluna 'Nome' não encontrada na planilha.")
            return
            
        idx_nome = cabecalho.index("Nome")

        # Lê os dados a partir da linha 3 (ignorando cabeçalho e a linha de instrução)
        for row in planilha.iter_rows(min_row=3, values_only=True):
            nome = row[idx_nome]
            if nome and isinstance(nome, str):
                nomes_auvo.add(nome.strip())
                
    except Exception as e:
        print(f"❌ Erro ao ler o arquivo Excel: {e}")
        print("💡 Dica: Verifique se instalou o openpyxl (pip install openpyxl) e se o nome do arquivo está correto.")
        return

    nomes_mestre = set()
    print("⏳ Carregando seu mestre.json...")
    try:
        with open('mestre.json', 'r', encoding='utf-8') as f:
            db = json.load(f)
            for item in db:
                # Primeiro pegamos o bloco "cliente", e depois puxamos o "nome" de dentro dele
                bloco_cliente = item.get('cliente', {})
                nome = bloco_cliente.get('nome')
                
                if nome:
                    nomes_mestre.add(nome.strip())
    except Exception as e:
        print(f"❌ Erro ao ler o mestre.json: {e}")
        return

    # O "Left Join"
    encontrados = []
    nao_encontrados = []

    for nome in nomes_mestre:
        if nome in nomes_auvo:
            encontrados.append(nome)
        else:
            nao_encontrados.append(nome)

    # O Relatório
    print("\n" + "="*70)
    print("🔍 RELATÓRIO DE VALIDAÇÃO DE NOMES (LEFT JOIN)")
    print("="*70)
    print(f"Total de clientes únicos no mestre.json: {len(nomes_mestre)}")
    print(f"Total de clientes na tabela do Auvo: {len(nomes_auvo)}")
    print("-" * 70)

    if len(nao_encontrados) == 0:
        print(f"✅ SUCESSO ABSOLUTO! {len(encontrados)}/{len(nomes_mestre)} encontrados.")
        print("Todos os nomes do seu sistema batem 100% com o Auvo. Pode automatizar as datas sem medo!")
    else:
        print(f"⚠️ ATENÇÃO: {len(encontrados)}/{len(nomes_mestre)} encontrados com exatidão.")
        print(f"❌ Encontramos {len(nao_encontrados)} cliente(s) no mestre.json que não existem no Auvo:\n")
        
        for nome_erro in nao_encontrados:
            sugestoes = difflib.get_close_matches(nome_erro, nomes_auvo, n=1, cutoff=0.6)
            
            if sugestoes:
                print(f"   [Mestre] {nome_erro}\n   ---> Sugestão: {sugestoes[0]}\n")
            else:
                print(f"   [Mestre] {nome_erro}\n   ---> Nenhuma sugestão parecida encontrada.\n")

if __name__ == '__main__':
    validar_nomes()