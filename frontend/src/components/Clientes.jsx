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
        <div className="p-6">
            {/* Barra de Filtros Inteligentes */}
            <div className="bg-white p-4 rounded-xl shadow-sm border mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Nome / Condomínio</label>
                    <input className="p-2 border rounded text-sm" value={filtros.busca} onChange={e => setFiltros({ ...filtros, busca: e.target.value })} placeholder="Buscar..." />
                </div>
                <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Bairro</label>
                    <input className="p-2 border rounded text-sm" value={filtros.bairro} onChange={e => setFiltros({ ...filtros, bairro: e.target.value })} placeholder="Ex: Esplanada" />
                </div>
                <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Cidade</label>
                    <input className="p-2 border rounded text-sm" value={filtros.cidade} onChange={e => setFiltros({ ...filtros, cidade: e.target.value })} placeholder="Ex: Jacareí" />
                </div>
                <a href="http://127.0.0.1:8000/exportar-auvo" className="bg-blue-600 text-white text-center py-2 rounded-lg font-bold shadow-md">GERAR CSV</a>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 border-b">
                        <tr className="text-gray-400 uppercase text-[10px] tracking-widest">
                            <th className="p-4">Cliente / Endereço</th>
                            <th className="p-4 w-40">Zona</th>
                            <th className="p-4 w-52">Técnico</th>
                            <th className="p-4 w-32">Data</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {tarefasFiltradas.map(t => (
                            <tr key={t.id_tarefa} className="hover:bg-blue-50/50 transition">
                                <td className="p-4">
                                    <div className="font-bold text-gray-800 text-sm">{t.cliente.nome}</div>
                                    <div className="text-blue-600 font-bold mb-1 uppercase text-[10px]">{t.cliente.bairro} — {t.cliente.cidade}</div>
                                    <div className="text-[10px] text-gray-400 italic">{t.cliente.endereco_completo}</div>
                                </td>
                                <td className="p-4">
                                    <select
                                        className="w-full p-2 border rounded bg-white shadow-sm"
                                        value={t.cliente.zona_roteirizacao}
                                        onChange={e => atualizar(t.id_tarefa, 'zona', e.target.value)}
                                    >
                                        <option value="">Zona...</option>
                                        {zonas.map(z => <option key={z} value={z}>{z}</option>)}
                                    </select>
                                </td>
                                <td className="p-4">
                                    <select
                                        className="w-full p-2 border rounded bg-white"
                                        value={t.agendamento_atual.tecnico_alocado || ""}
                                        onChange={e => atualizar(t.id_tarefa, 'tecnico', e.target.value)}
                                    >
                                        <option value="">Selecionar...</option>
                                        {tecnicos.map(tec => <option key={tec.id} value={tec.nome_auvo}>{tec.nome_auvo}</option>)}
                                    </select>
                                </td>
                                <td className="p-4">
                                    <input type="date" className="w-full p-2 border rounded" value={t.agendamento_atual.data_alocada || ""} onChange={e => atualizar(t.id_tarefa, 'data', e.target.value)} />
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