import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EquipeService from '../services/EquipeService';

function EditarEquipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem('user'))?.token;

  const [form, setForm] = useState({
    nome: '',
    sigla: '',
    instituicao: '',
    representante: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id || !token) return;
    
    EquipeService.obterPorId(id, token)
      .then(data => {
        setForm({
            nome: data.nome || '',
            sigla: data.sigla || '',
            instituicao: data.instituicao || '',
            representante: data.representante || ''
        });
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await EquipeService.atualizar(id, form, token);
      alert('Equipe atualizada com sucesso!');
      navigate('/gerenciar-equipes');
    } catch (err) {
      alert('Erro ao atualizar equipe: ' + err.message);
    }
  };

  if (loading) return <p>Carregando dados da equipe...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: 'auto' }}>
      <h2>Editando Equipe: {form.nome}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Nome da Equipe</label>
          <input name="nome" value={form.nome} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
        </div>
        <div>
          <label>Sigla</label>
          <input name="sigla" value={form.sigla} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
        </div>
        <div>
          <label>Instituição</label>
          <input name="instituicao" value={form.instituicao} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
        </div>
        <div>
          <label>Representante</label>
          <input name="representante" value={form.representante} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
        </div>
        <button type="submit" style={{ padding: '10px', marginTop: '1rem' }}>Salvar Alterações</button>
      </form>
    </div>
  );
}

export default EditarEquipe;