import React, { useEffect } from 'react';

const Toast = ({ mensagem, tipo = 'sucesso', onClose }) => {
    // Fecha automaticamente após 3 segundos
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    // Paleta de cores baseada no tipo de alerta
    const estilos = {
        sucesso: 'bg-green-100 border-green-500 text-green-800',
        erro: 'bg-red-100 border-red-500 text-red-800',
        aviso: 'bg-orange-100 border-orange-500 text-orange-800'
    };

    return (
        <div className={`fixed bottom-6 right-6 z-[200] px-6 py-4 border-l-4 rounded-xl shadow-2xl flex items-center gap-4 animate-fade-in ${estilos[tipo]}`}>
            <span className="font-bold text-sm">{mensagem}</span>
            <button
                onClick={onClose}
                className="opacity-60 hover:opacity-100 transition-opacity font-bold text-lg"
            >
                ✕
            </button>
        </div>
    );
};

export default Toast;