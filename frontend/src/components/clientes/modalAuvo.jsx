import React from 'react';
import ModalGenerico from '../ModalGenerico';

const ModalAuvo = ({ tarefaEmEdicao, setTarefaEmEdicao, setModalAuvoAberto, salvarOpcoesAuvo }) => {
    return (
        <ModalGenerico
            isOpen={true} 
            onClose={() => setModalAuvoAberto(false)}
            onConfirm={salvarOpcoesAuvo}
            titulo="Configurar Auvo"
            icone="📋"
            textoConfirmar="Guardar"
            corBotao="bg-[#4d1c0c] hover:bg-[#3a1509] shadow-md"
            corIcone="bg-[#4d1c0c]/10 text-[#4d1c0c]"
        >
            {/* O subtítulo com o nome do cliente */}
            <p className="text-xs text-stone-500 mb-6 font-semibold uppercase tracking-wider -mt-4">
                {tarefaEmEdicao?.nome_cliente}
            </p>

            <div className="flex flex-col gap-4 mt-2">
                <label className="flex flex-col">
                    <span className="text-[10px] font-bold text-[#4d1c0c]/70 uppercase tracking-wider mb-1">Prioridade:</span>
                    <select className="p-3 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4d1c0c]/50 transition-all" value={tarefaEmEdicao?.prioridade} onChange={(e) => setTarefaEmEdicao({ ...tarefaEmEdicao, prioridade: e.target.value })}>
                        <option>Alta</option><option>Média</option><option>Baixa</option>
                    </select>
                </label>
                <label className="flex flex-col">
                    <span className="text-[10px] font-bold text-[#4d1c0c]/70 uppercase tracking-wider mb-1">Atribuir Para:</span>
                    <select className="p-3 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4d1c0c]/50 transition-all" value={tarefaEmEdicao?.tarefa_para} onChange={(e) => setTarefaEmEdicao({ ...tarefaEmEdicao, tarefa_para: e.target.value })}>
                        <option>Colaborador</option><option>Equipe</option><option>Membro da equipe</option>
                    </select>
                </label>
                <label className="flex flex-col">
                    <span className="text-[10px] font-bold text-[#4d1c0c]/70 uppercase tracking-wider mb-1">Roteirizar:</span>
                    <select className="p-3 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4d1c0c]/50 transition-all" value={tarefaEmEdicao?.roteirizar} onChange={(e) => setTarefaEmEdicao({ ...tarefaEmEdicao, roteirizar: e.target.value })}>
                        <option>Sim</option><option>Não</option>
                    </select>
                </label>
                <label className="flex flex-col">
                    <span className="text-[10px] font-bold text-[#4d1c0c]/70 uppercase tracking-wider mb-1">Descrição:</span>
                    <textarea className="p-3 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4d1c0c]/50 transition-all min-h-20" value={tarefaEmEdicao?.descricao} onChange={(e) => setTarefaEmEdicao({ ...tarefaEmEdicao, descricao: e.target.value })} />
                </label>
            </div>
        </ModalGenerico>
    );
};

export default ModalAuvo;