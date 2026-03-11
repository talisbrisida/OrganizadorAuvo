import React from 'react';
import { useClientes } from '../hooks/useClientes';
import Toast from './Toast';
import BarraFiltros from './clientes/BarraFiltros';
import TabelaClientes from './clientes/TabelaClientes';
import ModalEdicaoMassa from './clientes/ModalEdicaoMassa';
import ModalAuvo from './clientes/modalAuvo';
import ModalConfirmacaoZona from './clientes/ModalConfirmacaoZona';

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
            {/* NOVO MODAL DE CONCLUSÃO DE VISITA */}
            {clienteParaConcluir && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-[450px] border border-stone-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full text-xl">✅</div>
                            <h3 className="text-xl font-bold text-[#0c4d4d]">Concluir Visita?</h3>
                        </div>

                        <p className="text-stone-600 mb-6 text-sm leading-relaxed">
                            Deseja confirmar a visita de <strong className="text-[#0c4d4d]">{clienteParaConcluir.nome_cliente}</strong> do dia <strong className="bg-emerald-50 text-emerald-700 px-1 rounded">{clienteParaConcluir.data?.split('-').reverse().join('/') || clienteParaConcluir.data}</strong> no histórico?
                            <br /><br />
                            <span className="text-xs text-stone-400">Esta ação arquivará a data e libertará a agenda do cliente para a próxima rota.</span>
                        </p>

                        <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                            <button
                                onClick={() => setClienteParaConcluir(null)}
                                className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold rounded-xl transition-colors text-sm"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={concluirVisita}
                                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-600/30 text-sm flex items-center gap-2"
                            >
                                Confirmar Conclusão
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* NOVO MODAL: CONCLUSÃO EM MASSA */}
            {modalConcluirLoteAberto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-[450px] border border-stone-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full text-xl">📦</div>
                            <h3 className="text-xl font-bold text-[#0c4d4d]">Concluir Lote?</h3>
                        </div>
                        
                        <p className="text-stone-600 mb-6 text-sm leading-relaxed">
                            Tem a certeza que deseja arquivar as visitas de <strong className="text-[#0c4d4d]">{selecionados.length} clientes selecionados</strong> no histórico?
                            <br /><br />
                            <span className="text-xs text-stone-400 bg-stone-50 p-2 rounded block border border-stone-100">
                                ⚠️ <strong>Nota:</strong> Apenas os clientes que possuem uma Data preenchida serão arquivados. A agenda destes clientes será liberta para o próximo mês.
                            </span>
                        </p>
                        
                        <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                            <button 
                                onClick={() => setModalConcluirLoteAberto(false)} 
                                className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold rounded-xl transition-colors text-sm"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={concluirVisitasMassa} 
                                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-600/30 text-sm flex items-center gap-2"
                            >
                                Confirmar {selecionados.length} Visitas
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Clientes;