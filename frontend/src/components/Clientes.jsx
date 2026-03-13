import React from 'react';
import { useClientes } from '../hooks/useClientes';
import Toast from './Toast';
import BarraFiltros from './clientes/BarraFiltros';
import TabelaClientes from './clientes/TabelaClientes';
import ModalEdicaoMassa from './clientes/ModalEdicaoMassa';
import ModalAuvo from './clientes/modalAuvo';
import ModalConfirmacaoZona from './clientes/ModalConfirmacaoZona';
import ModalGenerico from './ModalGenerico';

const Clientes = () => {
    // Puxamos tudo do nosso Hook
    const {
        tecnicos, zonas, filtros, setFiltros, selecionados,
        filtroRapido, setFiltroRapido,
        modalLoteAberto, setModalLoteAberto, loteConfig, setLoteConfig,
        modalAuvoAberto, setModalAuvoAberto, tarefaEmEdicao, setTarefaEmEdicao,
        isCarregando, confirmacaoZona, toast, setToast, tarefasFiltradas,
        atualizar, handleMudarZona, confirmarMudancaZona, cancelarMudancaZona,
        toggleSelecionado, toggleTodos, aplicarLote, abrirModalAuvo, salvarOpcoesAuvo, concluirVisita,
        clienteParaConcluir, setClienteParaConcluir, concluirVisitasMassa, modalConcluirLoteAberto, setModalConcluirLoteAberto
    } = useClientes();

    return (
        // O wrapper agora tem h-full para usar 100% do espaço do <main>
        <div className="p-6 max-w-8xl w-full mx-auto relative h-full flex flex-col">

            {toast && <Toast mensagem={toast.mensagem} tipo={toast.tipo} onClose={() => setToast(null)} />}
            {isCarregando && (
                <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex justify-center items-center z-100">
                    <div className="bg-white p-8 rounded-2xl flex flex-col items-center shadow-2xl border border-stone-200">
                        <div className="w-12 h-12 border-4 border-stone-200 border-t-[#4d1c0c] rounded-full animate-spin mb-4"></div>
                        <h3 className="text-lg font-bold text-[#4d1c0c] mb-1">Processando Lote...</h3>
                        <p className="text-xs text-stone-500 font-medium">Isto pode demorar alguns segundos.</p>
                    </div>
                </div>
            )}



            <BarraFiltros
                filtros={filtros}
                setFiltros={setFiltros}
                zonas={zonas}
                filtroRapido={filtroRapido}
                setFiltroRapido={setFiltroRapido}
                concluirVisita={concluirVisita}
            />

            {selecionados.length > 0 && (
                <div className="bg-[#0c4d4d]/10 border-2 border-[#0c4d4d] p-3 rounded-xl mb-4 shrink-0 flex flex-wrap items-center justify-between gap-4 shadow-sm animate-fade-in">
                    <div className="flex items-center gap-3">
                        <span className="bg-[#0c4d4d] text-white font-bold px-3 py-1 rounded-full text-sm">{selecionados.length}</span>
                        <span className="text-[#0c4d4d] font-bold uppercase text-sm tracking-wider">Clientes Selecionados</span>
                    </div>
                    {/* NOVO CONJUNTO DE BOTÕES */}
                    <div className="flex gap-3">
                        <button onClick={() => setModalLoteAberto(true)} className="bg-[#0c4d4d] hover:bg-[#083333] text-white px-5 py-2 rounded-lg font-bold text-sm transition-colors shadow-md">
                            ⚙️ Editar Lote
                        </button>
                        <button onClick={() => setModalConcluirLoteAberto(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-bold text-sm transition-colors shadow-md flex items-center gap-2">
                            ✅ Concluir Visitas
                        </button>
                    </div>
                </div>
            )}

            {/* A Tabela */}
            <TabelaClientes
                tarefasFiltradas={tarefasFiltradas} selecionados={selecionados}
                toggleTodos={toggleTodos} toggleSelecionado={toggleSelecionado}
                zonas={zonas} handleMudarZona={handleMudarZona}
                tecnicos={tecnicos} atualizar={atualizar} abrirModalAuvo={abrirModalAuvo}
                concluirVisita={concluirVisita}
                clienteParaConcluir={clienteParaConcluir} setClienteParaConcluir={setClienteParaConcluir}
                set
            />

            {/* MODAIS (Visíveis apenas quando acionados) */}
            {modalLoteAberto && (
                <ModalEdicaoMassa
                    selecionados={selecionados} loteConfig={loteConfig} setLoteConfig={setLoteConfig}
                    zonas={zonas} tecnicos={tecnicos} setModalLoteAberto={setModalLoteAberto} aplicarLote={aplicarLote}
                />
            )}

            {modalAuvoAberto && (
                <ModalAuvo
                    tarefaEmEdicao={tarefaEmEdicao} setTarefaEmEdicao={setTarefaEmEdicao}
                    setModalAuvoAberto={setModalAuvoAberto} salvarOpcoesAuvo={salvarOpcoesAuvo}
                />
            )}

            {confirmacaoZona && (
                <ModalConfirmacaoZona
                    confirmacaoZona={confirmacaoZona}
                    cancelarMudancaZona={cancelarMudancaZona}
                    confirmarMudancaZona={confirmarMudancaZona}
                />
            )}
            {/* 1. MODAL DE CONCLUSÃO INDIVIDUAL */}
            <ModalGenerico
                isOpen={!!clienteParaConcluir}
                onClose={() => setClienteParaConcluir(null)}
                onConfirm={concluirVisita}
                titulo="Concluir Visita?"
                icone="✅"
                textoConfirmar="Confirmar Conclusão"
                corBotao="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30"
                corIcone="bg-emerald-100 text-emerald-600"
            >
                <p>
                    Deseja confirmar a visita de <strong className="text-[#0c4d4d]">{clienteParaConcluir?.nome_cliente}</strong> do dia <strong className="bg-emerald-50 text-emerald-700 px-1 rounded">{clienteParaConcluir?.data?.split('-').reverse().join('/') || clienteParaConcluir?.data}</strong> no histórico?
                </p>
                <br />
                <span className="text-xs text-stone-400">Esta ação arquivará a data e libertará a agenda do cliente para a próxima rota.</span>
            </ModalGenerico>

            {/* 2. MODAL DE CONCLUSÃO EM MASSA */}
            <ModalGenerico
                isOpen={modalConcluirLoteAberto}
                onClose={() => setModalConcluirLoteAberto(false)}
                onConfirm={concluirVisitasMassa}
                titulo="Concluir Lote?"
                icone="📦"
                textoConfirmar={`Confirmar ${selecionados.length} Visitas`}
                corBotao="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30"
                corIcone="bg-emerald-100 text-emerald-600"
            >
                <p>
                    Tem a certeza que deseja arquivar as visitas de <strong className="text-[#0c4d4d]">{selecionados.length} clientes selecionados</strong> no histórico?
                </p>
                <br />
                <span className="text-xs text-stone-400 bg-stone-50 p-2 rounded block border border-stone-100">
                    ⚠️ <strong>Nota:</strong> Apenas os clientes que possuem uma Data preenchida serão arquivados. A agenda destes clientes será liberta para o próximo mês.
                </span>
            </ModalGenerico>
        </div>
    );
};

export default Clientes;