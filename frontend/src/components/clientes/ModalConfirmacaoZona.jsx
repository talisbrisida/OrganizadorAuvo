import React from 'react';

const ModalConfirmacaoZona = ({ confirmacaoZona, cancelarMudancaZona, confirmarMudancaZona }) => {
    return (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex justify-center items-center z-150 p-4">
            <div className="bg-white p-6 rounded-2xl w-100 text-center shadow-2xl">
                <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner">
                    ⚠️
                </div>
                <h3 className="text-lg font-bold text-[#4d1c0c] mb-2">Atenção à Roteirização</h3>
                <p className="text-sm text-stone-600 mb-6">
                    Mover <strong>{confirmacaoZona.nomeCliente}</strong> para <strong>{confirmacaoZona.novaZona || 'sem zona'}</strong>?<br /><br />
                    <span className="text-xs text-stone-400 font-medium">As zonas costumam ser fixas para organizar a agenda.</span>
                </p>
                <div className="flex justify-center gap-3">
                    <button onClick={cancelarMudancaZona} className="px-5 py-2.5 text-stone-500 bg-stone-100 hover:bg-stone-200 transition-colors rounded-xl font-bold">Cancelar</button>
                    <button onClick={confirmarMudancaZona} className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white transition-colors rounded-xl font-bold shadow-lg shadow-orange-500/30">Sim, Mover</button>
                </div>
            </div>
        </div>
    );
};

export default ModalConfirmacaoZona;