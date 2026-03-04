import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Toast from './Toast'; // Importação do novo componente

const Clientes = () => {
    const [tarefas, setTarefas] = useState([]);
    const [tecnicos, setTecnicos] = useState([]);
    const [zonas, setZonas] = useState([]);

    // --- ESTADOS DE FILTRO ---
    const [filtros, setFiltros] = useState({ bairro: '', cidade: '', busca: '', zona: '' });

    // --- ESTADOS DE EDIÇÃO EM LOTE ---
    const [selecionados, setSelecionados] = useState([]);
    const [modalLoteAberto, setModalLoteAberto] = useState(false);
    const [loteConfig, setLoteConfig] = useState({
        atualizarZona: false, zona: '',
        atualizarTecnico: false, tecnico: '',
        atualizarData: false, data: ''
    });    

    // --- ESTADOS DE UI (INTERFACE) ---
    const [modalAuvoAberto, setModalAuvoAberto] = useState(false);
    const [tarefaEmEdicao, setTarefaEmEdicao] = useState(null);
    const [isCarregando, setIsCarregando] = useState(false);
    const [confirmacaoZona, setConfirmacaoZona] = useState(null);

    // Estado para controlar a notificação Toast
    const [toast, setToast] = useState(null); // { mensagem, tipo }

    const mostrarToast = (mensagem, tipo = 'sucesso') => {
        setToast({ mensagem, tipo });
    };

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

    const handleMudarZona = (id, nomeCliente, novaZona) => {
        // Em vez de travar a tela com window.confirm, abrimos o nosso Modal
        setConfirmacaoZona({
            id,
            nomeCliente,
            novaZona
        });
    };

    const confirmarMudancaZona = () => {
        if (confirmacaoZona) {
            atualizar(confirmacaoZona.id, 'zona', confirmacaoZona.novaZona);
            setConfirmacaoZona(null); // Fecha o modal
        }
    };

    const cancelarMudancaZona = () => {
        setConfirmacaoZona(null); // Apenas fecha o modal sem fazer nada
    };

    const toggleSelecionado = (id) => {
        setSelecionados(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    };

    const toggleTodos = () => {
        if (selecionados.length === tarefasFiltradas.length) {
            setSelecionados([]);
        } else {
            setSelecionados(tarefasFiltradas.map(t => t.id_tarefa));
        }
    };

    // --- FUNÇÃO DE APLICAR LOTE (REFORMULADA PARA O NOVO MODAL) ---
    const aplicarLote = async () => {
        if (!loteConfig.atualizarZona && !loteConfig.atualizarTecnico && !loteConfig.atualizarData) {
            mostrarToast("Selecione pelo menos um campo para atualizar no lote.", "aviso");
            return;
        }

        setIsCarregando(true);
        try {
            for (const id of selecionados) {
                const payload = {};
                // Se o campo estiver marcado, envia o valor. Se o valor for vazio (''), o Python limpará o campo.
                if (loteConfig.atualizarZona) payload.zona = loteConfig.zona;
                if (loteConfig.atualizarTecnico) payload.tecnico = loteConfig.tecnico;
                if (loteConfig.atualizarData) payload.data = loteConfig.data;

                // Enviamos tudo num único PUT por cliente
                await axios.put(`http://127.0.0.1:8000/clientes/${id}`, payload);
            }

            await carregar();
            setSelecionados([]);
            setModalLoteAberto(false);

            // Reseta as configurações do modal
            setLoteConfig({
                atualizarZona: false, zona: '',
                atualizarTecnico: false, tecnico: '',
                atualizarData: false, data: ''
            });

            mostrarToast(`${selecionados.length} clientes processados com sucesso!`);
        } catch (erro) {
            console.error("Erro ao aplicar em lote:", erro);
            mostrarToast("Erro ao processar a edição em lote.", "erro");
        } finally {
            setIsCarregando(false);
        }
    };

    // --- FUNÇÕES DO MODAL AUVO ---
    const abrirModalAuvo = (t) => {
        setTarefaEmEdicao({
            id_tarefa: t.id_tarefa,
            nome_cliente: t.cliente.nome,
            prioridade: t.agendamento_atual?.prioridade || 'Média',
            tarefa_para: t.agendamento_atual?.tarefa_para || 'Colaborador',
            roteirizar: t.agendamento_atual?.roteirizar || 'Sim',
            descricao: t.agendamento_atual?.descricao || `Manutenção Preventiva Mensal - ${t.id_tarefa}`
        });
        setModalAuvoAberto(true);
    };

    const salvarOpcoesAuvo = async () => {
        try {
            await axios.put(`http://127.0.0.1:8000/clientes/${tarefaEmEdicao.id_tarefa}`, {
                prioridade: tarefaEmEdicao.prioridade,
                tarefa_para: tarefaEmEdicao.tarefa_para,
                roteirizar: tarefaEmEdicao.roteirizar,
                descricao: tarefaEmEdicao.descricao
            });
            carregar();
            setModalAuvoAberto(false);
            setTarefaEmEdicao(null);
            mostrarToast("Configurações Auvo guardadas!");
        } catch (erro) {
            mostrarToast("Erro ao guardar opções do Auvo.", "erro");
        }
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto relative">
            {/* COMPONENTE DE NOTIFICAÇÃO (TOAST) */}
            {toast && (
                <Toast
                    mensagem={toast.mensagem}
                    tipo={toast.tipo}
                    onClose={() => setToast(null)}
                />
            )}

            {/* TELA DE CARREGAMENTO (LOADER) OVERLAY */}
            {isCarregando && (
                <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex justify-center items-center z-[100]">
                    <div className="bg-white p-8 rounded-2xl flex flex-col items-center shadow-2xl border border-stone-200">
                        <div className="w-12 h-12 border-4 border-stone-200 border-t-[#4d1c0c] rounded-full animate-spin mb-4"></div>
                        <h3 className="text-lg font-bold text-[#4d1c0c] mb-1">Processando Lote...</h3>
                        <p className="text-xs text-stone-500 font-medium">Isto pode demorar alguns segundos.</p>
                    </div>
                </div>
            )}

            <header className="mb-8">
                <h1 className="text-3xl font-bold text-[#4d1c0c] tracking-tight">Gestão de Clientes</h1>
                <p className="text-stone-500">Organize a sua agenda, zonas e exporte para o Auvo.</p>
            </header>

            {/* BARRA DE FILTROS */}
            <div className="bg-white p-6 rounded-2xl shadow-lg shadow-stone-200/50 border border-stone-100 mb-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="flex flex-col md:col-span-3">
                    <label className="text-[10px] font-bold text-[#4d1c0c]/70 uppercase tracking-wider mb-1 ml-1">Nome / Condomínio</label>
                    <input className="p-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4d1c0c]/20 focus:border-[#4d1c0c] bg-stone-50" value={filtros.busca} onChange={e => setFiltros({ ...filtros, busca: e.target.value })} placeholder="Buscar..." />
                </div>

                <div className="flex flex-col md:col-span-3">
                    <label className="text-[10px] font-bold text-[#4d1c0c]/70 uppercase tracking-wider mb-1 ml-1">Zona</label>
                    <select className="p-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4d1c0c]/20 focus:border-[#4d1c0c] bg-stone-50" value={filtros.zona} onChange={e => setFiltros({ ...filtros, zona: e.target.value })}>
                        <option value="">Todas as Zonas</option>
                        {zonas.map(z => <option key={z} value={z}>{z}</option>)}
                    </select>
                </div>

                <div className="flex flex-col md:col-span-2">
                    <label className="text-[10px] font-bold text-[#4d1c0c]/70 uppercase tracking-wider mb-1 ml-1">Bairro</label>
                    <input className="p-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4d1c0c]/20 focus:border-[#4d1c0c] bg-stone-50" value={filtros.bairro} onChange={e => setFiltros({ ...filtros, bairro: e.target.value })} placeholder="Bairro..." />
                </div>
                <div className="flex flex-col md:col-span-2">
                    <label className="text-[10px] font-bold text-[#4d1c0c]/70 uppercase tracking-wider mb-1 ml-1">Cidade</label>
                    <input className="p-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4d1c0c]/20 focus:border-[#4d1c0c] bg-stone-50" value={filtros.cidade} onChange={e => setFiltros({ ...filtros, cidade: e.target.value })} placeholder="Cidade..." />
                </div>
                <div className="md:col-span-2">
                    <a href="http://127.0.0.1:8000/exportar/xlsx" className="block w-full bg-[#4d1c0c] hover:bg-[#3a1509] text-white text-center py-3.5 rounded-xl font-bold shadow-lg shadow-[#4d1c0c]/20 transition-all transform hover:-translate-y-0.5 text-[11px] uppercase tracking-wider">
                        ⬇ EXPORTAR AUVO
                    </a>
                </div>
            </div>

            {/* NOVA BARRA SIMPLIFICADA DE AÇÕES EM LOTE */}
            {selecionados.length > 0 && (
                <div className="bg-orange-50 border-2 border-[#4d1c0c] p-4 rounded-xl mb-6 flex flex-wrap items-center justify-between gap-4 shadow-lg animate-fade-in">
                    <div className="flex items-center gap-3">
                        <span className="bg-[#4d1c0c] text-white font-bold px-3 py-1 rounded-full text-sm">
                            {selecionados.length}
                        </span>
                        <span className="text-[#4d1c0c] font-bold uppercase text-sm tracking-wider">Clientes Selecionados</span>
                    </div>

                    <button
                        onClick={() => setModalLoteAberto(true)}
                        className="bg-[#4d1c0c] hover:bg-[#3a1509] text-white px-6 py-2 rounded-lg font-bold text-sm transition-colors shadow-md"
                    >
                        ⚙️ Editar Lote (Massas)
                    </button>
                </div>
            )}

            {/* TABELA DE CLIENTES */}
            <div className="bg-white rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-100 overflow-hidden">
                <table className="w-full text-left text-xs">
                    <thead className="bg-[#4d1c0c] text-white">
                        <tr className="uppercase text-[10px] tracking-widest font-semibold">
                            <th className="p-5 w-12 text-center">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 cursor-pointer accent-orange-500"
                                    checked={tarefasFiltradas.length > 0 && selecionados.length === tarefasFiltradas.length}
                                    onChange={toggleTodos}
                                />
                            </th>
                            <th className="p-5">Cliente / Endereço</th>
                            <th className="p-5 w-56">Zona (Protegida)</th>
                            <th className="p-5 w-56">Técnico</th>
                            <th className="p-5 w-40">Data</th>
                            <th className="p-5 w-20 text-center">Auvo</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {tarefasFiltradas.map(t => (
                            <tr key={t.id_tarefa} className={`hover:bg-orange-50/30 transition-colors duration-150 group ${selecionados.includes(t.id_tarefa) ? 'bg-orange-50/50' : ''}`}>
                                <td className="p-5 text-center">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 cursor-pointer accent-[#4d1c0c]"
                                        checked={selecionados.includes(t.id_tarefa)}
                                        onChange={() => toggleSelecionado(t.id_tarefa)}
                                    />
                                </td>
                                <td className="p-5">
                                    <div className="font-bold text-[#4d1c0c] text-sm mb-1">{t.cliente.nome}</div>
                                    <div className="inline-block bg-stone-100 text-stone-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-1 border border-stone-200">
                                        {t.cliente.bairro} — {t.cliente.cidade}
                                    </div>
                                </td>
                                <td className="p-5">
                                    <select
                                        className="w-full p-2.5 border border-stone-200 rounded-lg bg-stone-50 text-stone-700 text-xs focus:ring-2 focus:ring-[#4d1c0c]/20 outline-none cursor-pointer"
                                        value={t.cliente.zona_roteirizacao || ""}
                                        onChange={e => handleMudarZona(t.id_tarefa, t.cliente.nome, e.target.value)}
                                    >
                                        <option value="">Sem Zona</option>
                                        {zonas.map(z => <option key={z} value={z}>{z}</option>)}
                                    </select>
                                </td>
                                <td className="p-5">
                                    <select
                                        className="w-full p-2.5 border border-stone-200 rounded-lg bg-stone-50 text-stone-700 text-xs focus:ring-2 focus:ring-[#4d1c0c]/20 outline-none cursor-pointer"
                                        value={t.agendamento_atual.tecnico_alocado || ""}
                                        onChange={e => atualizar(t.id_tarefa, 'tecnico', e.target.value)}
                                    >
                                        <option value="">Técnico...</option>
                                        {tecnicos.map(tec => <option key={tec.id} value={tec.nome_auvo}>{tec.nome_auvo}</option>)}
                                    </select>
                                </td>
                                <td className="p-5">
                                    <input type="date" className="w-full p-2.5 border border-stone-200 rounded-lg bg-stone-50 text-stone-700 text-xs focus:ring-2 focus:ring-[#4d1c0c]/20 outline-none cursor-pointer" value={t.agendamento_atual.data_alocada || ""} onChange={e => atualizar(t.id_tarefa, 'data', e.target.value)} />
                                </td>
                                <td className="p-5 text-center">
                                    <button
                                        onClick={() => abrirModalAuvo(t)}
                                        className="p-2 bg-stone-100 hover:bg-[#4d1c0c] text-stone-600 hover:text-white rounded transition-colors border border-stone-200"
                                        title="Opções Auvo"
                                    >
                                        ⚙️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {tarefasFiltradas.length === 0 && (
                    <div className="p-10 text-center text-stone-500 font-medium">
                        Nenhum cliente encontrado com estes filtros.
                    </div>
                )}
            </div>

            {/* NOVO MODAL: EDIÇÃO EM MASSA (LOTE) */}
            {modalLoteAberto && (
                <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-2xl w-[500px] max-w-[90%] shadow-2xl border border-stone-100">
                        <h3 className="text-xl font-bold text-[#4d1c0c] mb-1">Edição em Massa</h3>
                        <p className="text-xs text-stone-500 mb-6 font-semibold uppercase tracking-wider">
                            A aplicar a {selecionados.length} clientes selecionados
                        </p>

                        <div className="flex flex-col gap-6">

                            {/* BLOCO: ZONA */}
                            <div className="flex items-center gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
                                <input
                                    type="checkbox"
                                    id="chkZona"
                                    className="w-5 h-5 cursor-pointer accent-[#4d1c0c]"
                                    checked={loteConfig.atualizarZona}
                                    onChange={(e) => setLoteConfig({ ...loteConfig, atualizarZona: e.target.checked })}
                                />
                                <div className="flex-1 flex flex-col">
                                    <label htmlFor="chkZona" className="text-[11px] font-bold text-[#4d1c0c] uppercase tracking-wider mb-1 cursor-pointer">Alterar / Limpar Zona</label>
                                    <select
                                        disabled={!loteConfig.atualizarZona}
                                        className="w-full p-2.5 border rounded-lg text-sm bg-white disabled:bg-stone-100 disabled:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4d1c0c]/20"
                                        value={loteConfig.zona}
                                        onChange={(e) => setLoteConfig({ ...loteConfig, zona: e.target.value })}
                                    >
                                        <option value="">🧹 Limpar (Deixar sem Zona)</option>
                                        {zonas.map(z => <option key={z} value={z}>{z}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* BLOCO: TÉCNICO */}
                            <div className="flex items-center gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
                                <input
                                    type="checkbox"
                                    id="chkTecnico"
                                    className="w-5 h-5 cursor-pointer accent-[#4d1c0c]"
                                    checked={loteConfig.atualizarTecnico}
                                    onChange={(e) => setLoteConfig({ ...loteConfig, atualizarTecnico: e.target.checked })}
                                />
                                <div className="flex-1 flex flex-col">
                                    <label htmlFor="chkTecnico" className="text-[11px] font-bold text-[#4d1c0c] uppercase tracking-wider mb-1 cursor-pointer">Alterar / Limpar Técnico</label>
                                    <select
                                        disabled={!loteConfig.atualizarTecnico}
                                        className="w-full p-2.5 border rounded-lg text-sm bg-white disabled:bg-stone-100 disabled:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4d1c0c]/20"
                                        value={loteConfig.tecnico}
                                        onChange={(e) => setLoteConfig({ ...loteConfig, tecnico: e.target.value })}
                                    >
                                        <option value="">🧹 Limpar (Deixar sem Técnico)</option>
                                        {tecnicos.map(tec => <option key={tec.id} value={tec.nome_auvo}>{tec.nome_auvo}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* BLOCO: DATA */}
                            <div className="flex items-center gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
                                <input
                                    type="checkbox"
                                    id="chkData"
                                    className="w-5 h-5 cursor-pointer accent-[#4d1c0c]"
                                    checked={loteConfig.atualizarData}
                                    onChange={(e) => setLoteConfig({ ...loteConfig, atualizarData: e.target.checked })}
                                />
                                <div className="flex-1 flex flex-col">
                                    <label htmlFor="chkData" className="text-[11px] font-bold text-[#4d1c0c] uppercase tracking-wider mb-1 cursor-pointer">Alterar / Limpar Data</label>
                                    <input
                                        type="date"
                                        disabled={!loteConfig.atualizarData}
                                        className="w-full p-2.5 border rounded-lg text-sm bg-white disabled:bg-stone-100 disabled:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4d1c0c]/20"
                                        value={loteConfig.data}
                                        onChange={(e) => setLoteConfig({ ...loteConfig, data: e.target.value })}
                                    />
                                    <span className="text-[10px] text-stone-500 mt-1">*Para limpar a data, ative a caixa e deixe o campo de data vazio.</span>
                                </div>
                            </div>

                        </div>

                        <div className="mt-8 flex justify-end gap-3">
                            <button onClick={() => setModalLoteAberto(false)} className="px-5 py-2.5 text-stone-500 hover:bg-stone-100 rounded-xl text-sm font-bold transition-colors">Cancelar</button>
                            <button onClick={aplicarLote} className="px-5 py-2.5 bg-[#4d1c0c] hover:bg-[#3a1509] text-white rounded-xl text-sm font-bold shadow-lg">Aplicar Alterações</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL AUVO */}
            {modalAuvoAberto && (
                <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-2xl w-[450px] max-w-[90%] shadow-2xl border border-stone-100">
                        <h3 className="text-xl font-bold text-[#4d1c0c] mb-1">Configurar Auvo</h3>
                        <p className="text-xs text-stone-500 mb-6 font-semibold uppercase tracking-wider">{tarefaEmEdicao?.nome_cliente}</p>

                        <div className="flex flex-col gap-4">
                            <label className="flex flex-col">
                                <span className="text-[10px] font-bold text-[#4d1c0c]/70 uppercase tracking-wider mb-1">Prioridade:</span>
                                <select className="p-3 border rounded-xl text-sm bg-stone-50" value={tarefaEmEdicao?.prioridade} onChange={(e) => setTarefaEmEdicao({ ...tarefaEmEdicao, prioridade: e.target.value })}>
                                    <option value="Alta">Alta</option>
                                    <option value="Média">Média</option>
                                    <option value="Baixa">Baixa</option>
                                </select>
                            </label>
                            <label className="flex flex-col">
                                <span className="text-[10px] font-bold text-[#4d1c0c]/70 uppercase tracking-wider mb-1">Atribuir Para:</span>
                                <select className="p-3 border rounded-xl text-sm bg-stone-50" value={tarefaEmEdicao?.tarefa_para} onChange={(e) => setTarefaEmEdicao({ ...tarefaEmEdicao, tarefa_para: e.target.value })}>
                                    <option value="Colaborador">Colaborador</option>
                                    <option value="Equipe">Equipe</option>
                                    <option value="Membro da equipe">Membro da equipe</option>
                                </select>
                            </label>
                            <label className="flex flex-col">
                                <span className="text-[10px] font-bold text-[#4d1c0c]/70 uppercase tracking-wider mb-1">Roteirizar:</span>
                                <select className="p-3 border rounded-xl text-sm bg-stone-50" value={tarefaEmEdicao?.roteirizar} onChange={(e) => setTarefaEmEdicao({ ...tarefaEmEdicao, roteirizar: e.target.value })}>
                                    <option value="Sim">Sim</option>
                                    <option value="Não">Não</option>
                                </select>
                            </label>
                            <label className="flex flex-col">
                                <span className="text-[10px] font-bold text-[#4d1c0c]/70 uppercase tracking-wider mb-1">Descrição:</span>
                                <textarea className="p-3 border rounded-xl text-sm bg-stone-50 resize-none" rows="2" value={tarefaEmEdicao?.descricao} onChange={(e) => setTarefaEmEdicao({ ...tarefaEmEdicao, descricao: e.target.value })} />
                            </label>
                        </div>
                        <div className="mt-8 flex justify-end gap-3">
                            <button onClick={() => setModalAuvoAberto(false)} className="px-5 py-2.5 text-stone-500 hover:bg-stone-100 rounded-xl text-sm font-bold transition-colors">Cancelar</button>
                            <button onClick={salvarOpcoesAuvo} className="px-5 py-2.5 bg-[#4d1c0c] hover:bg-[#3a1509] text-white rounded-xl text-sm font-bold shadow-lg">Guardar Alterações</button>
                        </div>
                    </div>
                </div>
            )}
            {/* MODAL DE CONFIRMAÇÃO DE ZONA */}
            {confirmacaoZona && (
                <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex justify-center items-center z-[150] animate-fade-in">
                    <div className="bg-white p-6 rounded-2xl w-[400px] max-w-[90%] shadow-2xl border border-stone-100 text-center transform transition-all">

                        <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner">
                            ⚠️
                        </div>

                        <h3 className="text-lg font-bold text-[#4d1c0c] mb-2">Atenção à Roteirização</h3>

                        <p className="text-sm text-stone-600 mb-6">
                            Tem certeza que deseja mover <strong>{confirmacaoZona.nomeCliente}</strong> para a <strong>{confirmacaoZona.novaZona || 'lista sem zona'}</strong>?<br /><br />
                            <span className="text-xs text-stone-400 font-medium">As zonas costumam ser fixas para organizar a agenda.</span>
                        </p>

                        <div className="flex justify-center gap-3">
                            <button
                                onClick={cancelarMudancaZona}
                                className="px-5 py-2.5 text-stone-500 hover:bg-stone-100 rounded-xl text-sm font-bold transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmarMudancaZona}
                                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-500/30 transition-all transform hover:-translate-y-0.5"
                            >
                                Sim, Mover Cliente
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Clientes;