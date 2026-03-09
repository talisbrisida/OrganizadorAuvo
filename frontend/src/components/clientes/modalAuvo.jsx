import React from 'react';

const ModalAuvo = ({ tarefaEmEdicao, setTarefaEmEdicao, setModalAuvoAberto, salvarOpcoesAuvo }) => {
    return (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl border border-stone-100">
                <h3 className="text-xl font-bold text-[#4d1c0c] mb-1">Configurar Auvo</h3>
                <p className="text-xs text-stone-500 mb-6 font-semibold uppercase tracking-wider">{tarefaEmEdicao?.nome_cliente}</p>

                <div className="flex flex-col gap-4 mt-4">
                    <label className="flex flex-col">
                        <span className="text-[10px] font-bold text-[#4d1c0c]/70 uppercase tracking-wider mb-1">Prioridade:</span>
                        <select className="p-3 border rounded-xl" value={tarefaEmEdicao?.prioridade} onChange={(e) => setTarefaEmEdicao({ ...tarefaEmEdicao, prioridade: e.target.value })}>
                            <option>Alta</option><option>Média</option><option>Baixa</option>
                        </select>
                    </label>
                    <label className="flex flex-col">
                        <span className="text-[10px] font-bold text-[#4d1c0c]/70 uppercase tracking-wider mb-1">Atribuir Para:</span>
                        <select className="p-3 border rounded-xl" value={tarefaEmEdicao?.tarefa_para} onChange={(e) => setTarefaEmEdicao({ ...tarefaEmEdicao, tarefa_para: e.target.value })}>
                            <option>Colaborador</option><option>Equipe</option><option>Membro da equipe</option>
                        </select>
                    </label>
                    <label className="flex flex-col">
                        <span className="text-[10px] font-bold text-[#4d1c0c]/70 uppercase tracking-wider mb-1">Roteirizar:</span>
                        <select className="p-3 border rounded-xl" value={tarefaEmEdicao?.roteirizar} onChange={(e) => setTarefaEmEdicao({ ...tarefaEmEdicao, roteirizar: e.target.value })}>
                            <option>Sim</option><option>Não</option>
                        </select>
                    </label>
                    <label className="flex flex-col">
                        <span className="text-[10px] font-bold text-[#4d1c0c]/70 uppercase tracking-wider mb-1">Descrição:</span>
                        <textarea className="p-3 border rounded-xl" value={tarefaEmEdicao?.descricao} onChange={(e) => setTarefaEmEdicao({ ...tarefaEmEdicao, descricao: e.target.value })} />
                    </label>
                </div>
                <div className="mt-8 flex justify-end gap-3">
                    <button onClick={() => setModalAuvoAberto(false)} className="px-5 py-2.5 text-stone-500 hover:bg-stone-100 rounded-xl text-sm font-bold">Cancelar</button>
                    <button onClick={salvarOpcoesAuvo} className="px-5 py-2.5 bg-[#4d1c0c] text-white rounded-xl text-sm font-bold">Guardar</button>
                </div>
            </div>
        </div>
    );
};

export default ModalAuvo;