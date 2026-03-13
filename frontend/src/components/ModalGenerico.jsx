import React from 'react';

const ModalGenerico = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    titulo, 
    icone, 
    textoConfirmar = "Confirmar", 
    corBotao = "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30",
    corIcone = "bg-emerald-100 text-emerald-600",
    children // <--- A MÁGICA ESTÁ AQUI
}) => {
    // Se o modal não estiver aberto, não desenha nada
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in print:hidden">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-100 border border-stone-100">
                
                {/* CABEÇALHO PADRÃO */}
                <div className="flex items-center gap-3 mb-4">
                    <div className={`${corIcone} p-2 rounded-full text-xl`}>{icone}</div>
                    <h3 className="text-xl font-bold text-[#0c4d4d]">{titulo}</h3>
                </div>
                
                {/* CORPO DO MODAL (O React injeta o conteúdo personalizado aqui) */}
                <div className="text-stone-600 mb-6 text-sm leading-relaxed">
                    {children}
                </div>
                
                {/* RODAPÉ PADRÃO COM BOTÕES */}
                <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                    <button 
                        onClick={onClose} 
                        className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold rounded-xl transition-colors text-sm"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={onConfirm} 
                        className={`px-5 py-2.5 text-white font-bold rounded-xl transition-colors shadow-lg text-sm flex items-center gap-2 ${corBotao}`}
                    >
                        {textoConfirmar}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ModalGenerico;