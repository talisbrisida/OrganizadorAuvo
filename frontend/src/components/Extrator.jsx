import React, { useState } from 'react';
import axios from 'axios';
import ModalGenerico from './ModalGenerico';

const Extrator = () => {
    const [file, setFile] = useState(null);
    const [keywords, setKeywords] = useState('solicitar peça, quebrado, quebrada, quebrados, orçamento, danificada, danificado, danificados, danificadas, trocar cabo, soldar, trocar, instalar');
    const [loading, setLoading] = useState(false);
    const [resultados, setResultados] = useState(null);
    const [erro, setErro] = useState(null);
    const [dadosExtraidos, setDadosExtraidos] = useState([]); // Lista editável
    const [linhaEmEdicao, setLinhaEmEdicao] = useState(null); // Qual linha estamos a editar
    const [textoEdicao, setTextoEdicao] = useState(""); // O texto temporário durante a edição
    const [linhaParaExcluir, setLinhaParaExcluir] = useState(null);

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
                setDadosExtraidos(response.data.dados);
            }
        } catch (err) {
            setErro('Erro ao processar o ficheiro. Verifique se o formato está correto.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // FUNÇÕES DO CRUD
    const pedirConfirmacaoExclusao = (index) => {
        setLinhaParaExcluir(index);
    };

    const confirmarExclusao = () => {
        if (linhaParaExcluir !== null) {
            setDadosExtraidos(dadosExtraidos.filter((_, i) => i !== linhaParaExcluir));
            setLinhaParaExcluir(null); // Fecha o modal após excluir
        }
    };
    const iniciarEdicao = (index, relatoAtual) => {
        setLinhaEmEdicao(index);
        setTextoEdicao(relatoAtual);
    };

    const salvarEdicao = (index) => {
        const novaLista = [...dadosExtraidos];
        novaLista[index].Relato = textoEdicao;
        setDadosExtraidos(novaLista);
        setLinhaEmEdicao(null);
    };

    return (
        <div className="p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in h-full overflow-y-auto print:overflow-visible print:h-auto print:p-0 print:m-0">
            <header className="mb-8 print:hidden">
                <h1 className="text-3xl font-bold text-[#4d1c0c] tracking-tight">Extrator de Tarefas</h1>
                <p className="text-stone-500">Filtre relatórios do Auvo para encontrar necessidades de manutenção e orçamentos.</p>
            </header>

            {/* FORMULÁRIO DE UPLOAD */}
            <div className="bg-white p-6 rounded-2xl shadow-lg shadow-stone-200/50 border border-stone-100 mb-8 print:hidden">
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
                <div className="space-y-6 animate-fade-in pb-12 print:pb-0">

                    {/* BARRA SUPERIOR (Imprimir e Estatísticas) */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-stone-100 print:hidden">
                        <div className="flex gap-4 items-center">
                            <div className="bg-[#4d1c0c]/10 text-[#4d1c0c] px-4 py-2 rounded-lg font-bold">
                                {dadosExtraidos.length} Tarefas
                            </div>
                            <span className="text-sm text-stone-500">
                                Total extraído do arquivo original: {resultados.estatisticas.total}
                            </span>
                        </div>

                        <button
                            onClick={() => window.print()}
                            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-md shadow-orange-600/20 transition-all flex items-center gap-2"
                        >
                            📄 Salvar como PDF
                        </button>
                    </div>

                    {/* CABEÇALHO PARA IMPRESSÃO (Só aparece no PDF) */}
                    <div className="hidden print:block mb-6 text-center">
                        <h2 className="text-2xl font-bold text-[#4d1c0c]">Relatório de Necessidades e Orçamentos</h2>
                        <p className="text-stone-500 text-sm">Gerado em: {new Date().toLocaleDateString('pt-BR')} | Total de Tarefas: {dadosExtraidos.length}</p>
                        <hr className="mt-4 border-stone-300" />
                    </div>

                    {/* TABELA */}
                    <div className="bg-white rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-100 overflow-hidden print:shadow-none print:border-none">
                        <div className="overflow-x-auto print:overflow-visible">
                            <table className="w-full text-left text-sm print:text-xs">
                                <thead className="bg-[#4d1c0c] text-white print:bg-stone-100 print:text-stone-800">
                                    <tr className="uppercase text-[10px] tracking-widest font-semibold print:border-b-2 print:border-stone-300">
                                        <th className="p-4 print:py-2 print:px-0 w-24">Data</th>
                                        <th className="p-4 print:py-2 print:px-2 w-48">Cliente</th>
                                        <th className="p-4 print:py-2 print:px-2">Relato do Técnico</th>
                                        <th className="p-4 print:py-2 print:px-2 w-32 text-center">OS Digital</th>
                                        <th className="p-4 w-24 text-center print:hidden">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100 print:divide-stone-300">
                                    {dadosExtraidos.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="p-8 text-center text-stone-500 font-medium">Nenhuma tarefa na lista.</td>
                                        </tr>
                                    ) : (
                                        dadosExtraidos.map((linha, index) => (
                                            <tr key={index} className="hover:bg-orange-50/30 transition-colors group print:break-inside-avoid">
                                                <td className="p-4 print:py-3 print:px-0 text-stone-600 whitespace-nowrap align-top">{linha.Data}</td>
                                                <td className="p-4 print:py-3 print:px-2 font-bold text-[#4d1c0c] print:text-stone-800 align-top">{linha.Cliente}</td>

                                                <td className="p-4 print:py-3 print:px-2 align-top">
                                                    {linhaEmEdicao === index ? (
                                                        <div className="flex flex-col gap-2 print:hidden">
                                                            <textarea
                                                                className="w-full p-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs text-stone-700 min-h-80"
                                                                value={textoEdicao}
                                                                onChange={(e) => setTextoEdicao(e.target.value)}
                                                            />
                                                            <div className="flex gap-2 justify-end">
                                                                <button onClick={() => setLinhaEmEdicao(null)} className="text-xs px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded font-bold transition-colors">Cancelar</button>
                                                                <button onClick={() => salvarEdicao(index)} className="text-xs px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold transition-colors">Salvar</button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-stone-600 print:text-stone-800 text-xs leading-relaxed">{linha.Relato}</span>
                                                    )}
                                                </td>

                                                <td className="p-4 print:py-3 print:px-2 text-center align-top">
                                                    {linha['OS Digital'] && linha['OS Digital'].startsWith('http') ? (
                                                        <a
                                                            href={linha['OS Digital']}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-block bg-stone-100 text-[#4d1c0c] px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-[#4d1c0c] hover:text-white transition-colors border border-stone-200 uppercase tracking-wider print:bg-transparent print:border-none print:text-blue-600 print:underline print:p-0 print:normal-case print:text-xs"
                                                        >
                                                            Abrir Link
                                                        </a>
                                                    ) : (
                                                        <span className="text-stone-400 text-[10px] uppercase font-bold">N/A</span>
                                                    )}
                                                </td>

                                                <td className="p-4 text-center align-top print:hidden">
                                                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => iniciarEdicao(index, linha.Relato)}
                                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                            title="Editar Relato"
                                                        >
                                                            ✏️
                                                        </button>
                                                        <button
                                                            onClick={() => pedirConfirmacaoExclusao(index)} // <--- ALTERE AQUI
                                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                            title="Excluir do Relatório"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* USANDO O NOSSO MOLDE PARA A EXCLUSÃO */}
                    <ModalGenerico
                        isOpen={linhaParaExcluir !== null}
                        onClose={() => setLinhaParaExcluir(null)}
                        onConfirm={confirmarExclusao}
                        titulo="Excluir Relato?"
                        icone="🗑️"
                        textoConfirmar="Confirmar Exclusão"
                        corBotao="bg-red-600 hover:bg-red-700 shadow-red-600/30"
                        corIcone="bg-red-100 text-red-600"
                    >
                        <p>
                            Tem certeza que deseja remover o relato do cliente <strong className="text-[#4d1c0c]">{dadosExtraidos[linhaParaExcluir]?.Cliente}</strong> do relatório final?
                        </p>
                        <br />
                        <span className="text-xs text-stone-400">Esta ação afetará apenas a exportação em PDF.</span>
                    </ModalGenerico>

                </div>
            )}
        </div>
    );
};

export default Extrator;