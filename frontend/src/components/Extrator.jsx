import React, { useState } from 'react';
import axios from 'axios';

const Extrator = () => {
    const [file, setFile] = useState(null);
    const [keywords, setKeywords] = useState('solicitar peça, quebrado, quebrada, quebrados, orçamento, danificada, danificado, danificados, danificadas, trocar cabo, soldar, trocar, instalar');
    const [loading, setLoading] = useState(false);
    const [resultados, setResultados] = useState(null);
    const [erro, setErro] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setErro('Por favor, selecione um ficheiro.');
            return;
        }

        setLoading(true);
        setErro(null);
        setResultados(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('palavras_chave', keywords);

        try {
            const response = await axios.post('http://127.0.0.1:8000/extrator/processar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.erro) {
                setErro(response.data.erro);
            } else {
                setResultados(response.data);
            }
        } catch (err) {
            setErro('Erro ao processar o ficheiro. Verifique se o formato está correto.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-400 mx-auto animate-fade-in">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-[#4d1c0c] tracking-tight">Extrator de Tarefas</h1>
                <p className="text-stone-500">Filtre relatórios do Auvo para encontrar necessidades de manutenção e orçamentos.</p>
            </header>

            {/* FORMULÁRIO DE UPLOAD */}
            <div className="bg-white p-6 rounded-2xl shadow-lg shadow-stone-200/50 border border-stone-100 mb-8">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div>
                        <label className="block text-sm font-bold text-[#4d1c0c] uppercase tracking-wider mb-2">1. Selecione o Relatório (Excel/CSV)</label>
                        <input
                            type="file"
                            accept=".csv, .xls, .xlsx"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-stone-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-orange-50 file:text-[#4d1c0c] hover:file:bg-orange-100 transition-colors cursor-pointer"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-[#4d1c0c] uppercase tracking-wider mb-2">2. Palavras-chave (separadas por vírgula)</label>
                        <textarea
                            rows="2"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            className="w-full p-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4d1c0c]/20 focus:border-[#4d1c0c] bg-stone-50 resize-none"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${loading ? 'bg-stone-400 cursor-not-allowed' : 'bg-[#4d1c0c] hover:bg-[#3a1509] transform hover:-translate-y-0.5 shadow-[#4d1c0c]/30'}`}
                        >
                            {loading ? 'A processar...' : 'Extrair Dados'}
                        </button>
                    </div>
                </form>

                {erro && (
                    <div className="mt-4 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl font-medium text-sm">
                        ⚠️ {erro}
                    </div>
                )}
            </div>

            {/* RESULTADOS */}
            {resultados && (
                <div className="space-y-6 animate-fade-in">
                    {/* ESTATÍSTICAS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-6 rounded-2xl shadow-md border border-stone-100 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-[#4d1c0c]">{resultados.estatisticas.total}</span>
                            <span className="text-xs text-stone-500 uppercase tracking-wider font-bold mt-1">Total de Registos</span>
                        </div>
                        <div className="bg-orange-50 p-6 rounded-2xl shadow-md border border-orange-200 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-orange-600">{resultados.estatisticas.filtrados}</span>
                            <span className="text-xs text-orange-800 uppercase tracking-wider font-bold mt-1">Tarefas Encontradas</span>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-md border border-stone-100 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-[#4d1c0c]">{resultados.estatisticas.percentual}%</span>
                            <span className="text-xs text-stone-500 uppercase tracking-wider font-bold mt-1">Taxa de Ocorrência</span>
                        </div>
                    </div>

                    {/* TABELA */}
                    <div className="bg-white rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-[#4d1c0c] text-white">
                                    <tr className="uppercase text-[10px] tracking-widest font-semibold">
                                        <th className="p-4 w-32">Data</th>
                                        <th className="p-4 w-64">Cliente</th>
                                        <th className="p-4">Relato do Técnico</th>
                                        <th className="p-4 w-32 text-center">OS Digital</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100">
                                    {resultados.dados.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="p-8 text-center text-stone-500 font-medium">Nenhuma tarefa encontrada com estas palavras-chave.</td>
                                        </tr>
                                    ) : (
                                        resultados.dados.map((linha, index) => (
                                            <tr key={index} className="hover:bg-orange-50/30 transition-colors">
                                                <td className="p-4 text-stone-600 whitespace-nowrap">{linha.Data}</td>
                                                <td className="p-4 font-bold text-[#4d1c0c]">{linha.Cliente}</td>
                                                <td className="p-4 text-stone-600 text-xs">{linha.Relato}</td>
                                                <td className="p-4 text-center">
                                                    {linha['OS Digital'] && linha['OS Digital'].startsWith('http') ? (
                                                        <a href={linha['OS Digital']} target="_blank" rel="noreferrer" className="inline-block bg-stone-100 text-[#4d1c0c] px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#4d1c0c] hover:text-white transition-colors border border-stone-200">
                                                            Abrir OS
                                                        </a>
                                                    ) : (
                                                        <span className="text-stone-400 text-xs">N/A</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Extrator;