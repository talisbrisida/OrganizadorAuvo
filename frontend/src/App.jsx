import React, { useState } from 'react';
import Clientes from './components/Clientes';
import Tecnicos from './components/Tecnicos';

function App() {
  const [abaAtiva, setAbaAtiva] = useState('clientes');

  return (
    <div className="flex min-h-screen bg-stone-100 font-sans text-stone-800">
      {/* Menu Lateral */}
      <aside className="w-80  bg-[#4d1c0c] text-white flex flex-col shadow-2xl z-10">
        <div className="p-8 text-2xl font-black border-b border-white/10 text-orange-50 tracking-tighter flex items-center gap-2">
          <span className="text-3xl">🚀</span> Talis.Dev
        </div>
        <nav className="flex-1 mt-8 px-4 space-y-2">
          <button
            onClick={() => setAbaAtiva('clientes')}
            className={`w-full text-left px-6 py-4 rounded-xl transition-all duration-300 flex items-center gap-3 ${abaAtiva === 'clientes' ? 'bg-white/10 font-bold text-white shadow-inner translate-x-1' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
          >
            📋 Gestão de Clientes
          </button>
          <button
            onClick={() => setAbaAtiva('tecnicos')}
            className={`w-full text-left px-6 py-4 rounded-xl transition-all duration-300 flex items-center gap-3 ${abaAtiva === 'tecnicos' ? 'bg-white/10 font-bold text-white shadow-inner translate-x-1' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
          >
            🔧 Gestão de Técnicos
          </button>
        </nav>
        <div className="p-6 text-[10px] text-white/30 text-center uppercase tracking-widest font-semibold">
          Escopo Zero v2.0
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 overflow-y-auto">
        {abaAtiva === 'clientes' && <Clientes />}
        {abaAtiva === 'tecnicos' && <Tecnicos />}
      </main>
    </div>
  );
}

export default App;