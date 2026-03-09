import { useState, useEffect } from 'react';
import axios from 'axios';

export function useClientes() {
    const [tarefas, setTarefas] = useState([]);
    const [tecnicos, setTecnicos] = useState([]);
    const [zonas, setZonas] = useState([]);

    const [filtros, setFiltros] = useState({ bairro: '', cidade: '', busca: '', zona: '' });
    const [selecionados, setSelecionados] = useState([]);

    const [modalLoteAberto, setModalLoteAberto] = useState(false);
    const [loteConfig, setLoteConfig] = useState({
        atualizarZona: false, zona: '',
        atualizarTecnico: false, tecnico: '',
        atualizarData: false, data: ''
    });

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
        const nome = t.cliente?.nome || "";
        const bairro = t.cliente?.bairro || "";
        const cidade = t.cliente?.cidade || "";
        const matchBusca = nome.toLowerCase().includes(filtros.busca.toLowerCase());
        const matchBairro = bairro.toLowerCase().includes(filtros.bairro.toLowerCase());
        const matchCidade = cidade.toLowerCase().includes(filtros.cidade.toLowerCase());
        const matchZona = filtros.zona ? t.cliente.zona_roteirizacao === filtros.zona : true;
        return matchBusca && matchBairro && matchCidade && matchZona;
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
        modalLoteAberto, setModalLoteAberto, loteConfig, setLoteConfig,
        modalAuvoAberto, setModalAuvoAberto, tarefaEmEdicao, setTarefaEmEdicao,
        isCarregando, confirmacaoZona, toast, setToast, tarefasFiltradas,
        atualizar, handleMudarZona, confirmarMudancaZona, cancelarMudancaZona,
        toggleSelecionado, toggleTodos, aplicarLote, abrirModalAuvo, salvarOpcoesAuvo
    };
}