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

    const salvarZona = async (acao, valor) => {
        let lista = [...zonas];
        if (acao === 'add' && valor) lista.push(valor);
        if (acao === 'del') lista = zonas.filter(z => z !== valor);
        await axios.post('http://127.0.0.1:8000/zonas', lista);
        setNovaZona(""); carregar();
    };

    return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* GESTÃO DE ZONAS */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h3 className="font-bold mb-4">Zonas de Atendimento (Global)</h3>
                <div className="flex gap-2 mb-4">
                    <input className="flex-1 p-2 border rounded" value={novaZona} onChange={e => setNovaZona(e.target.value)} placeholder="Ex: Zona 1 - SJC" />
                    <button onClick={() => salvarZona('add', novaZona)} className="bg-blue-600 text-white px-4 rounded">+</button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {zonas.map(z => (
                        <span key={z} className="bg-gray-100 text-gray-700 px-3 py-1 rounded border flex gap-2 items-center text-xs">
                            {z} <button onClick={() => salvarZona('del', z)} className="text-red-500 font-bold">×</button>
                        </span>
                    ))}
                </div>
            </div>

            {/* GESTÃO DE TÉCNICOS */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h3 className="font-bold mb-4">Equipe (Editar Nomes)</h3>
                {tecnicos.map(t => (
                    <input
                        key={t.id}
                        className="w-full p-2 border rounded mb-2 font-bold"
                        value={t.nome}
                        onChange={async (e) => {
                            await axios.put(`http://127.0.0.1:8000/tecnicos/${t.id}`, { nome: e.target.value });
                            carregar();
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default Tecnicos;