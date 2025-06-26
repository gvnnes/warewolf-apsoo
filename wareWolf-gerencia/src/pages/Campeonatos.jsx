import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CampeonatoService from '../services/CampeonatoService';

function Campeonatos() {
  const { usuario, token } = useAuth(); 
  const navigate = useNavigate();

  const [campeonatos, setCampeonatos] = useState([]);
  const [allModalidades, setAllModalidades] = useState([]);
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    dataInicio: '',
    selectedModalidades: {}
  });
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const fetchData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const campeonatosData = await CampeonatoService.listar(token);
      setCampeonatos(campeonatosData);
      
      const modalidadesRes = await fetch('http://localhost:3000/api/modalidades', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const modalidadesData = await modalidadesRes.json();
      setAllModalidades(modalidadesData);

    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      selectedModalidades: {
        ...prevForm.selectedModalidades,
        [value]: checked
      }
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setMensagem('');

    const modalidadeIds = Object.keys(form.selectedModalidades).filter(id => form.selectedModalidades[id]);
    if (modalidadeIds.length === 0) {
      return setErro('Selecione pelo menos uma modalidade.');
    }

    const body = {
      nome: form.nome,
      descricao: form.descricao,
      dataInicio: form.dataInicio,
      modalidadeIds: modalidadeIds
    };

    try {
      await CampeonatoService.criar(body, token);
      setMensagem(`Campeonato criado com sucesso!`);
      setForm({ nome: '', descricao: '', dataInicio: '', selectedModalidades: {} });
      fetchData();
    } catch (err) {
      setErro(err.message);
    }
  };

  const handleGerarChaveamento = async (campeonatoId, modalidadeId) => {
    if (!window.confirm("Tem certeza que deseja gerar o chaveamento para esta modalidade? Esta ação não pode ser desfeita.")) return;
    try {
      const res = await CampeonatoService.gerarChaveamento(campeonatoId, modalidadeId, token);
      alert(res.message);
      navigate('/chaveamento');
    } catch (err) {
      alert("Erro: " + err.message);
    }
  };

  const handleInscrever = async (campeonatoId, modalidadeId) => {
    try {
        const res = await CampeonatoService.inscrever(campeonatoId, modalidadeId, token);
        alert(res.message);
    } catch (err) {
        alert("Erro: " + err.message);
    }
  };

  if (loading) return <p>Carregando campeonatos...</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
      <h2>Gerenciar Campeonatos</h2>

      {usuario?.perfil === 'comissao' && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '10px', background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
          <h4>Criar Novo Campeonato</h4>
          <input name="nome" placeholder="Nome do Evento (Ex: Copa Lince 2025)" value={form.nome} onChange={handleChange} required />
          <textarea name="descricao" placeholder="Descrição do Evento" value={form.descricao} onChange={handleChange} />
          <input name="dataInicio" type="date" value={form.dataInicio} onChange={handleChange} required />
          <fieldset style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px' }}>
            <legend>Selecione as Modalidades</legend>
            {allModalidades.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {allModalidades.map(modalidade => (
                  <div key={modalidade.id}>
                    <input type="checkbox" id={`modalidade-${modalidade.id}`} value={modalidade.id} checked={!!form.selectedModalidades[modalidade.id]} onChange={handleCheckboxChange} />
                    <label htmlFor={`modalidade-${modalidade.id}`} style={{ marginLeft: '5px' }}>{modalidade.nome}</label>
                  </div>
                ))}
              </div>
            ) : (<p>Carregando modalidades...</p>)}
          </fieldset>
          <div style={{ marginTop: '1rem' }}><button type="submit">Criar Campeonato</button></div>
        </form>
      )}

      {mensagem && <p style={{ color: 'green', textAlign: 'center' }}>{mensagem}</p>}
      {erro && <p style={{ color: 'red', textAlign: 'center' }}>{erro}</p>}

      <h3>Campeonatos Existentes</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {campeonatos.length > 0 ? campeonatos.map((c) => (
          <li key={c.id} style={{ background: '#eee', marginBottom: '1rem', padding: '1rem', borderRadius: '8px' }}>
            <strong>{c.nome}</strong>
            <p>{c.descricao}</p>
            <p><strong>Data de início:</strong> {new Date(c.dataInicio).toLocaleDateString()}</p>
            <div>
              <strong>Modalidades:</strong>
              <ul style={{ listStyle: 'none', paddingLeft: '20px' }}>
                {c.Modalidades.map(m => (
                  <li key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0' }}>
                    <span>{m.nome}</span>
                    <div>
                      {usuario?.perfil === 'comissao' && (
                        <button onClick={() => handleGerarChaveamento(c.id, m.id)} style={{ padding: '4px 8px', fontSize: '0.8rem', marginLeft: '10px' }}>Gerar Chaveamento</button>
                      )}
                      {usuario?.perfil === 'equipe' && (
                        <button onClick={() => handleInscrever(c.id, m.id)} style={{ padding: '4px 8px', fontSize: '0.8rem', marginLeft: '10px', background: '#28a745', color: 'white' }}>Inscrever-se</button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        )) : (
          <p>Nenhum campeonato encontrado.</p>
        )}
      </ul>
    </div>
  );
}

export default Campeonatos;