import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AtletaService from '../services/AtletaService';
import Card from './ui/Card';

function Dashboard() {
  const { usuario, token } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token || !usuario) return;
      setLoading(true);
      
      let data = {};
      try {
        if (usuario.perfil === 'equipe') {
          const res = await fetch('http://localhost:3000/api/equipes/proxima-partida', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            data.proximaPartida = await res.json();
          }
        } else if (usuario.perfil === 'comissao') {
          const pendentes = await AtletaService.listarPendentes(token);
          data.documentosPendentes = pendentes.length;
        }
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      }
      
      setStats(data);
      setLoading(false);
    };

    fetchDashboardData();
  }, [usuario, token]);

  if (loading) {
    return <Card><p>Carregando seu painel...</p></Card>;
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Olá, {usuario.nome}! Bem-vindo(a) de volta.</p>

      {usuario.perfil === 'equipe' && (
        <Card title="Próxima Partida">
          {stats.proximaPartida ? (
            <div>
              <p><strong>{stats.proximaPartida?.Campeonato?.nome} - {stats.proximaPartida?.Modalidade?.nome}</strong></p>
              <p>{stats.proximaPartida?.equipe1?.nome} vs {stats.proximaPartida?.equipe2?.nome}</p>
              <small>Fase: {stats.proximaPartida?.fase}</small>
            </div>
          ) : (
            <p>Nenhuma partida agendada no momento.</p>
          )}
        </Card>
      )}

      {usuario.perfil === 'comissao' && (
        <Card title="Ações Pendentes">
          <p>Você tem <strong>{stats.documentosPendentes || 0}</strong> documentos de atletas para validar.</p>
          <Link to="/validar-documentos">Ir para a página de validação</Link>
        </Card>
      )}
    </div>
  );
}

export default Dashboard;