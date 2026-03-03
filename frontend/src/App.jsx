import React, { useState } from 'react';
import Tecnicos from './components/Tecnicos';
import Clientes from './components/Clientes';
import Calendario from './components/Calendario';
import './App.css';

function App() {
  const [abaAtiva, setAbaAtiva] = useState('kanban');

  return (
    <div className='container'>
      <nav className='nav'>
        <h3 className='h3'>Logística SF</h3>
        <button onClick={() => setAbaAtiva('clientes')}>Clientes</button>
        <button onClick={() => setAbaAtiva('tecnicos')}>Técnicos</button>
        <button onClick={() => setAbaAtiva('kanban')}>Calendário / Agendamento</button>
      </nav>

      <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        {abaAtiva === 'clientes' && <Clientes />}
        {abaAtiva === 'tecnicos' && <Tecnicos />}
        {abaAtiva === 'kanban' && <Calendario />}
      </div>
    </div>
  );
}

export default App;