import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Clientes = () => {
    const [tarefas, setTarefas] = useState([]);
    const [tecnicos, setTecnicos] = useState([]);
    const [zonas, setZonas] = useState([]);
    const [filtros, setFiltros] = useState({ bairro: '', cidade: '', busca: '' });

    const carregar = async () => {
        const [resT, resC, resZ] = await Promise.all([
            axios.get('http://127.0.0.1:8000/tecnicos'),
            axios.get('http://127.0.0.1:8000/clientes'),
            axios.get('http://127.0.0.1:8000/zonas')
        ]);
        setTecnicos(resT.data);
        setTarefas(resC.data);
        setZonas(resZ.data);
    };

    useEffect(() => { carregar(); }, []);

    const tarefasFiltradas = tarefas.filter(t =>
        (t.cliente.nome.toLowerCase().includes(filtros.busca.toLowerCase())) &&
        (t.cliente.bairro.toLowerCase().includes(filtros.bairro.toLowerCase())) &&
        (t.cliente.cidade.toLowerCase().includes(filtros.cidade.toLowerCase()))
    );

    const atualizar = async (id, campo, valor) => {
        await axios.put(`http://127.0.0.1:8000/clientes/${id}`, { [campo]: valor });
        carregar();
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-[#4d1c0c] tracking-tight">Gestão de Clientes</h1>
                <p className="text-stone-500">Gerencie a roteirização e alocação de técnicos.</p>
            </header>

            {/* Barra de Filtros Inteligentes */}
            <div className="bg-white p-6 rounded-2xl shadow-lg shadow-stone-200/50 border border-stone-100 mb-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                <div className="flex flex-col md:col-span-4">
                    <label className="text-xs font-bold text-[#4d1c0c]/70 uppercase mb-1 ml-1">Nome / Condomínio</label>
                    <input className="p-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4d1c0c]/20 focus:border-[#4d1c0c] transition-all" value={filtros.busca} onChange={e => setFiltros({ ...filtros, busca: e.target.value })} placeholder="Buscar cliente..." />
                </div>
                <div className="flex flex-col md:col-span-3">
                    <label className="text-xs font-bold text-[#4d1c0c]/70 uppercase mb-1 ml-1">Bairro</label>
                    <input className="p-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4d1c0c]/20 focus:border-[#4d1c0c] transition-all" value={filtros.bairro} onChange={e => setFiltros({ ...filtros, bairro: e.target.value })} placeholder="Ex: Esplanada" />
                </div>
                <div className="flex flex-col md:col-span-3">
                    <label className="text-xs font-bold text-[#4d1c0c]/70 uppercase mb-1 ml-1">Cidade</label>
                    <input className="p-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4d1c0c]/20 focus:border-[#4d1c0c] transition-all" value={filtros.cidade} onChange={e => setFiltros({ ...filtros, cidade: e.target.value })} placeholder="Ex: Jacareí" />
                </div>
                <div className="md:col-span-2">
                    <a href="http://127.0.0.1:8000/exportar-auvo" className="block w-full bg-[#4d1c0c] hover:bg-[#3a1509] text-white text-center py-3 rounded-xl font-bold shadow-lg shadow-[#4d1c0c]/20 transition-all transform hover:-translate-y-0.5 text-sm">
                        ⬇ EXPORTAR CSV
                    </a>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-100 overflow-hidden">
                <table className="w-full text-left text-xs">
                    <thead className="bg-[#4d1c0c] text-white">
                        <tr className="uppercase text-[10px] tracking-widest font-semibold">
                            <th className="p-5">Cliente / Endereço</th>
                            <th className="p-5 w-80">Zona de Roteirização</th>
                            <th className="p-5 w-60">Técnico Responsável</th>
                            <th className="p-5 w-40">Data Agendada</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {tarefasFiltradas.map(t => (
                            <tr key={t.id_tarefa} className="hover:bg-orange-50/30 transition-colors duration-150 group">
                                <td className="p-5">
                                    <div className="font-bold text-[#4d1c0c] text-sm mb-1">{t.cliente.nome}</div>
                                    <div className="inline-block bg-stone-100 text-stone-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-1 border border-stone-200">
                                        {t.cliente.bairro} — {t.cliente.cidade}
                                    </div>
                                    <div className="text-[11px] text-stone-400 truncate max-w-md">{t.cliente.endereco_completo}</div>
                                </td>
                                <td className="p-5">
                                    <select
                                        className="w-full p-2.5 border border-stone-200 rounded-lg bg-stone-50 text-stone-700 text-xs focus:ring-2 focus:ring-[#4d1c0c]/20 focus:border-[#4d1c0c] outline-none cursor-pointer hover:bg-white transition-colors"
                                        value={t.cliente.zona_roteirizacao}
                                        onChange={e => atualizar(t.id_tarefa, 'zona', e.target.value)}
                                    >
                                        <option value="">Escolha uma Area</option>
                                        {zonas.map(z => <option key={z} value={z}>{z}</option>)}
                                    </select>
                                </td>
                                <td className="p-5">
                                    <select
                                        className="w-full p-2.5 border border-stone-200 rounded-lg bg-stone-50 text-stone-700 text-xs focus:ring-2 focus:ring-[#4d1c0c]/20 focus:border-[#4d1c0c] outline-none cursor-pointer hover:bg-white transition-colors"
                                        value={t.agendamento_atual.tecnico_alocado || ""}
                                        onChange={e => atualizar(t.id_tarefa, 'tecnico', e.target.value)}
                                    >
                                        <option value="">Escolha um Técnico</option>
                                        {tecnicos.map(tec => <option key={tec.id} value={tec.nome_auvo}>{tec.nome_auvo}</option>)}
                                    </select>
                                </td>
                                <td className="p-5">
                                    <input type="date" className="w-full p-2.5 border border-stone-200 rounded-lg bg-stone-50 text-stone-700 text-xs focus:ring-2 focus:ring-[#4d1c0c]/20 focus:border-[#4d1c0c] outline-none cursor-pointer hover:bg-white transition-colors" value={t.agendamento_atual.data_alocada || ""} onChange={e => atualizar(t.id_tarefa, 'data', e.target.value)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Clientes;