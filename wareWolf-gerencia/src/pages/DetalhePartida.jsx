import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PartidaService from '../services/PartidaService';
import Card from '../components/ui/Card';
import styles from './DetalhePartida.module.css';

function DetalhePartida() {
  const { id } = useParams();
  const [partida, setPartida] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    PartidaService.obterPorId(id)
      .then(setPartida)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Carregando detalhes da partida...</p>;
  if (error) return <p style={{ color: 'red' }}>Erro: {error}</p>;
  if (!partida) return <p>Partida não encontrada.</p>;

  const vencedorStyle = { color: 'var(--cor-sucesso)', fontWeight: 'bold' };

  return (
    <div style={{ padding: '2rem' }}>
      <Card title={`${partida.campeonato.nome} - ${partida.modalidade.nome}`}>
        <div className={styles.placarContainer}>
          {/* Time 1 */}
          <div className={styles.timeInfo}>
            {partida.equipe1?.logo && <img src={`http://localhost:3000${partida.equipe1.logo}`} alt={partida.equipe1.nome} />}
            <h3 style={partida.vencedorId === partida.equipe1Id ? vencedorStyle : {}}>{partida.equipe1?.nome || 'A definir'}</h3>
          </div>

          {/* Placar */}
          <div className={styles.placar}>
            {partida.placarEquipe1 !== null ? `${partida.placarEquipe1} x ${partida.placarEquipe2}` : 'vs'}
          </div>

          {/* Time 2 */}
          <div className={styles.timeInfo}>
            {partida.equipe2?.logo && <img src={`http://localhost:3000${partida.equipe2.logo}`} alt={partida.equipe2.nome} />}
            <h3 style={partida.vencedorId === partida.equipe2Id ? vencedorStyle : {}}>{partida.equipe2?.nome || 'A definir'}</h3>
          </div>
        </div>

        <div className={styles.detalhesJogo}>
          <p>Fase: {partida.fase}</p>
          {partida.vencedor && <p>Vencedor: <strong>{partida.vencedor.nome}</strong></p>}
        </div>
      </Card>
      <div style={{textAlign: 'center', marginTop: '2rem'}}>
        <Link to="/chaveamento">← Voltar para o Chaveamento</Link>
      </div>
    </div>
  );
}

export default DetalhePartida;