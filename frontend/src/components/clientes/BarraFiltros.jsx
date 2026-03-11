import React from 'react';

const BarraFiltros = ({ filtros, setFiltros, zonas, filtroRapido, setFiltroRapido }) => {
    return (
        <div className="shrink-0 bg-white p-4 rounded-2xl shadow-lg shadow-stone-200/50 border border-stone-100 mb-4 flex flex-col gap-4">

            {/* LINHA 1: INPUTS DE TEXTO E EXPORTAR */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="flex flex-col md:col-span-3">
                    <label className="text-[10px] font-bold text-[#0c4d4d]/70 uppercase tracking-wider mb-1 ml-1">Nome / Condomínio</label>
                    <input className="p-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0c4d4d]/20 focus:border-[#0c4d4d] bg-stone-50" value={filtros.busca} onChange={e => setFiltros({ ...filtros, busca: e.target.value })} placeholder="Buscar..." />
                </div>

                <div className="flex flex-col md:col-span-3">
                    <label className="text-[10px] font-bold text-[#0c4d4d]/70 uppercase tracking-wider mb-1 ml-1">Zona</label>
                    <select className="p-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0c4d4d]/20 focus:border-[#0c4d4d] bg-stone-50" value={filtros.zona} onChange={e => setFiltros({ ...filtros, zona: e.target.value })}>
                        <option value="">Todas as Zonas</option>
                        {zonas.map(z => <option key={z} value={z}>{z}</option>)}
                    </select>
                </div>

                <div className="flex flex-col md:col-span-2">
                    <label className="text-[10px] font-bold text-[#0c4d4d]/70 uppercase tracking-wider mb-1 ml-1">Bairro</label>
                    <input className="p-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0c4d4d]/20 focus:border-[#0c4d4d] bg-stone-50" value={filtros.bairro} onChange={e => setFiltros({ ...filtros, bairro: e.target.value })} placeholder="Bairro..." />
                </div>
                <div className="flex flex-col md:col-span-2">
                    <label className="text-[10px] font-bold text-[#0c4d4d]/70 uppercase tracking-wider mb-1 ml-1">Cidade</label>
                    <input className="p-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0c4d4d]/20 focus:border-[#0c4d4d] bg-stone-50" value={filtros.cidade} onChange={e => setFiltros({ ...filtros, cidade: e.target.value })} placeholder="Cidade..." />
                </div>
                {/* BOTÕES DE EXPORTAÇÃO */}
                <div className="md:col-span-2 flex flex-col gap-2 justify-end">
                    <a href="http://127.0.0.1:8000/exportar/xlsx" className="block w-full bg-[#0c4d4d] hover:bg-[#083333] text-white text-center py-2 rounded-xl font-bold shadow-sm transition-all text-[10px] uppercase tracking-wider">
                        ⬇ Exportar Auvo
                    </a>
                    <a href="http://127.0.0.1:8000/exportar-historico" className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white text-center py-2 rounded-xl font-bold shadow-sm transition-all text-[10px] uppercase tracking-wider">
                        📊 Relatório Mensal
                    </a>
                </div>
            </div>

            {/* LINHA 2: FILTROS RÁPIDOS DE PENDÊNCIAS */}
            <div className="flex items-center gap-2 pt-3 border-t border-stone-100 overflow-x-auto">
                <span className="text-[10px] font-bold text-[#0c4d4d]/60 uppercase tracking-wider mr-2">Filtros Rápidos:</span>

                <button
                    onClick={() => setFiltroRapido(filtroRapido === 'sem_tecnico' ? '' : 'sem_tecnico')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${filtroRapido === 'sem_tecnico' ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20' : 'bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100'}`}
                >
                    ⚠️ Sem Técnico
                </button>

                <button
                    onClick={() => setFiltroRapido(filtroRapido === 'sem_data' ? '' : 'sem_data')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${filtroRapido === 'sem_data' ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20' : 'bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100'}`}
                >
                    📅 Sem Data
                </button>

                <button
                    onClick={() => setFiltroRapido(filtroRapido === 'sem_zona' ? '' : 'sem_zona')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${filtroRapido === 'sem_zona' ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20' : 'bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100'}`}
                >
                    📍 Sem Zona
                </button>

                {filtroRapido !== '' && (
                    <button onClick={() => setFiltroRapido('')} className="ml-2 px-3 py-1.5 text-[11px] font-bold text-stone-400 hover:text-stone-600 underline uppercase tracking-wider transition-colors">
                        Limpar Filtro
                    </button>
                )}
            </div>
        </div>
    );
};

export default BarraFiltros;