import React, { useState } from 'react';
import Clientes from './components/Clientes';
import Tecnicos from './components/Tecnicos';

function App() {
  const [abaAtiva, setAbaAtiva] = useState('clientes');

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Menu Lateral */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-xl">
        <div className="p-6 text-2xl font-black border-b border-gray-800 text-blue-500">
          LOGÍSTICA SF
        </div>
        <nav className="flex-1 mt-4">
          <button 
            onClick={() => setAbaAtiva('clientes')}
            className={`w-full text-left p-4 hover:bg-gray-800 transition ${abaAtiva === 'clientes' ? 'bg-blue-600 font-bold' : ''}`}
          >
            📋 Lista de Tarefas
          </button>
          <button 
            onClick={() => setAbaAtiva('tecnicos')}
            className={`w-full text-left p-4 hover:bg-gray-800 transition ${abaAtiva === 'tecnicos' ? 'bg-blue-600 font-bold' : ''}`}
          >
            🔧 Gestão de Técnicos
          </button>
        </nav>
        <div className="p-4 text-[10px] text-gray-500 text-center uppercase tracking-widest">
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