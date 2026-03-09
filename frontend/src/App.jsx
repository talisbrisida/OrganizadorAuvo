import React, { useState } from 'react';
import Clientes from './components/Clientes';
import Extrator from './components/Extrator';
import Tecnicos from './components/Tecnicos';

function App() {
  const [abaAtiva, setAbaAtiva] = useState('clientes');

  return (
    <div className="min-h-screen bg-stone-50/50 font-sans">
      {/* MENU SUPERIOR (NAVBAR) */}
      <nav className="bg-[#0c4d4d] border-b border-stone-200  "> {/* NavBAr */}
        <div className=" mx-auto px-10"> {/*  Container */}
          <div className="flex items-center content-between h-20 gap-16 justify-between">

            <div className="text-4xl  text-[#4d1c0c] mr-4 tracking-tighter">
              Talis<span className="text-blue-600 text-2xl">.DEV</span>
            </div>

            <div className="flex gap-10">
              <button
                onClick={() => setAbaAtiva('clientes')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${abaAtiva === 'clientes' ? 'bg-[#4d1c0c] text-white' : 'text-white hover:text-white hover:bg-blue-600'}`}
              >
                Gestão de Rotas (Preventivas)
              </button>
              <button
                onClick={() => setAbaAtiva('extrator')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${abaAtiva === 'extrator' ? 'bg-[#4d1c0c] text-white' : 'text-white hover:text-white hover:bg-blue-600'}`}
              >
                Extrator de Tarefas (Filtro)
              </button>
              <button
                onClick={() => setAbaAtiva('tecnicos')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${abaAtiva === 'tecnicos' ? 'bg-[#4d1c0c] text-white' : 'text-white hover:text-white hover:bg-blue-600'}`}
              >
                Gestão de Técnicos e Zonas
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ÁREA PRINCIPAL (Renderiza o componente escolhido) */}
      <main>
        {abaAtiva === 'clientes' && <Clientes />}
        {abaAtiva === 'extrator' && <Extrator />}
        {abaAtiva === 'tecnicos' && <Tecnicos />}
      </main>
    </div>
  );
}

export default App;