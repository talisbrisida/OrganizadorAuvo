import React from 'react';
import ModalGenerico from '../ModalGenerico';

const ModalConfirmacaoZona = ({ confirmacaoZona, cancelarMudancaZona, confirmarMudancaZona }) => {
    return (
        <ModalGenerico
            isOpen={true}
            onClose={cancelarMudancaZona}
            onConfirm={confirmarMudancaZona}
            titulo="Atenção à Roteirização"
            icone="⚠️"
            textoConfirmar="Sim, Mover"
            corBotao="bg-orange-500 hover:bg-orange-600 shadow-orange-500/30"
            corIcone="bg-orange-100 text-orange-600"
        >
            <p className="text-sm text-stone-600 leading-relaxed">
                Mover <strong className="text-[#4d1c0c]">{confirmacaoZona.nomeCliente}</strong> para <strong className="text-[#4d1c0c] uppercase">{confirmacaoZona.novaZona || 'sem zona'}</strong>?
            </p>
            <br />
            <span className="text-xs text-stone-500 font-medium bg-orange-50 p-2 rounded block border border-orange-100">
                ⚠️ As zonas costumam ser fixas para organizar a agenda.
            </span>
        </ModalGenerico>
    );
};

export default ModalConfirmacaoZona;