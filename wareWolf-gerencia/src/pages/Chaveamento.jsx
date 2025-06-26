import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import CampeonatoService from '../services/CampeonatoService';
import PartidaService from '../services/PartidaService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

function Chaveamento() {
  const { usuario, token, logout } = useAuth();
  const navigate = useNavigate();

  const [campeonatos, setCampeonatos] = useState([]);
  const [selectedCampeonato, setSelectedCampeonato] = useState('');
  const [modalidadesDoCampeonato, setModalidadesDoCampeonato] = useState([]);
  const [selectedModalidade, setSelectedModalidade] = useState('');
  
  const [partidas, setPartidas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [placarEdit, setPlacarEdit] = useState({});
  
  useEffect(() => {
    CampeonatoService.listar(token)
      .then(setCampeonatos)
      .catch(err => console.error("Erro ao carregar campeonatos:", err));
  }, [token]);

  useEffect(() => {
    if (selectedCampeonato) {
      const camp = campeonatos.find(c => c.id === parseInt(selectedCampeonato));
      setModalidadesDoCampeonato(camp ? camp.Modalidades : []);
      setSelectedModalidade('');
      setPartidas([]);
    }
  }, [selectedCampeonato, campeonatos]);

  useEffect(() => {
    if (selectedCampeonato && selectedModalidade) {
        buscarPartidas();
    }
  }, [selectedCampeonato, selectedModalidade]);

  const handleAuthError = (err) => {
    console.error(err);
    if (err.message?.includes("Token inválido") || err.message?.includes("Unauthorized")) {
        alert("Sua sessão expirou. Por favor, faça login novamente.");
        logout();
        navigate('/login');
    } else {
        alert("Erro: " + err.message);
    }
  };

  const buscarPartidas = async () => {
    if (!selectedCampeonato || !selectedModalidade) return;
    setLoading(true);
    try {
      const data = await PartidaService.listar(selectedCampeonato, selectedModalidade);
      setPartidas(data);
    } catch (err) { handleAuthError(err); } finally { setLoading(false); }
  };

  const handlePlacarChange = (partidaId, time, valor) => {
    const valorNumerico = valor.replace(/[^0-9]/g, '');
    setPlacarEdit(prev => ({ ...prev, [partidaId]: { ...prev[partidaId], [time]: valorNumerico } }));
  };

  const handleSalvarPlacar = async (partidaId, e) => {
    e.preventDefault();
    e.stopPropagation();
    const placares = placarEdit[partidaId];
    if (placares === undefined || placares.p1 === undefined || placares.p2 === undefined) {
      return alert("Por favor, insira o placar para ambos os times.");
    }
    const placarData = { placarEquipe1: placares.p1, placarEquipe2: placares.p2 };
    try {
      await PartidaService.atualizar(partidaId, placarData, token);
      alert('Placar salvo com sucesso!');
      buscarPartidas();
      setPlacarEdit({});
    } catch (err) { handleAuthError(err); }
  };

  const formatarData = (dataString) => {
    if (!dataString) return null;
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: 'auto' }}>
      <h2>Chaveamento e Resultados</h2>
      <Card>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Select value={selectedCampeonato} onChange={e => setSelectedCampeonato(e.target.value)} style={{flex: 1, minWidth: '200px'}}>
            <option value="">Selecione um Campeonato</option>
            {campeonatos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </Select>
          <Select value={selectedModalidade} onChange={e => setSelectedModalidade(e.target.value)} disabled={!selectedCampeonato} style={{flex: 1, minWidth: '200px'}}>
            <option value="">Selecione uma Modalidade</option>
            {modalidadesDoCampeonato.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
          </Select>
        </div>
      </Card>

      <div style={{marginTop: '2rem'}}>
        {loading ? <p>Carregando...</p> : (
          partidas.length > 0 ? (
            partidas.map(partida => (
              <Card key={partida.id}>
                <div style={{textAlign: 'center', color: '#666', fontSize: '0.9rem', marginBottom: '1rem'}}>
                  {partida.fase} {partida.dataHoraInicio && `- ${formatarData(partida.dataHoraInicio)}`}
                </div>
                <Link to={`/partidas/${partida.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ flex: 1, textAlign: 'right', fontWeight: 'bold', color: partida.vencedorId === partida.equipe1Id ? 'var(--cor-sucesso)' : 'inherit' }}>
                      {partida.equipe1?.nome || 'Aguardando Vencedor'}
                    </span>
                    <div style={{ flex: 0.5, textAlign: 'center', margin: '0 1rem' }}>
                      {partida.vencedorId !== null ? (<strong>{partida.placarEquipe1} x {partida.placarEquipe2}</strong>) : (<span>vs</span>)}
                    </div>
                    <span style={{ flex: 1, textAlign: 'left', fontWeight: 'bold', color: partida.vencedorId === partida.equipe2Id ? 'var(--cor-sucesso)' : 'inherit' }}>
                      {partida.equipe2?.nome || 'Aguardando Vencedor'}
                    </span>
                  </div>
                </Link>
                {usuario?.perfil === 'comissao' && !partida.vencedorId && partida.equipe1 && partida.equipe2 && (
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem'}} >
                    <Input type="number" min="0" style={{width: '60px', textAlign: 'center'}} value={placarEdit[partida.id]?.p1 ?? ''} onChange={(e) => handlePlacarChange(partida.id, 'p1', e.target.value)} placeholder="P1" />
                    <span>x</span>
                    <Input type="number" min="0" style={{width: '60px', textAlign: 'center'}} value={placarEdit[partida.id]?.p2 ?? ''} onChange={(e) => handlePlacarChange(partida.id, 'p2', e.target.value)} placeholder="P2"/>
                    <Button onClick={(e) => handleSalvarPlacar(partida.id, e)}>Salvar Placar</Button>
                  </div>
                )}
              </Card>
            ))
          ) : <p style={{textAlign: 'center'}}>Selecione um campeonato e modalidade para ver as partidas.</p>
        )}
      </div>
    </div>
  );
}

export default Chaveamento;