import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Clientes = () => {
    const [clientes, setClientes] = useState([]);
    const [editando, setEditando] = useState(null);

    useEffect(() => {
        fetchClientes();
    }, []);

    const fetchClientes = async () => {
        const res = await axios.get('http://127.0.0.1:8000/clientes');
        setClientes(res.data);
    };

    const handleSalvarTempo = async (id, novoTempo) => {
        // Aqui você enviará o novo tempo para o backend salvar no mestre.json
        console.log(`Salvando tempo ${novoTempo} para o ID ${id}`);
        setEditando(null);
        // TODO: Criar rota PUT no backend para persistir essa alteração
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Gestão de Clientes</h2>
            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f4f4f4' }}>
                        <th>Cliente</th>
                        <th>Zona</th>
                        <th>Tempo de Atendimento (Horas)</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map(c => (
                        <tr key={c.id_tarefa}>
                            <td>{c.cliente.nome}</td>
                            <td>{c.cliente.zona_roteirizacao}</td>
                            <td>
                                {editando === c.id_tarefa ? (
                                    <input
                                        type="number"
                                        defaultValue={c.contrato.tempo_estimado_horas}
                                        step="0.5"
                                        onBlur={(e) => handleSalvarTempo(c.id_tarefa, e.target.value)}
                                    />
                                ) : (
                                    `${c.contrato.tempo_estimado_horas}h`
                                )}
                            </td>
                            <td>
                                <button onClick={() => setEditando(c.id_tarefa)}>Editar Tempo</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Clientes;