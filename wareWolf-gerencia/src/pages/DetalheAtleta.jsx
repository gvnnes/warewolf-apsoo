import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function DetalheAtleta() {
  const { id } = useParams();
  const [atleta, setAtleta] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    fetch(`http://localhost:3000/api/public/atleta/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) setErro(data.error);
        else setAtleta(data);
      })
      .catch(() => setErro('Erro ao carregar atleta'));
  }, [id]);

  if (erro) return <p style={{ color: 'red', textAlign: 'center' }}>{erro}</p>;
  if (!atleta) return <p style={{ textAlign: 'center' }}>Carregando...</p>;

  return (
    <div style={{ background: '#f5f5f5', padding: '2rem', maxWidth: '600px', margin: '2rem auto', borderRadius: '12px' }}>
      <h2>{atleta.nome}</h2>
      <p><strong>Curso:</strong> {atleta.curso}</p>
      <p><strong>Situação:</strong> {atleta.situacao}</p>
      <p><strong>RG:</strong> {atleta.rg}</p>
      <p><strong>CPF:</strong> {atleta.cpf}</p>
      <Link to="/explorar" style={{ display: 'inline-block', marginTop: '1rem' }}>← Voltar para equipes</Link>
    </div>
  );
}

export default DetalheAtleta;
