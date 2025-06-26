import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EquipeService from '../services/EquipeService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

function GerenciarEquipes() {
  const { token } = useAuth();
  const [equipes, setEquipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const carregarEquipes = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await EquipeService.listarTodas(token);
      setEquipes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarEquipes();
  }, [token]);

  const handleRemover = async (id) => {
    if (!window.confirm('Tem certeza que deseja remover esta equipe? Esta ação é irreversível.')) {
      return;
    }
    try {
      await EquipeService.remover(id, token);
      setEquipes(equipes.filter(e => e.id !== id));
      alert('Equipe removida com sucesso.');
    } catch (err) {
      alert('Erro: ' + err.message);
    }
  };

  const handleAtualizarStatus = async (id, statusAtual) => {
    const novoStatus = statusAtual === 'ativo' ? 'desclassificado' : 'ativo';
    const acao = novoStatus === 'ativo' ? 'reativar' : 'desclassificar';
    if (!window.confirm(`Tem certeza que deseja ${acao} esta equipe?`)) return;

    try {
      await EquipeService.atualizarStatus(id, novoStatus, token);
      carregarEquipes();
    } catch (err) {
      alert('Erro: ' + err.message);
    }
  };

  if (loading) return <p>Carregando equipes...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: 'auto' }}>
      <h2>Gerenciar Equipes Cadastradas</h2>

      {equipes.length === 0 ? (
        <Card>
            <p>Nenhuma equipe encontrada.</p>
        </Card>
      ) : (
        equipes.map(equipe => (
          <Card key={equipe.id}>
            <div style={{ opacity: equipe.status === 'desclassificado' ? 0.5 : 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0, textDecoration: equipe.status === 'desclassificado' ? 'line-through' : 'none' }}>
                    {equipe.nome} ({equipe.sigla})
                  </h4>
                  <p style={{ margin: '5px 0', color: 'var(--cor-texto-secundario)' }}>{equipe.instituicao}</p>
                </div>
                {equipe.status === 'desclassificado' && <span style={{color: 'var(--cor-erro)', fontWeight: 'bold'}}>DESCLASSIFICADA</span>}
              </div>
              <p><strong>Representante:</strong> {equipe.representanteNome}</p>
              <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem', display: 'flex', gap: '10px' }}>
                <Link to={`/gerenciar-equipes/${equipe.id}`}>
                  <Button>Editar</Button>
                </Link>
                <Button onClick={() => handleAtualizarStatus(equipe.id, equipe.status)}>
                  {equipe.status === 'ativo' ? 'Desclassificar' : 'Reativar'}
                </Button>
                <Button onClick={() => handleRemover(equipe.id)} variant="danger">
                  Remover
                </Button>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}

export default GerenciarEquipes;