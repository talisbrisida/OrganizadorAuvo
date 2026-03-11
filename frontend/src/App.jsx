import React, { useState } from 'react';
import Clientes from './components/Clientes';
import Extrator from './components/Extrator';
import Tecnicos from './components/Tecnicos';

function App() {
  const [abaAtiva, setAbaAtiva] = useState('clientes');

  return (
    // MUDANÇA PRINCIPAL: h-screen e overflow-hidden para travar a tela
    <div className="h-screen flex flex-col bg-[#0c4d4d3f] font-sans overflow-hidden">

      {/* MENU SUPERIOR (NAVBAR) - shrink-0 impede que ela seja esmagada */}
      <nav className="bg-[#0c4d4d] border-b border-stone-200 shrink-0">
        <div className="mx-auto px-8">
          <div className="flex items-center h-16 gap-16 justify-between">

            {/* Ajustei o contraste para branco para destacar no fundo escuro */}
            <div className="text-3xl font-black text-white mr-4 tracking-tighter">
              Talis<span className="text-[#4d1c0c] text-2xl">.DEV</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setAbaAtiva('clientes')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${abaAtiva === 'clientes' ? 'bg-[#4d1c0c] text-white shadow-sm' : 'text-stone-300 hover:text-white hover:bg-white/10'}`}
              >
                Gestão de Rotas
              </button>
              <button
                onClick={() => setAbaAtiva('extrator')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${abaAtiva === 'extrator' ? 'bg-[#4d1c0c] text-white shadow-sm' : 'text-stone-300 hover:text-white hover:bg-white/10'}`}
              >
                Extrator de Tarefas
              </button>
              <button
                onClick={() => setAbaAtiva('tecnicos')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${abaAtiva === 'tecnicos' ? 'bg-[#4d1c0c] text-white shadow-sm' : 'text-stone-300 hover:text-white hover:bg-white/10'}`}
              >
                Gestão de Técnicos e Zonas
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ÁREA PRINCIPAL: flex-1 ocupa todo o resto e min-h-0 habilita o scroll interno perfeito */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {abaAtiva === 'clientes' && <Clientes />}
        {abaAtiva === 'extrator' && <Extrator />}
        {abaAtiva === 'tecnicos' && <Tecnicos />}
      </main>

      {/* FOOTER OFICIAL - reduzi o padding (py-4) para dar mais espaço à tabela */}
      <footer className="bg-[#0c4d4d] border-t border-stone-200 py-3 shrink-0">
        <div className="mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-stone-400">
          <div>
            Desenvolvido por <a href="https://github.com/talisbrisida/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-orange-500 transition-colors  tracking-wide font-black">Talis<span className="text-orange-500 hover:text-white">.DEV</span></a> &copy; {new Date().getFullYear()}
          </div>
          <div className="flex items-center gap-6">
            <span className="bg-stone-100 px-3 py-1 rounded-full text-stone-500 border border-stone-200">
              Versão 1.2.0
            </span>
            <span className="hidden md:inline-block">
              Uso interno exclusivo — <a href="http://wa.me/+5512996599723" target="_blank" rel="noopener noreferrer"><span className="text-blue-300 hover:text-white">Solução Fitness</span></a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;