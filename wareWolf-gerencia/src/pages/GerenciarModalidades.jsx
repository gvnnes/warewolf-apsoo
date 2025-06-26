import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ModalidadeService from '../services/ModalidadeService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import styles from './Chaveamento.module.css';

function GerenciarModalidades() {
  const { token } = useAuth();
  const [modalidades, setModalidades] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModalidade, setEditingModalidade] = useState(null);
  const [formData, setFormData] = useState({ nome: '', minAtletas: '', maxAtletas: '', duracaoMinutos: '' });

  const carregarModalidades = async () => {
    try {
      setLoading(true);
      const data = await ModalidadeService.listar(token);
      setModalidades(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(token) carregarModalidades();
  }, [token]);

  const handleOpenModal = (modalidade = null) => {
    if (modalidade) {
      setEditingModalidade(modalidade);
      setFormData(modalidade);
    } else {
      setEditingModalidade(null);
      setFormData({ nome: '', minAtletas: '', maxAtletas: '', duracaoMinutos: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingModalidade) {
        await ModalidadeService.atualizar(editingModalidade.id, formData, token);
      } else {
        await ModalidadeService.criar(formData, token);
      }
      handleCloseModal();
      carregarModalidades();
    } catch (error) {
      alert('Erro: ' + error.message);
    }
  };

  const handleRemover = async (id) => {
    if (!window.confirm('Tem certeza que deseja remover esta modalidade?')) return;
    try {
        await ModalidadeService.remover(id, token);
        carregarModalidades();
    } catch(error) {
        alert('Erro: ' + error.message);
    }
  }

  if (loading) return <p>Carregando...</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Gerenciar Modalidades</h2>
        <Button onClick={() => handleOpenModal()}>+ Adicionar Modalidade</Button>
      </div>

      <Card>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Nome</th>
              <th style={tableHeaderStyle}>Min. Atletas</th>
              <th style={tableHeaderStyle}>Max. Atletas</th>
              <th style={tableHeaderStyle}>Duração (min)</th>
              <th style={tableHeaderStyle}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {modalidades.map(mod => (
              <tr key={mod.id}>
                <td style={tableCellStyle}>{mod.nome}</td>
                <td style={tableCellStyle}>{mod.minAtletas}</td>
                <td style={tableCellStyle}>{mod.maxAtletas}</td>
                <td style={tableCellStyle}>{mod.duracaoMinutos}</td>
                <td style={tableCellStyle}>
                  <Button onClick={() => handleOpenModal(mod)} style={{marginRight: '10px'}}>Editar</Button>
                  <Button onClick={() => handleRemover(mod.id)} variant="danger">Remover</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>{editingModalidade ? 'Editar Modalidade' : 'Adicionar Nova Modalidade'}</h3>
            <form onSubmit={handleSubmit} className={styles.form}>
              <Input name="nome" placeholder="Nome da Modalidade" value={formData.nome} onChange={handleChange} required />
              <Input type="number" name="minAtletas" placeholder="Mínimo de atletas" value={formData.minAtletas} onChange={handleChange} required />
              <Input type="number" name="maxAtletas" placeholder="Máximo de atletas" value={formData.maxAtletas} onChange={handleChange} required />
              <Input type="number" name="duracaoMinutos" placeholder="Duração da partida (minutos)" value={formData.duracaoMinutos} onChange={handleChange} required />
              <div className={styles.formActions}>
                <Button type="button" onClick={handleCloseModal} variant="secondary">Cancelar</Button>
                <Button type="submit">Salvar</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const tableHeaderStyle = { padding: '12px', borderBottom: '2px solid #ddd', textAlign: 'left' };
const tableCellStyle = { padding: '12px', borderBottom: '1px solid #eee' };

export default GerenciarModalidades;