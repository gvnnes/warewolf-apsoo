import React, { useEffect, useState } from 'react';
import AtletaService from '../services/AtletaService';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import styles from './Atletas.module.css';

function Atletas() {
  const { usuario, token } = useAuth();
  
  const [atletas, setAtletas] = useState([]);
  const [form, setForm] = useState({ nome: '', rg: '', cpf: '', curso: '', situacao: 'acadêmico' });
  const [editando, setEditando] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [selectedFiles, setSelectedFiles] = useState({});

  const carregarAtletas = async () => {
    if (!token) return;
    try {
      const lista = await AtletaService.listar(token);
      setAtletas(lista);
    } catch (err) {
      setErro(err.message);
    }
  };

  useEffect(() => {
    if (token) {
        carregarAtletas();
    }
  }, [token]);

  const handleFileChange = (e, atletaId) => {
    setSelectedFiles({ ...selectedFiles, [atletaId]: e.target.files[0] });
  };

  const handleUploadDocumento = async (atletaId) => {
    const file = selectedFiles[atletaId];
    if (!file) {
      return alert('Por favor, selecione um arquivo primeiro.');
    }
    const formData = new FormData();
    formData.append('documento', file);

    try {
      const res = await fetch(`http://localhost:3000/api/atletas/${atletaId}/documento`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha no upload.');
      setMensagem('Documento enviado com sucesso!');
      setSelectedFiles({ ...selectedFiles, [atletaId]: null });
      carregarAtletas();
    } catch (err) {
      setErro(err.message);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem('');
    setErro('');
    try {
      if (editando) {
        await AtletaService.editar(editando, form, token);
        setMensagem('Atleta atualizado!');
      } else {
        await AtletaService.cadastrar(form, token);
        setMensagem('Atleta cadastrado!');
      }
      setForm({ nome: '', rg: '', cpf: '', curso: '', situacao: 'acadêmico' });
      setEditando(null);
      carregarAtletas();
    } catch (err) {
      setErro(err.message);
    }
  };

  const iniciarEdicao = (a) => {
    setEditando(a.id);
    setForm({ nome: a.nome, rg: a.rg, cpf: a.cpf, curso: a.curso, situacao: a.situacao });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicao = () => {
    setEditando(null);
    setForm({ nome: '', rg: '', cpf: '', curso: '', situacao: 'acadêmico' });
  };

  const excluirAtleta = async (id) => {
    if (!window.confirm('Deseja realmente excluir este atleta?')) return;
    try {
      await AtletaService.excluir(id, token);
      setMensagem('Atleta removido');
      carregarAtletas();
    } catch (err) {
      setErro(err.message);
    }
  };

  if (!usuario) return null;

  const getStatusClass = (status) => {
    if (status === 'aprovado') return styles.docStatusAprovado;
    if (status === 'reprovado') return styles.docStatusReprovado;
    return styles.docStatusPendente;
  };

  return (
    <div className={styles.container}>
      <h2>Gerenciar Atletas</h2>
      <Card title={editando ? `Editando: ${form.nome}` : 'Cadastrar Novo Atleta'}>
        <form onSubmit={handleSubmit} className={styles.formGrid}>
          <div className={styles.fullWidth}>
            <Input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome completo" required />
          </div>
          <Input name="rg" value={form.rg} onChange={handleChange} placeholder="RG" required />
          <Input name="cpf" value={form.cpf} onChange={handleChange} placeholder="CPF" required />
          <Input name="curso" value={form.curso} onChange={handleChange} placeholder="Curso" required />
          <Select name="situacao" value={form.situacao} onChange={handleChange}>
            <option value="acadêmico">Acadêmico</option>
            <option value="graduado">Graduado</option>
            <option value="ed. eternum">Ed. Eternum</option>
            <option value="não vinculado">Não vinculado</option>
          </Select>
          <div className={styles.actions}>
            <Button type="submit">{editando ? 'Salvar Alterações' : 'Cadastrar Atleta'}</Button>
            {editando && <Button type="button" onClick={cancelarEdicao} variant="secondary">Cancelar</Button>}
          </div>
        </form>
      </Card>

      {mensagem && <p style={{ color: 'green', textAlign: 'center' }}>{mensagem}</p>}
      {erro && <p style={{ color: 'red', textAlign: 'center' }}>{erro}</p>}

      <h3 style={{ marginTop: '2rem' }}>Atletas Cadastrados</h3>
      {atletas.map((a) => (
        <Card key={a.id}>
          <div className={styles.atletaHeader}>
            <div className={styles.atletaInfo}>
              <strong style={{fontSize: '1.1rem'}}>{a.nome}</strong>
              <p style={{margin: '5px 0', color: '#666'}}>{a.curso} ({a.situacao})</p>
            </div>
            <span className={`${styles.docStatus} ${getStatusClass(a.statusDocumento)}`}>
                {a.statusDocumento}
            </span>
          </div>
          
          <div className={styles.section}>
            {a.statusDocumento === 'reprovado' && ( <div className={styles.docReprovadoInfo}><strong>Motivo:</strong> {a.comentarioReprovacao}</div>)}
            {a.documentoUrl && (<a href={`http://localhost:3000${a.documentoUrl}`} target="_blank" rel="noopener noreferrer">Ver Documento Enviado</a>)}
            <div style={{ marginTop: '10px' }}>
              <p style={{margin: '0 0 5px 0', fontSize: '0.9rem'}}>Enviar/Atualizar documento:</p>
              <Input type="file" onChange={(e) => handleFileChange(e, a.id)} />
              <Button onClick={() => handleUploadDocumento(a.id)} style={{ marginLeft: '10px' }} disabled={!selectedFiles[a.id]}>Enviar</Button>
            </div>
          </div>

          <div className={`${styles.section} ${styles.actions}`}>
            <Button onClick={() => iniciarEdicao(a)}>✏️ Editar</Button>
            <Button onClick={() => excluirAtleta(a.id)} variant="danger">🗑️ Excluir</Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default Atletas;