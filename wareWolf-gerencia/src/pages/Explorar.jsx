import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaUniversity, FaRunning } from 'react-icons/fa';
import Card from '../components/ui/Card'; // Usando nosso componente Card

function Explorar() {
  const [equipes, setEquipes] = useState([]);
  const [atletas, setAtletas] = useState([]);
  const [selecionada, setSelecionada] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3000/api/public/equipes')
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setEquipes(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const verAtletas = (equipe) => {

    if (selecionada && selecionada.id === equipe.id) {
        setSelecionada(null);
        setAtletas([]);
        return;
    }
    setSelecionada(equipe);
    fetch(`http://localhost:3000/api/public/equipes/${equipe.id}/atletas`)
      .then(res => res.json())
      .then(setAtletas)
      .catch(console.error);
  };
  
  if (loading) return <p>Carregando equipes...</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center' }}><FaUsers style={{ marginRight: 8 }} />Explorar Equipes</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {equipes.map(eq => (
          <div key={eq.id} onClick={() => verAtletas(eq)} style={{cursor: 'pointer'}}>
            <Card>
                <div style={{ textAlign: 'center' }}>
                    {eq.logo && <img src={`http://localhost:3000${eq.logo}`} alt="logo" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem' }} />}
                    <h4 style={{margin: 0}}>{eq.nome}</h4>
                    <p style={{color: '#666'}}>{eq.sigla}</p>
                    <p><FaUniversity style={{ marginRight: 5 }} /> {eq.instituicao}</p>
                </div>
            </Card>
          </div>
        ))}
      </div>

      {selecionada && (
        <Card title={`Atletas da equipe ${selecionada.nome}`}>
            {atletas.length === 0 ? (
                <p>Nenhum atleta encontrado para esta equipe.</p>
            ) : (
                <ul style={{ padding: 0, listStyle: 'none' }}>
                {atletas.map(a => (
                    <li key={a.id} style={{ background: '#f9f9f9', padding: '0.5rem 1rem', marginBottom: '8px', borderRadius: '4px' }}>
                    <strong>{a.nome}</strong> — {a.curso} ({a.situacao}) —{' '}
                    <Link to={`/atleta/${a.id}`} style={{ color: '#6000aa' }}>Ver mais</Link>
                    </li>
                ))}
                </ul>
            )}
        </Card>
      )}
    </div>
  );
}

export default Explorar;