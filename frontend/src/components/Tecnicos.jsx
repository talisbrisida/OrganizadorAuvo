import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Tecnicos = () => {
    const [tecnicos, setTecnicos] = useState([]);
    const [novoTecnico, setNovoTecnico] = useState({
        nome: '',
        cargo: '',
        zonas_atendimento: '',
        capacidade_diaria_horas: 8
    });

    // Busca os técnicos ao carregar a aba
    useEffect(() => {
        fetchTecnicos();
    }, []);

    const fetchTecnicos = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/tecnicos');
            setTecnicos(response.data);
        } catch (error) {
            console.error("Erro ao buscar técnicos:", error);
        }
    };

    const handleCadastro = async (e) => {
        e.preventDefault();
        // Transforma a string de zonas em um array
        const tecnicoParaEnviar = {
            ...novoTecnico,
            zonas_atendimento: novoTecnico.zonas_atendimento.split(',').map(z => z.trim())
        };

        try {
            await axios.post('http://127.0.0.1:8000/tecnicos', tecnicoParaEnviar);
            setNovoTecnico({ nome: '', cargo: '', zonas_atendimento: '', capacidade_diaria_horas: 8 });
            fetchTecnicos(); // Atualiza a lista
        } catch (error) {
            alert("Erro ao cadastrar técnico.");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Gestão de Técnicos</h2>

            {/* Formulário de Cadastro */}
            <form onSubmit={handleCadastro} style={{ marginBottom: '30px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input
                    placeholder="Nome (Exato do Auvo)"
                    value={novoTecnico.nome}
                    onChange={e => setNovoTecnico({ ...novoTecnico, nome: e.target.value })}
                    required
                />
                <input
                    placeholder="Cargo"
                    value={novoTecnico.cargo}
                    onChange={e => setNovoTecnico({ ...novoTecnico, cargo: e.target.value })}
                    required
                />
                <input
                    placeholder="Zonas (separe por vírgula)"
                    value={novoTecnico.zonas_atendimento}
                    onChange={e => setNovoTecnico({ ...novoTecnico, zonas_atendimento: e.target.value })}
                    required
                />
                <button type="submit">Cadastrar Técnico</button>
            </form>

            {/* Tabela de Exibição */}
            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f4f4f4' }}>
                        <th>Nome no Auvo</th>
                        <th>Zonas de Atendimento</th>
                        <th>Capacidade (Hrs)</th>
                    </tr>
                </thead>
                <tbody>
                    {tecnicos.map(t => (
                        <tr key={t.id}>
                            <td>{t.nome_auvo}</td>
                            <td>{t.zonas_atendimento.join(', ')}</td>
                            <td>{t.capacidade_diaria_horas}h</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Tecnicos;