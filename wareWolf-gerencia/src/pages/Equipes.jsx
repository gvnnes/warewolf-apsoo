import React, { useState, useEffect } from 'react';
import EquipeService from '../services/EquipeService';
import { useAuth } from '../context/AuthContext';

function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let soma = 0, resto;
  for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;
  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[10])) return false;
  return true;
}

function Equipes() {
  const { usuario, token } = useAuth();

  const [equipe, setEquipe] = useState(null);
  const [form, setForm] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [editando, setEditando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(true);

  const carregarEquipe = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const dados = await EquipeService.obter(token);
      if (dados) {
        setEquipe(dados);
        setForm(dados);
        setEditando(false);
      } else {
        setEditando(true);
      }
    } catch (err) {
      setErro('Erro ao carregar dados da equipe.');
    } finally {
      setLoading(false);
    }
  };

  const handleCPFChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setForm({ ...form, representanteCPF: value });
  };

  useEffect(() => {
    carregarEquipe();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setMensagem('');

    if (!validarCPF(form.representanteCPF || '')) {
      setErro('CPF do representante inválido.');
      return;
    }
    try {
      const res = await EquipeService.cadastrar(form, token);
      setMensagem('Dados da equipe salvos com sucesso!');
      setEquipe(res);
      setEditando(false);
    } catch (err) {
      setErro(err.message || 'Erro ao salvar equipe');
    }
  };

  const handleLogoUpload = async () => {
    if (!logoFile) {
      alert("Por favor, selecione um arquivo de imagem para o logo.");
      return;
    }
    const formData = new FormData();
    formData.append('logo', logoFile);

    try {
      const res = await fetch('http://localhost:3000/api/equipes/logo', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert('Logo atualizado com sucesso!');
      setEquipe(data.equipe);
      setLogoFile(null);
    } catch (err) {
      alert("Erro ao enviar logo: " + err.message);
    }
  };

  const inputStyle = { padding: '8px', marginBottom: '10px', width: '100%', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' };
  const labelStyle = { marginTop: '1rem', fontWeight: 'bold', display: 'block' };

  if (loading) return <p>Carregando...</p>;

  return (
    <div style={{ background: '#f0d6ff', color: '#400048', padding: '2rem', borderRadius: '12px', maxWidth: '700px', margin: '2rem auto' }}>
      <h2 style={{ textAlign: 'center' }}>Informações da Equipe</h2>
      {mensagem && <p style={{ color: 'green', textAlign: 'center' }}>{mensagem}</p>}
      {erro && <p style={{ color: 'red', textAlign: 'center' }}>{erro}</p>}

      {/* --- MODO DE VISUALIZAÇÃO --- */}
      {!editando && equipe && (
        <div style={{ textAlign: 'center' }}>
          {equipe.logo && <img src={`http://localhost:3000${equipe.logo}`} alt="Logo da equipe" style={{ width: '120px', height: '120px', borderRadius: '50%', marginBottom: '1rem', objectFit: 'cover' }}/>}
          <p><strong>Nome:</strong> {equipe.nome}</p>
          <p><strong>Sigla:</strong> {equipe.sigla}</p>
          <p><strong>Instituição:</strong> {equipe.instituicao}</p>
          <p><strong>Representante:</strong> {equipe.representanteNome}</p>
          <button onClick={() => setEditando(true)} style={{ marginTop: '1rem', padding: '8px 16px' }}>Editar Dados</button>
        </div>
      )}

      {/* --- MODO DE EDIÇÃO / CADASTRO --- */}
      {editando && (
        <form onSubmit={handleSubmit}>
          {/* Dados da Equipe */}
          <label style={labelStyle}>Nome da Equipe</label>
          <input name="nome" value={form.nome || ''} onChange={handleChange} required style={inputStyle} />

          <label style={labelStyle}>Sigla</label>
          <input name="sigla" value={form.sigla || ''} onChange={handleChange} required style={inputStyle} />

          {/* Upload de Logo */}
          <label style={labelStyle}>Logo da Equipe</label>
          <div style={{border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', textAlign: 'center'}}>
            {equipe?.logo && <img src={`http://localhost:3000${equipe.logo}`} alt="Logo atual" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }}/>}
            <p>Selecione uma nova imagem para o logo:</p>
            <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} />
            <button type="button" onClick={handleLogoUpload} disabled={!logoFile} style={{marginLeft: '10px'}}>Salvar Logo</button>
          </div>

          <label style={labelStyle}>Instituição de Ensino</label>
          <input name="instituicao" value={form.instituicao || ''} onChange={handleChange} required style={inputStyle} />

          <label style={labelStyle}>Endereço da Atlética</label>
          <input name="endereco" value={form.endereco || ''} onChange={handleChange} required style={inputStyle} />
          <input name="cep" value={form.cep || ''} onChange={handleChange} placeholder="CEP" required style={inputStyle} />

          <label style={labelStyle}>História da Equipe</label>
          <textarea name="historia" value={form.historia || ''} onChange={handleChange} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />

          {/* Dados do Representante */}
          <h3 style={{marginTop: '2rem', borderTop: '2px solid #ccc', paddingTop: '1rem'}}>Dados do Representante</h3>
          <label style={labelStyle}>Nome do Representante</label>
          <input name="representanteNome" value={form.representanteNome || ''} onChange={handleChange} required style={inputStyle} />
          <label style={labelStyle}>CPF do Representante</label>
          <input
            name="representanteCPF"
            value={form.representanteCPF || ''}
            onChange={handleCPFChange}
            required
            style={inputStyle}
            maxLength={14}
            placeholder="000.000.000-00"
          />
          <label style={labelStyle}>RG do Representante</label>
          <input name="representanteRG" value={form.representanteRG || ''} onChange={handleChange} required style={inputStyle} />
          <label style={labelStyle}>Órgão Expedidor do RG</label>
          <input name="representanteOrgaoExp" value={form.representanteOrgaoExp || ''} onChange={handleChange} required style={inputStyle} />
          <label style={labelStyle}>Endereço do Representante</label>
          <input name="representanteEndereco" value={form.representanteEndereco || ''} onChange={handleChange} required style={inputStyle} />
          <label style={labelStyle}>CEP do Representante</label>
          <input name="representanteCEP" value={form.representanteCEP || ''} onChange={handleChange} required style={inputStyle} />

          {/* Botão de Salvar Principal */}
          <button type="submit" style={{ padding: '10px 20px', background: '#8000ff', color: 'white', border: 'none', borderRadius: '6px', marginTop: '1rem' }}>
            Salvar Dados da Equipe
          </button>
          {equipe && <button type="button" onClick={() => { setEditando(false); carregarEquipe(); }} style={{marginLeft: '10px'}}>Cancelar</button>}
        </form>
      )}
    </div>
  );
}

export default Equipes;