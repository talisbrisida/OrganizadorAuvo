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
        modalLoteAberto, setModalLoteAberto, loteConfig, setLoteConfig,
        modalAuvoAberto, setModalAuvoAberto, tarefaEmEdicao, setTarefaEmEdicao,
        isCarregando, confirmacaoZona, toast, setToast, tarefasFiltradas,
        atualizar, handleMudarZona, confirmarMudancaZona, cancelarMudancaZona,
        toggleSelecionado, toggleTodos, aplicarLote, abrirModalAuvo, salvarOpcoesAuvo
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



            <BarraFiltros filtros={filtros} setFiltros={setFiltros} zonas={zonas} />

            {selecionados.length > 0 && (
                <div className="bg-[#0c4d4d]/10 border-2 border-[#0c4d4d] p-3 rounded-xl mb-4 shrink-0 flex flex-wrap items-center justify-between gap-4 shadow-sm animate-fade-in">
                    <div className="flex items-center gap-3">
                        <span className="bg-[#0c4d4d] text-white font-bold px-3 py-1 rounded-full text-sm">{selecionados.length}</span>
                        <span className="text-[#0c4d4d] font-bold uppercase text-sm tracking-wider">Clientes Selecionados</span>
                    </div>
                    <button onClick={() => setModalLoteAberto(true)} className="bg-[#0c4d4d] hover:bg-[#083333] text-white px-6 py-2 rounded-lg font-bold text-sm transition-colors shadow-md">
                        ⚙️ Editar Lote (Massas)
                    </button>
                </div>
            )}

            {/* A Tabela */}
            <TabelaClientes
                tarefasFiltradas={tarefasFiltradas} selecionados={selecionados}
                toggleTodos={toggleTodos} toggleSelecionado={toggleSelecionado}
                zonas={zonas} handleMudarZona={handleMudarZona}
                tecnicos={tecnicos} atualizar={atualizar} abrirModalAuvo={abrirModalAuvo}
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
        </div>
    );
};

export default Clientes;