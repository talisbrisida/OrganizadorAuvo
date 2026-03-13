import React from 'react';
import ModalGenerico from '../ModalGenerico';

const ModalEdicaoMassa = ({
    selecionados, loteConfig, setLoteConfig, zonas, tecnicos,
    setModalLoteAberto, aplicarLote
}) => {
    return (
        <ModalGenerico
            isOpen={true} // Como ele só é chamado quando está aberto, passamos true
            onClose={() => setModalLoteAberto(false)}
            onConfirm={aplicarLote}
            titulo="Edição em Massa"
            icone="⚙️"
            textoConfirmar="Aplicar Alterações"
            corBotao="bg-[#4d1c0c] hover:bg-[#3a1509]"
            corIcone="bg-[#4d1c0c]/10 text-[#4d1c0c]"
        >
            {/* TUDO O QUE ESTÁ AQUI DENTRO É A "PINTURA" (A propriedade children) */}
            <p className="text-xs text-stone-500 mb-6 font-semibold uppercase tracking-wider -mt-4">
                A aplicar a {selecionados.length} clientes selecionados
            </p>

            <div className="flex flex-col gap-4 mt-2">
                {/* OPÇÃO DE ZONA */}
                <div className="flex items-center gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
                    <input type="checkbox" id="chkZona" className="w-5 h-5 cursor-pointer accent-[#4d1c0c]" checked={loteConfig.atualizarZona} onChange={(e) => setLoteConfig({ ...loteConfig, atualizarZona: e.target.checked })} />
                    <div className="flex-1 flex flex-col">
                        <label htmlFor="chkZona" className="text-[11px] font-bold text-[#4d1c0c] uppercase tracking-wider mb-1 cursor-pointer">Alterar Zona</label>
                        <select disabled={!loteConfig.atualizarZona} className="w-full p-2 border rounded-lg text-sm bg-white disabled:bg-stone-100" value={loteConfig.zona} onChange={(e) => setLoteConfig({ ...loteConfig, zona: e.target.value })}>
                            <option value="">Selecione a Zona...</option>
                            {zonas.map(z => <option key={z} value={z}>{z}</option>)}
                        </select>
                    </div>
                </div>

                {/* OPÇÃO DE TÉCNICO */}
                <div className="flex items-center gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
                    <input type="checkbox" id="chkTecnico" className="w-5 h-5 cursor-pointer accent-[#4d1c0c]" checked={loteConfig.atualizarTecnico} onChange={(e) => setLoteConfig({ ...loteConfig, atualizarTecnico: e.target.checked })} />
                    <div className="flex-1 flex flex-col">
                        <label htmlFor="chkTecnico" className="text-[11px] font-bold text-[#4d1c0c] uppercase tracking-wider mb-1 cursor-pointer">Alocar Técnico</label>
                        <select disabled={!loteConfig.atualizarTecnico} className="w-full p-2 border rounded-lg text-sm bg-white disabled:bg-stone-100" value={loteConfig.tecnico} onChange={(e) => setLoteConfig({ ...loteConfig, tecnico: e.target.value })}>
                            <option value="">Selecione o Técnico...</option>
                            {tecnicos.map(t => <option key={t.nome} value={t.nome}>{t.nome}</option>)}
                        </select>
                    </div>
                </div>

                {/* OPÇÃO DE DATA */}
                <div className="flex items-center gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
                    <input type="checkbox" id="chkData" className="w-5 h-5 cursor-pointer accent-[#4d1c0c]" checked={loteConfig.atualizarData} onChange={(e) => setLoteConfig({ ...loteConfig, atualizarData: e.target.checked })} />
                    <div className="flex-1 flex flex-col">
                        <label htmlFor="chkData" className="text-[11px] font-bold text-[#4d1c0c] uppercase tracking-wider mb-1 cursor-pointer">Alterar / Limpar Data</label>
                        <input type="date" disabled={!loteConfig.atualizarData} className="w-full p-2 border rounded-lg text-sm bg-white disabled:bg-stone-100" value={loteConfig.data} onChange={(e) => setLoteConfig({ ...loteConfig, data: e.target.value })} />
                    </div>
                </div>
            </div>
        </ModalGenerico>
    );
};

export default ModalEdicaoMassa;