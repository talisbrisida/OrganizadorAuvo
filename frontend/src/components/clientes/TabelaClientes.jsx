import React from 'react';

const TabelaClientes = ({
    tarefasFiltradas, selecionados, toggleTodos, toggleSelecionado,
    zonas, handleMudarZona, tecnicos, atualizar, abrirModalAuvo
}) => {
    return (
        <div className="bg-neutral-100 rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-100 overflow-hidden flex flex-col">

            {/* CONTAINER COM SCROLL E ALTURA MÁXIMA */}
            <div className="overflow-y-auto max-h-[65vh] w-full scrollbar-custom relative">
                <table className="w-full text-left text-xs border-collapse">

                    {/* CABEÇALHO FIXO (STICKY) */}
                    <thead className="text-white sticky top-0 z-20 shadow-md">
                        <tr className="uppercase text-[10px] tracking-widest font-semibold">
                            <th className="p-5 w-12 text-center bg-[#4d1c0c]">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 cursor-pointer accent-orange-500"
                                    checked={tarefasFiltradas.length > 0 && selecionados.length === tarefasFiltradas.length}
                                    onChange={toggleTodos}
                                />
                            </th>
                            <th className="p-5 bg-[#4d1c0c]">Cliente / Endereço</th>
                            <th className="p-5 w-56 bg-[#4d1c0c]">Zona (Protegida)</th>
                            <th className="p-5 w-56 bg-[#4d1c0c]">Técnico</th>
                            <th className="p-5 w-40 bg-[#4d1c0c]">Data</th>
                            <th className="p-5 w-20 text-center bg-[#4d1c0c]">Auvo</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-stone-100">
                        {tarefasFiltradas.map(t => (
                            <tr key={t.id_tarefa} className={`hover:bg-orange-50/30 transition-colors duration-150 group ${selecionados.includes(t.id_tarefa) ? 'bg-orange-50/50' : ''}`}>
                                <td className="p-5 text-center">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 cursor-pointer accent-[#4d1c0c]"
                                        checked={selecionados.includes(t.id_tarefa)}
                                        onChange={() => toggleSelecionado(t.id_tarefa)}
                                    />
                                </td>
                                <td className="p-5">
                                    <div className="font-bold text-[#4d1c0c] text-sm mb-1">{t.cliente.nome}</div>
                                    <div className="inline-block bg-stone-100 text-stone-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-1 border border-stone-200">
                                        {t.cliente.bairro} — {t.cliente.cidade}
                                    </div>
                                </td>
                                <td className="p-5">
                                    <select
                                        className="w-full p-2.5 border border-stone-200 rounded-lg bg-stone-50 text-stone-700 text-xs focus:ring-2 focus:ring-[#4d1c0c]/20 outline-none cursor-pointer"
                                        value={t.cliente.zona_roteirizacao || ""}
                                        onChange={e => handleMudarZona(t.id_tarefa, t.cliente.nome, e.target.value)}
                                    >
                                        <option value="">Sem Zona</option>
                                        {zonas.map(z => <option key={z} value={z}>{z}</option>)}
                                    </select>
                                </td>
                                <td className="p-5">
                                    <select
                                        className="w-full p-2.5 border border-stone-200 rounded-lg bg-stone-50 text-stone-700 text-xs focus:ring-2 focus:ring-[#4d1c0c]/20 outline-none cursor-pointer"
                                        value={t.agendamento_atual.tecnico_alocado || ""}
                                        onChange={e => atualizar(t.id_tarefa, 'tecnico', e.target.value)}
                                    >
                                        <option value="">Técnico...</option>
                                        {tecnicos.map(tec => <option key={tec.id} value={tec.nome_auvo}>{tec.nome_auvo}</option>)}
                                    </select>
                                </td>
                                <td className="p-5">
                                    <input
                                        type="date"
                                        className="w-full p-2.5 border border-stone-200 rounded-lg bg-stone-50 text-stone-700 text-xs focus:ring-2 focus:ring-[#4d1c0c]/20 outline-none cursor-pointer"
                                        value={t.agendamento_atual.data_alocada || ""}
                                        onChange={e => atualizar(t.id_tarefa, 'data', e.target.value)}
                                    />
                                </td>
                                <td className="p-5 text-center">
                                    <button
                                        onClick={() => abrirModalAuvo(t)}
                                        className="p-2 bg-stone-100 hover:bg-[#4d1c0c] text-stone-600 hover:text-white rounded transition-colors border border-stone-200"
                                        title="Opções Auvo"
                                    >
                                        ⚙️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {tarefasFiltradas.length === 0 && (
                    <div className="p-10 text-center text-stone-500 font-medium">
                        Nenhum cliente encontrado com estes filtros.
                    </div>
                )}
            </div>
        </div>
    );
};

export default TabelaClientes;