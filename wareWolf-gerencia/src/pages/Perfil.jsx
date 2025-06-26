import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import EquipeService from '../services/EquipeService';
import AtletaService from '../services/AtletaService';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import styles from './Perfil.module.css';

function Perfil() {
  const { usuario, token } = useAuth();

  const [equipe, setEquipe] = useState(null);
  const [atletas, setAtletas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const [dadosEquipe, dadosAtletas] = await Promise.all([
          EquipeService.obter(token),
          AtletaService.listar(token)
        ]);
        setEquipe(dadosEquipe);
        setAtletas(dadosAtletas);
      } catch (err) {
        console.error('Erro ao carregar informações do perfil:', err);
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, [token]);

  if (loading) return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Carregando perfil...</p>;
  if (!usuario) return <p style={{ textAlign: 'center', color: 'red' }}>Faça login para visualizar seu perfil.</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Perfil de {usuario.nome}</h2>

      <Card title="Minha Conta">
        <p><strong>Nome:</strong> {usuario.nome}</p>
        <p><strong>Email:</strong> {usuario.email}</p>
        <p><strong>Perfil:</strong> {usuario.perfil}</p>
      </Card>
      
      {usuario.perfil === 'equipe' && (
        <>
          <Card title="Dados da Equipe">
            {equipe ? (
              <div>
                <p><strong>Nome da Equipe:</strong> {equipe.nome}</p>
                <p><strong>Sigla:</strong> {equipe.sigla}</p>
                <p><strong>Instituição:</strong> {equipe.instituicao}</p>
              </div>
            ) : (
              <p>Os dados da sua equipe ainda não foram preenchidos.</p>
            )}
             <div style={{marginTop: '1rem'}}>
                <Button onClick={() => navigate('/equipes')}>Editar Dados da Equipe</Button>
             </div>
          </Card>
          
          <Card title="Meus Atletas">
            {atletas.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {atletas.map(a => (
                  <li key={a.id} className={styles.atletaItem}>
                    <strong>{a.nome}</strong> — {a.curso} ({a.situacao})
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhum atleta cadastrado.</p>
            )}
            <div style={{marginTop: '1rem'}}>
                <Button onClick={() => navigate('/atletas')}>Gerenciar Atletas</Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

export default Perfil;