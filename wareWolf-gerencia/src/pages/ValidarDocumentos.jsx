import React, { useState, useEffect } from 'react';
import AtletaService from '../services/AtletaService';

function ValidarDocumentos() {
  const token = JSON.parse(localStorage.getItem('user'))?.token;
  const [pendentes, setPendentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comentario, setComentario] = useState('');
  const [reprovandoId, setReprovandoId] = useState(null);

  const carregarPendentes = async () => {
    try {
      setLoading(true);
      const data = await AtletaService.listarPendentes(token);
      setPendentes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      carregarPendentes();
    }
  }, [token]);

  const handleAprovar = async (atletaId) => {
    try {
      await AtletaService.gerenciarStatus(atletaId, { status: 'aprovado' }, token);
      setPendentes(pendentes.filter(p => p.id !== atletaId));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReprovar = async (atletaId) => {
    if (!comentario) {
      alert('O comentário é obrigatório para reprovar.');
      return;
    }
    try {
      await AtletaService.gerenciarStatus(atletaId, { status: 'reprovado', comentarioReprovacao: comentario }, token);
      setReprovandoId(null);
      setComentario('');
      setPendentes(pendentes.filter(p => p.id !== atletaId));
    } catch (err) {
      alert(err.message);
    }
  };
  
  const iniciarReprovacao = (atletaId) => {
    setReprovandoId(atletaId);
    setComentario('');
  };

  if (loading) return <p>Carregando documentos pendentes...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: 'auto' }}>
      <h2>Validação de Documentos</h2>
      {pendentes.length === 0 ? (
        <p>Nenhum documento pendente no momento.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {pendentes.map(atleta => (
            <li key={atleta.id} style={{ background: '#f9f9f9', border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
              <p><strong>Atleta:</strong> {atleta.nome}</p>
              <p><strong>Equipe:</strong> {atleta.Equipe.nome}</p>
              <a href={`http://localhost:3000${atleta.documentoUrl}`} target="_blank" rel="noopener noreferrer">
                Ver Documento
              </a>
              
              <div style={{ marginTop: '1rem' }}>
                <button onClick={() => handleAprovar(atleta.id)} style={{ backgroundColor: 'green', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>Aprovar</button>
                <button onClick={() => iniciarReprovacao(atleta.id)} style={{ backgroundColor: 'darkred', color: 'white', marginLeft: '10px', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>Reprovar</button>
              </div>

              {reprovandoId === atleta.id && (
                <div style={{ marginTop: '1rem', borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
                  <textarea 
                    placeholder="Motivo da reprovação (obrigatório)"
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    style={{ width: '100%', minHeight: '60px', padding: '8px', boxSizing: 'border-box', marginBottom: '10px' }}
                  />
                  <button onClick={() => handleReprovar(atleta.id)}>Confirmar Reprovação</button>
                  <button onClick={() => setReprovandoId(null)} style={{marginLeft: '10px'}}>Cancelar</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ValidarDocumentos;