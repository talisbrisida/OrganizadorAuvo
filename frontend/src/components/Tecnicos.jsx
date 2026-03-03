import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Tecnicos = () => {
    const [tecnicos, setTecnicos] = useState([]);
    const [zonas, setZonas] = useState([]);
    const [novaZona, setNovaZona] = useState("");

    const carregar = async () => {
        const [resT, resZ] = await Promise.all([
            axios.get('http://127.0.0.1:8000/tecnicos'),
            axios.get('http://127.0.0.1:8000/zonas')
        ]);
        setTecnicos(resT.data);
        setZonas(resZ.data);
    };

    useEffect(() => { carregar(); }, []);

    const editarTecnico = async (id, campo, valor) => {
        await axios.put(`http://127.0.0.1:8000/tecnicos/${id}`, { [campo]: valor });
        carregar();
    };

    const addZona = async () => {
        if (!novaZona) return;
        await axios.post('http://127.0.0.1:8000/zonas', { zona: novaZona });
        setNovaZona("");
        carregar();
    };

    const delZona = async (nome) => {
        await axios.delete(`http://127.0.0.1:8000/zonas/${nome}`);
        carregar();
    };

    return (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Gestão de Zonas */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-lg font-bold mb-4">Zonas de Atendimento</h3>
                <div className="flex gap-2 mb-4">
                    <input
                        className="flex-1 p-2 border rounded"
                        placeholder="Nome da Nova Zona (Ex: SJC - SUL)"
                        value={novaZona}
                        onChange={e => setNovaZona(e.target.value)}
                    />
                    <button onClick={addZona} className="bg-blue-600 text-white px-4 rounded font-bold">+</button>
                </div>
                <div className="space-y-2">
                    {zonas.map(z => (
                        <div key={z} className="flex justify-between items-center p-2 bg-gray-50 rounded border">
                            <span className="text-sm font-medium">{z}</span>
                            <button onClick={() => delZona(z)} className="text-red-500 font-bold px-2">×</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Gestão de Técnicos */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-lg font-bold mb-4">Equipe Técnica</h3>
                <div className="space-y-4">
                    {tecnicos.map(tec => (
                        <div key={tec.id} className="p-4 border rounded-lg hover:border-blue-300 transition">
                            <div className="grid grid-cols-2 gap-2 mb-2">
                                <input
                                    className="p-1 border rounded font-bold text-gray-700"
                                    value={tec.nome}
                                    onChange={e => editarTecnico(tec.id, 'nome', e.target.value)}
                                />
                                <input
                                    className="p-1 border rounded text-gray-500 italic"
                                    value={tec.cargo}
                                    onChange={e => editarTecnico(tec.id, 'cargo', e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={tec.ativo}
                                    onChange={e => editarTecnico(tec.id, 'ativo', e.target.checked)}
                                />
                                <span className="text-xs text-gray-400">Técnico Ativo</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Tecnicos;