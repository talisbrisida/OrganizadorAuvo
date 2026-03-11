import React from 'react';

const BarraFiltros = ({ filtros, setFiltros, zonas }) => {
    return (
        <div className="bg-neutral-100 p-6 rounded-2xl shadow-lg shadow-stone-200/50 border border-stone-100 mb-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="flex flex-col md:col-span-3">
                <label className="text-[10px] font-bold text-[#4d1c0c]/70 uppercase tracking-wider mb-1 ml-1">Nome / Condomínio</label>
                <input className="p-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4d1c0c]/20 focus:border-[#4d1c0c] bg-stone-50" value={filtros.busca} onChange={e => setFiltros({ ...filtros, busca: e.target.value })} placeholder="Buscar..." />
            </div>

            <div className="flex flex-col md:col-span-3">
                <label className="text-[10px] font-bold text-[#4d1c0c]/70 uppercase tracking-wider mb-1 ml-1">Zona</label>
                <select className="p-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4d1c0c]/20 focus:border-[#4d1c0c] bg-stone-50" value={filtros.zona} onChange={e => setFiltros({ ...filtros, zona: e.target.value })}>
                    <option value="">Todas as Zonas</option>
                    {zonas.map(z => <option key={z} value={z}>{z}</option>)}
                </select>
            </div>

            <div className="flex flex-col md:col-span-2">
                <label className="text-[10px] font-bold text-[#4d1c0c]/70 uppercase tracking-wider mb-1 ml-1">Bairro</label>
                <input className="p-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4d1c0c]/20 focus:border-[#4d1c0c] bg-stone-50" value={filtros.bairro} onChange={e => setFiltros({ ...filtros, bairro: e.target.value })} placeholder="Bairro..." />
            </div>
            <div className="flex flex-col md:col-span-2">
                <label className="text-[10px] font-bold text-[#4d1c0c]/70 uppercase tracking-wider mb-1 ml-1">Cidade</label>
                <input className="p-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4d1c0c]/20 focus:border-[#4d1c0c] bg-stone-50" value={filtros.cidade} onChange={e => setFiltros({ ...filtros, cidade: e.target.value })} placeholder="Cidade..." />
            </div>
            <div className="md:col-span-2">
                <a href="http://127.0.0.1:8000/exportar/xlsx" className="block w-full bg-[#4d1c0c] hover:bg-[#3a1509] text-white text-center py-3.5 rounded-xl font-bold shadow-lg shadow-[#4d1c0c]/20 transition-all transform hover:-translate-y-0.5 text-[11px] uppercase tracking-wider">
                    ⬇ EXPORTAR AUVO
                </a>
            </div>
        </div>
    );
};

export default BarraFiltros;