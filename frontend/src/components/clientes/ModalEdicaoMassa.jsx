import React from 'react';

const ModalEdicaoMassa = ({
    selecionados, loteConfig, setLoteConfig, zonas, tecnicos,
    setModalLoteAberto, aplicarLote
}) => {
    return (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-2xl border border-stone-100">
                <h3 className="text-xl font-bold text-[#4d1c0c] mb-1">Edição em Massa</h3>
                <p className="text-xs text-stone-500 mb-6 font-semibold uppercase tracking-wider">
                    A aplicar a {selecionados.length} clientes selecionados
                </p>

                <div className="flex flex-col gap-6 mt-6">
                    {/* ZONA */}
                    <div className="flex items-center gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
                        <input type="checkbox" id="chkZona" className="w-5 h-5 cursor-pointer accent-[#4d1c0c]" checked={loteConfig.atualizarZona} onChange={(e) => setLoteConfig({ ...loteConfig, atualizarZona: e.target.checked })} />
                        <div className="flex-1 flex flex-col">
                            <label htmlFor="chkZona" className="text-[11px] font-bold text-[#4d1c0c] uppercase tracking-wider mb-1 cursor-pointer">Alterar / Limpar Zona</label>
                            <select disabled={!loteConfig.atualizarZona} className="w-full p-2.5 border rounded-lg text-sm bg-white disabled:bg-stone-100" value={loteConfig.zona} onChange={(e) => setLoteConfig({ ...loteConfig, zona: e.target.value })}>
                                <option value="">🧹 Limpar (Deixar sem Zona)</option>
                                {zonas.map(z => <option key={z} value={z}>{z}</option>)}
                            </select>
                        </div>
                    </div>
                    {/* TÉCNICO */}
                    <div className="flex items-center gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
                        <input type="checkbox" id="chkTecnico" className="w-5 h-5 cursor-pointer accent-[#4d1c0c]" checked={loteConfig.atualizarTecnico} onChange={(e) => setLoteConfig({ ...loteConfig, atualizarTecnico: e.target.checked })} />
                        <div className="flex-1 flex flex-col">
                            <label htmlFor="chkTecnico" className="text-[11px] font-bold text-[#4d1c0c] uppercase tracking-wider mb-1 cursor-pointer">Alterar / Limpar Técnico</label>
                            <select disabled={!loteConfig.atualizarTecnico} className="w-full p-2.5 border rounded-lg text-sm bg-white disabled:bg-stone-100" value={loteConfig.tecnico} onChange={(e) => setLoteConfig({ ...loteConfig, tecnico: e.target.value })}>
                                <option value="">🧹 Limpar (Deixar sem Técnico)</option>
                                {tecnicos.map(tec => <option key={tec.id} value={tec.nome_auvo}>{tec.nome_auvo}</option>)}
                            </select>
                        </div>
                    </div>
                    {/* DATA */}
                    <div className="flex items-center gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
                        <input type="checkbox" id="chkData" className="w-5 h-5 cursor-pointer accent-[#4d1c0c]" checked={loteConfig.atualizarData} onChange={(e) => setLoteConfig({ ...loteConfig, atualizarData: e.target.checked })} />
                        <div className="flex-1 flex flex-col">
                            <label htmlFor="chkData" className="text-[11px] font-bold text-[#4d1c0c] uppercase tracking-wider mb-1 cursor-pointer">Alterar / Limpar Data</label>
                            <input type="date" disabled={!loteConfig.atualizarData} className="w-full p-2.5 border rounded-lg text-sm bg-white disabled:bg-stone-100" value={loteConfig.data} onChange={(e) => setLoteConfig({ ...loteConfig, data: e.target.value })} />
                        </div>
                    </div>
                </div>
                <div className="mt-8 flex justify-end gap-3">
                    <button onClick={() => setModalLoteAberto(false)} className="px-5 py-2.5 text-stone-500 hover:bg-stone-100 rounded-xl text-sm font-bold">Cancelar</button>
                    <button onClick={aplicarLote} className="px-5 py-2.5 bg-[#4d1c0c] text-white rounded-xl text-sm font-bold">Aplicar Alterações</button>
                </div>
            </div>
        </div>
    );
};

export default ModalEdicaoMassa;