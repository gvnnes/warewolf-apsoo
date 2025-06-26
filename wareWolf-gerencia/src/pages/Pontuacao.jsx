import React, { useState, useEffect } from 'react';

function Pontuacao() {
  const [ranking, setRanking] = useState([]);
  const [modalidades, setModalidades] = useState([]);
  const [selectedModalidade, setSelectedModalidade] = useState('geral');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = JSON.parse(localStorage.getItem('user'))?.token;

  useEffect(() => {
    if (!token) return;
    fetch('http://localhost:3000/api/modalidades', {
        headers: {
            'Authorization': `Bearer ${token}` 
        }
    })
      .then(res => res.json())
      .then(setModalidades)
      .catch(err => console.error("Erro ao carregar modalidades", err));
  }, [token]);
  
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    let url = 'http://localhost:3000/api/classificacao';
    if (selectedModalidade !== 'geral') {
      url += `/${selectedModalidade}`;
    }

    fetch(url, { headers: { 'Authorization': `Bearer ${token}` }})
      .then(res => {
        if (!res.ok) throw new Error("Falha ao buscar ranking.");
        return res.json();
      })
      .then(data => {
        setRanking(data);
      })
      .catch(err => {
        setError(err.message);
        setRanking([]); 
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedModalidade, token]);

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
      <h2>Painel de Classificação</h2>

      <div style={{ marginBottom: '2rem' }}>
        <label htmlFor="modalidade-filtro">Filtrar por modalidade: </label>
        <select 
          id="modalidade-filtro" 
          value={selectedModalidade} 
          onChange={e => setSelectedModalidade(e.target.value)}
        >
          <option value="geral">Ranking Geral</option>
          {modalidades.map(m => (
            <option key={m.id} value={m.id}>{m.nome}</option>
          ))}
        </select>
      </div>

      {loading ? <p>Carregando...</p> : 
       error ? <p style={{color: 'red'}}>Erro: {error}</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#ddd' }}>
              <th style={tableHeaderStyle}>Pos.</th>
              <th style={tableHeaderStyle}>Equipe</th>
              <th style={tableHeaderStyle}>Pontos</th>
              <th style={tableHeaderStyle}>Vitórias</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map(item => (
              <tr key={item.equipeId}>
                <td style={tableCellStyle}>{item.posicao}º</td>
                <td style={tableCellStyle}>{item.equipeNome}</td>
                <td style={tableCellStyle}>{item.pontos}</td>
                <td style={tableCellStyle}>{item.vitorias}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {ranking.length === 0 && !loading && !error && <p>Nenhum dado de classificação encontrado para esta seleção.</p>}
    </div>
  );
}

const tableHeaderStyle = { padding: '12px', border: '1px solid #ccc', textAlign: 'left' };
const tableCellStyle = { padding: '12px', border: '1px solid #ccc' };

export default Pontuacao;