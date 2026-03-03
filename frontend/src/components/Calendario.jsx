import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Calendario = () => {
  const [tarefas, setTarefas] = useState([]);

  useEffect(() => {
    fetchTarefas();
  }, []);

  const fetchTarefas = async () => {
    const res = await axios.get('http://127.0.0.1:8000/clientes');
    setTarefas(res.data);
  };

  const rodarDistribuicao = async () => {
    await axios.post('http://127.0.0.1:8000/distribuir-tarefas');
    fetchTarefas();
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Painel de Agendamento</h2>
        <button 
          onClick={rodarDistribuicao}
          style={{ padding: '10px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          🔄 Rodar Distribuição Automática
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {tarefas.filter(t => t.agendamento_atual.status === 'Agendado').map(t => (
          <div key={t.id_tarefa} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', background: '#fff' }}>
            <strong style={{ color: '#007bff' }}>{t.datas.proximo_vencimento}</strong>
            <p><strong>Cliente:</strong> {t.cliente.nome}</p>
            <p><strong>Zona:</strong> {t.cliente.zona_roteirizacao}</p>
            <div style={{ background: '#e9ecef', padding: '10px', borderRadius: '4px' }}>
              <p style={{ margin: 0 }}>👷 <strong>Técnico:</strong> {t.agendamento_atual.tecnico_alocado}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendario;