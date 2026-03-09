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
        <div className="p-8 max-w-400 mx-auto relative">
            
            {/* COMPONENTES DE FEEDBACK E CARREGAMENTO */}
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

            {/* CABEÇALHO */}
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-[#4d1c0c] tracking-tight">Gestão de Clientes</h1>
                <p className="text-stone-500">Organize a sua agenda, zonas e exporte para o Auvo.</p>
            </header>

            {/* BARRA DE FILTROS */}
            <BarraFiltros filtros={filtros} setFiltros={setFiltros} zonas={zonas} />

            {/* BARRA DE ACÕES RÁPIDAS (LOTE) */}
            {selecionados.length > 0 && (
                <div className="bg-orange-50 border-2 border-[#4d1c0c] p-4 rounded-xl mb-6 flex flex-wrap items-center justify-between gap-4 shadow-lg animate-fade-in">
                    <div className="flex items-center gap-3">
                        <span className="bg-[#4d1c0c] text-white font-bold px-3 py-1 rounded-full text-sm">{selecionados.length}</span>
                        <span className="text-[#4d1c0c] font-bold uppercase text-sm tracking-wider">Clientes Selecionados</span>
                    </div>
                    <button onClick={() => setModalLoteAberto(true)} className="bg-[#4d1c0c] hover:bg-[#3a1509] text-white px-6 py-2 rounded-lg font-bold text-sm transition-colors shadow-md">
                        ⚙️ Editar Lote (Massas)
                    </button>
                </div>
            )}

            {/* TABELA PRINCIPAL */}
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