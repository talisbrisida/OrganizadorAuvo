import React, { useState } from 'react';
import Tecnicos from './components/Tecnicos';
// Importe seus outros componentes aqui

function App() {
  const [abaAtiva, setAbaAtiva] = useState('kanban');

  return (
    <div>
      <nav style={{ padding: '10px', background: '#222', color: '#fff' }}>
        <button onClick={() => setAbaAtiva('clientes')}>Clientes</button>
        <button onClick={() => setAbaAtiva('tecnicos')}>Técnicos</button>
        <button onClick={() => setAbaAtiva('kanban')}>Kanban/Calendário</button>
      </nav>

      {abaAtiva === 'tecnicos' && <Tecnicos />}
      {/* Adicione as outras condicionais aqui */}
    </div>
  );
}