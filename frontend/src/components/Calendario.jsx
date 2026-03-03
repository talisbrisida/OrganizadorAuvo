import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Calendario = () => {
  const [tarefas, setTarefas] = useState([]);
  const hoje = new Date();
  // Estados para controlar o mês e ano exibidos no calendário
  const [mesExibido, setMesExibido] = useState(hoje.getMonth());
  const [anoExibido, setAnoExibido] = useState(hoje.getFullYear());
  const [carregando, setCarregando] = useState(false);

  // Função para procurar as tarefas no backend (mestre.json)
  const fetchTarefas = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/clientes');
      setTarefas(response.data);
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
    }
  };

  // Carrega os dados ao montar o componente
  useEffect(() => {
    fetchTarefas();
  }, []);

  // Altere a função do botão dentro do componente Calendario:
  const rodarDistribuicao = async () => {
    setCarregando(true);
    try {
      // Enviamos o mês e o ano que estão nos estados mesExibido e anoExibido
      await axios.post('http://127.0.0.1:8000/distribuir-tarefas', {
        mes: mesExibido + 1, // +1 porque Janeiro é 0 no JS
        ano: anoExibido
      });

      await fetchTarefas(); // Atualiza a tela com os novos dados do mestre.json
      alert("Agenda gerada para o mês selecionado!");
    } catch (error) {
      alert("Erro ao rodar distribuição.");
    } finally {
      setCarregando(false);
    }
  };

  // Lógica para gerar a grelha do calendário
  const diasNoMes = new Date(anoExibido, mesExibido + 1, 0).getDate();
  const primeiroDiaSemana = new Date(anoExibido, mesExibido, 1).getDay();

  const renderDias = () => {
    const celulas = [];

    // Espaços vazios para alinhar o dia 1 com o dia da semana correto
    for (let i = 0; i < primeiroDiaSemana; i++) {
      celulas.push(<div key={`vazio-${i}`} className="h-32 border bg-gray-50 opacity-50"></div>);
    }

    // Preenche os dias do mês
    for (let dia = 1; dia <= diasNoMes; dia++) {
      const dataStr = `${anoExibido}-${String(mesExibido + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

      // Filtra tarefas agendadas para este dia específico
      const tarefasDoDia = tarefas.filter(t =>
        t.agendamento_atual.status === 'Agendado' &&
        t.agendamento_atual.data_alocada === dataStr
      );

      celulas.push(
        <div key={dia} className="h-32 border p-1 overflow-y-auto bg-white hover:bg-blue-50 transition-colors">
          <span className={`text-xs font-bold ${tarefasDoDia.length > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
            {dia}
          </span>
          <div className="mt-1 space-y-1">
            {tarefasDoDia.map(t => (
              <div
                key={t.id_tarefa}
                title={`${t.cliente.nome} - Técnico: ${t.agendamento_atual.tecnico_alocado}`}
                className="text-[10px] p-1 rounded bg-blue-100 text-blue-800 border border-blue-200 truncate shadow-sm"
              >
                <span className="font-bold">{t.agendamento_atual.tecnico_alocado?.split(' - ')[0]}:</span> {t.cliente.nome}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return celulas;
  };

  const mudarMes = (offset) => {
    const novaData = new Date(anoExibido, mesExibido + offset, 1);
    setMesExibido(novaData.getMonth());
    setAnoExibido(novaData.getFullYear());
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">
            {new Date(anoExibido, mesExibido).toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex gap-1">
            <button onClick={() => mudarMes(-1)} className="p-2 hover:bg-gray-200 rounded">◀</button>
            <button onClick={() => mudarMes(1)} className="p-2 hover:bg-gray-200 rounded">▶</button>
          </div>
        </div>

        <button
          onClick={rodarDistribuicao}
          disabled={carregando}
          className={`${carregando ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white px-6 py-2 rounded-lg font-bold shadow-md transition-all flex items-center gap-2`}
        >
          {carregando ? 'PROCESSANDO...' : '🔄 RODAR DISTRIBUIÇÃO'}
        </button>
      </div>

      {/* Cabeçalho dos Dias da Semana */}
      <div className="grid grid-cols-7 bg-gray-800 text-white rounded-t-xl">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(dia => (
          <div key={dia} className="p-3 text-center text-xs font-bold uppercase tracking-widest">
            {dia}
          </div>
        ))}
      </div>

      {/* Grelha do Calendário */}
      <div className="grid grid-cols-7 border-l border-t border-gray-200 rounded-b-xl overflow-hidden shadow-2xl">
        {renderDias()}
      </div>
    </div>
  );
};

export default Calendario;