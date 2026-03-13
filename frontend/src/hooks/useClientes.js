import { useState, useEffect } from 'react';
import axios from 'axios';

export function useClientes() {
    const [tarefas, setTarefas] = useState([]);
    const [tecnicos, setTecnicos] = useState([]);
    const [zonas, setZonas] = useState([]);

    const [filtros, setFiltros] = useState({ bairro: '', cidade: '', busca: '', zona: '' });
    const [filtroRapido, setFiltroRapido] = useState('');
    const [selecionados, setSelecionados] = useState([]);

    const [clienteParaConcluir, setClienteParaConcluir] = useState(null); // NOVO

    const [modalLoteAberto, setModalLoteAberto] = useState(false);
    const [loteConfig, setLoteConfig] = useState({
        atualizarZona: false, zona: '',
        atualizarTecnico: false, tecnico: '',
        atualizarData: false, data: ''
    });
    const [modalConcluirLoteAberto, setModalConcluirLoteAberto] = useState(false);
    const [modalAuvoAberto, setModalAuvoAberto] = useState(false);
    const [tarefaEmEdicao, setTarefaEmEdicao] = useState(null);
    const [isCarregando, setIsCarregando] = useState(false);
    const [confirmacaoZona, setConfirmacaoZona] = useState(null);
    const [toast, setToast] = useState(null);

    const mostrarToast = (mensagem, tipo = 'sucesso') => setToast({ mensagem, tipo });

    const carregar = async () => {
        try {
            const [resT, resC, resZ] = await Promise.all([
                axios.get('http://127.0.0.1:8000/tecnicos'),
                axios.get('http://127.0.0.1:8000/clientes'),
                axios.get('http://127.0.0.1:8000/zonas')
            ]);
            setTecnicos(resT.data);
            setTarefas(resC.data);
            setZonas(resZ.data);
        } catch (erro) {
            mostrarToast("Erro ao carregar dados da API.", "erro");
        }
    };

    useEffect(() => { carregar(); }, []);

    const tarefasFiltradas = tarefas.filter(t => {
        // Filtros de texto normais
        const nome = t.cliente?.nome || "";
        const bairro = t.cliente?.bairro || "";
        const cidade = t.cliente?.cidade || "";
        const matchBusca = nome.toLowerCase().includes(filtros.busca.toLowerCase());
        const matchBairro = bairro.toLowerCase().includes(filtros.bairro.toLowerCase());
        const matchCidade = cidade.toLowerCase().includes(filtros.cidade.toLowerCase());
        const matchZona = filtros.zona ? t.cliente.zona_roteirizacao === filtros.zona : true;

        // Filtro Rápido (Pendências)
        let matchRapido = true;
        if (filtroRapido === 'sem_tecnico') {
            matchRapido = !t.agendamento_atual?.tecnico_alocado;
        } else if (filtroRapido === 'sem_data') {
            matchRapido = !t.agendamento_atual?.data_alocada;
        } else if (filtroRapido === 'sem_zona') {
            matchRapido = !t.cliente?.zona_roteirizacao;
        } else if (filtroRapido === 'pendentes_mes' || filtroRapido === 'concluidos_mes') {
            const hoje = new Date();
            const mesAtual = hoje.getMonth() + 1;
            const anoAtual = hoje.getFullYear();

            const historico = t.historico_visitas || [];

            // Verifica se tem alguma data deste mês no histórico
            const jaAtendidoNesteMes = historico.some(dataStr => {
                const partes = dataStr.split('/');
                if (partes.length === 3) {
                    const mesVisita = parseInt(partes[1], 10);
                    const anoVisita = parseInt(partes[2], 10);
                    return mesVisita === mesAtual && anoVisita === anoAtual;
                }
                return false;
            });

            if (filtroRapido === 'pendentes_mes') {
                matchRapido = !jaAtendidoNesteMes; // Falso se já foi atendido (esconde da lista)
            } else if (filtroRapido === 'concluidos_mes') {
                matchRapido = jaAtendidoNesteMes; // Verdadeiro se já foi atendido (mostra na lista)
            }
        }

        return matchBusca && matchBairro && matchCidade && matchZona && matchRapido;
    });

    const atualizar = async (id, campo, valor) => {
        try {
            await axios.put(`http://127.0.0.1:8000/clientes/${id}`, { [campo]: valor });
            carregar();
            mostrarToast("Atualizado com sucesso!");
        } catch (erro) {
            mostrarToast("Erro ao atualizar o cliente.", "erro");
        }
    };

    // Nova função para Concluir Visita (agora controlada pelo Modal)
    const concluirVisita = async () => {
        if (!clienteParaConcluir) return;
        const { id_tarefa, nome_cliente } = clienteParaConcluir;

        try {
            const response = await axios.post(`http://127.0.0.1:8000/clientes/${id_tarefa}/concluir`);

            // Atualiza a tabela e fecha o modal
            setTarefas(tarefas.map(t => t.id_tarefa === id_tarefa ? response.data.cliente : t));
            setToast({ mensagem: `Visita de ${nome_cliente} arquivada no histórico!`, tipo: 'sucesso' });
            setClienteParaConcluir(null); // Esconde o modal
        } catch (error) {
            console.error("Erro ao concluir:", error);

            // Blindagem: Garante que a mensagem é sempre um texto (string)
            let msgErro = "Erro ao concluir a visita.";
            if (error.response?.data?.detail) {
                msgErro = typeof error.response.data.detail === 'string'
                    ? error.response.data.detail
                    : "Erro de validação no servidor.";
            }

            setToast({ mensagem: msgErro, tipo: 'erro' });
            setClienteParaConcluir(null);
        }
    };

    // Nova função para Concluir Vários Clientes de uma vez
    const concluirVisitasMassa = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/clientes/concluir-lote', {
                ids_tarefas: selecionados
            });

            // Limpa a data e técnico dos clientes concluídos na tela imediatamente
            setTarefas(tarefas.map(t => {
                if (selecionados.includes(t.id_tarefa) && t.agendamento_atual?.data_alocada) {
                    return {
                        ...t,
                        agendamento_atual: { ...t.agendamento_atual, data_alocada: "", tecnico_alocado: "" }
                    };
                }
                return t;
            }));

            setToast({ mensagem: response.data.mensagem, tipo: 'sucesso' });
            setSelecionados([]); // Desmarca todos os clientes
            setModalConcluirLoteAberto(false); // Fecha o modal
        } catch (error) {
            console.error("Erro ao concluir em lote:", error);
            setToast({ mensagem: "Erro ao arquivar visitas em lote.", tipo: 'erro' });
            setModalConcluirLoteAberto(false);
        }
    };

    const handleMudarZona = (id, nomeCliente, novaZona) => setConfirmacaoZona({ id, nomeCliente, novaZona });

    const confirmarMudancaZona = () => {
        if (confirmacaoZona) {
            atualizar(confirmacaoZona.id, 'zona', confirmacaoZona.novaZona);
            setConfirmacaoZona(null);
        }
    };

    const cancelarMudancaZona = () => setConfirmacaoZona(null);

    const toggleSelecionado = (id) => setSelecionados(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);

    const toggleTodos = () => {
        if (selecionados.length === tarefasFiltradas.length) setSelecionados([]);
        else setSelecionados(tarefasFiltradas.map(t => t.id_tarefa));
    };

    const aplicarLote = async () => {
        if (!loteConfig.atualizarZona && !loteConfig.atualizarTecnico && !loteConfig.atualizarData) {
            mostrarToast("Selecione pelo menos um campo.", "aviso");
            return;
        }
        setIsCarregando(true);
        try {
            for (const id of selecionados) {
                const payload = {};
                if (loteConfig.atualizarZona) payload.zona = loteConfig.zona;
                if (loteConfig.atualizarTecnico) payload.tecnico = loteConfig.tecnico;
                if (loteConfig.atualizarData) payload.data = loteConfig.data;
                await axios.put(`http://127.0.0.1:8000/clientes/${id}`, payload);
            }
            await carregar();
            setSelecionados([]);
            setModalLoteAberto(false);
            setLoteConfig({ atualizarZona: false, zona: '', atualizarTecnico: false, tecnico: '', atualizarData: false, data: '' });
            mostrarToast(`${selecionados.length} clientes processados!`);
        } catch (erro) {
            mostrarToast("Erro ao processar lote.", "erro");
        } finally {
            setIsCarregando(false);
        }
    };

    const abrirModalAuvo = (t) => {
        setTarefaEmEdicao({
            id_tarefa: t.id_tarefa, nome_cliente: t.cliente.nome,
            prioridade: t.agendamento_atual?.prioridade || 'Média',
            tarefa_para: t.agendamento_atual?.tarefa_para || 'Colaborador',
            roteirizar: t.agendamento_atual?.roteirizar || 'Sim',
            descricao: t.agendamento_atual?.descricao || `Manutenção Preventiva - ${t.id_tarefa}`
        });
        setModalAuvoAberto(true);
    };

    const salvarOpcoesAuvo = async () => {
        try {
            await axios.put(`http://127.0.0.1:8000/clientes/${tarefaEmEdicao.id_tarefa}`, {
                prioridade: tarefaEmEdicao.prioridade, tarefa_para: tarefaEmEdicao.tarefa_para,
                roteirizar: tarefaEmEdicao.roteirizar, descricao: tarefaEmEdicao.descricao
            });
            carregar();
            setModalAuvoAberto(false);
            setTarefaEmEdicao(null);
            mostrarToast("Configurações Auvo guardadas!");
        } catch (erro) {
            mostrarToast("Erro ao guardar opções do Auvo.", "erro");
        }
    };

    // Exporta tudo o que a interface vai precisar
    return {
        tecnicos, zonas, filtros, setFiltros, selecionados,
        filtroRapido, setFiltroRapido, tarefas, setTarefas,
        modalLoteAberto, setModalLoteAberto, loteConfig, setLoteConfig,
        modalAuvoAberto, setModalAuvoAberto, tarefaEmEdicao, setTarefaEmEdicao,
        isCarregando, confirmacaoZona, toast, setToast, tarefasFiltradas,
        atualizar, handleMudarZona, confirmarMudancaZona, cancelarMudancaZona,
        toggleSelecionado, toggleTodos, aplicarLote, abrirModalAuvo, salvarOpcoesAuvo, concluirVisita, clienteParaConcluir, setClienteParaConcluir,
        concluirVisitasMassa, modalConcluirLoteAberto, setModalConcluirLoteAberto
    };
}