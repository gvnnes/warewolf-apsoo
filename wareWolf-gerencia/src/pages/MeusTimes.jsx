import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import TimeService from '../services/TimeService';
import AtletaService from '../services/AtletaService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

function MeusTimes() {
  const { token } = useAuth();

  const [times, setTimes] = useState([]);
  const [atletasDaEquipe, setAtletasDaEquipe] = useState([]);
  const [inscricoes, setInscricoes] = useState([]);
  const [formNovoTime, setFormNovoTime] = useState({});
  const [selectedAtleta, setSelectedAtleta] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError('');
      
      const inscricoesRes = await fetch('http://localhost:3000/api/equipes/minhas-inscricoes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!inscricoesRes.ok) throw new Error('Falha ao carregar inscrições.');
      const inscricoesData = await inscricoesRes.json();
      setInscricoes(inscricoesData);

      const timesData = await TimeService.listar(token);
      setTimes(timesData);

      const atletasData = await AtletaService.listar(token);
      setAtletasDaEquipe(atletasData);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleCriarTime = async (campeonatoId, modalidadeId) => {
    const nomeDoTime = formNovoTime[`${campeonatoId}-${modalidadeId}`];
    if (!nomeDoTime || nomeDoTime.trim() === '') {
      alert("Por favor, dê um nome ao time.");
      return;
    }
    try {
      await TimeService.criar({ nome: nomeDoTime, campeonatoId, modalidadeId }, token);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAdicionarAtleta = async (timeId) => {
    const atletaId = selectedAtleta[timeId];
    if (!atletaId) {
        alert("Por favor, selecione um atleta para adicionar.");
        return;
    }
    try {
      await TimeService.adicionarAtleta(timeId, atletaId, token);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRemoverAtleta = async (timeId, atletaId) => {
    try {
      await TimeService.removerAtleta(timeId, atletaId, token);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };
  
  if (loading) return <p style={{textAlign: 'center', fontSize: '1.2rem'}}>Carregando seus times...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>Erro: {error}</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: 'auto' }}>
      <h2>Meus Times</h2>
      <p style={{textAlign: 'center', color: 'var(--cor-texto-secundario)', marginBottom: '2rem'}}>
        Monte aqui as escalações da sua equipe para cada modalidade em que estão inscritos.
      </p>
      
      {inscricoes.length > 0 ? inscricoes.map((inscricao) => {
        if (!inscricao.Campeonato || !inscricao.Modalidade) {
          return null;
        }
        
        const { Campeonato, Modalidade } = inscricao;
        const timesDaModalidade = times.filter(t => t.campeonatoId === Campeonato.id && t.modalidadeId === Modalidade.id);
        const formId = `${Campeonato.id}-${Modalidade.id}`;

        return (
          <Card key={formId} title={`${Campeonato.nome} - ${Modalidade.nome}`}>
            <p><b>Regra de atletas:</b> Mínimo {Modalidade.minAtletas}, Máximo {Modalidade.maxAtletas}</p>

            {timesDaModalidade.map(time => {
              const atletasDoTime = time.Atletas || [];
              const atletasNoTimeIds = new Set(atletasDoTime.map(a => a.id));
              const atletasDisponiveis = atletasDaEquipe.filter(a => !atletasNoTimeIds.has(a.id));
              const podeAdicionar = atletasDoTime.length < Modalidade.maxAtletas;

              return (
                <div key={time.id} style={{ border: '1px solid #eee', padding: '1rem', borderRadius: 'var(--border-radius)', marginTop: '1rem' }}>
                  <h4>Time: {time.nome} ({atletasDoTime.length} / {Modalidade.maxAtletas})</h4>
                  {atletasDoTime.length > 0 ? (
                    <ul style={{listStyle: 'none', paddingLeft: 0}}>
                      {atletasDoTime.map(atleta => (
                        <li key={atleta.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0'}}>
                          {atleta.nome} 
                          <Button onClick={() => handleRemoverAtleta(time.id, atleta.id)} variant="danger" style={{padding: '2px 8px', fontSize: '0.8rem'}}>X</Button>
                        </li>
                      ))}
                    </ul>
                  ) : <p style={{fontStyle: 'italic', color: '#666'}}>Nenhum atleta neste time ainda.</p>}
                  
                  {podeAdicionar ? (
                    <div style={{marginTop: '10px', display: 'flex', gap: '10px'}}>
                      <Select value={selectedAtleta[time.id] || ''} onChange={(e) => setSelectedAtleta({...selectedAtleta, [time.id]: e.target.value})} style={{flex: 1}}>
                        <option value="">Adicionar atleta...</option>
                        {atletasDisponiveis.map(atleta => (
                          <option key={atleta.id} value={atleta.id}>{atleta.nome}</option>
                        ))}
                      </Select>
                      <Button onClick={() => handleAdicionarAtleta(time.id)}>Adicionar</Button>
                    </div>
                  ) : <p style={{color: 'orange'}}>Número máximo de atletas atingido.</p>}
                </div>
              );
            })}
            <div style={{marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee', display: 'flex', gap: '10px'}}>
              <Input 
                type="text" 
                placeholder="Nome do novo time (Ex: Principal)" 
                onChange={e => setFormNovoTime({...formNovoTime, [formId]: e.target.value})}
                style={{flex: 1}}
              />
              <Button onClick={() => handleCriarTime(Campeonato.id, Modalidade.id)}>+ Criar Time</Button>
            </div>
          </Card>
        );
      }) : (
        <Card>
            <p style={{textAlign: 'center'}}>Sua equipe ainda não está inscrita em nenhuma modalidade de campeonato. Vá para a página de Campeonatos para se inscrever.</p>
        </Card>
      )}
    </div>
  );
}

export default MeusTimes;