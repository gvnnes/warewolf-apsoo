import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import styles from './Register.module.css'; 

function Register() {
  const [form, setForm] = useState({ nome: '', email: '', senha: '', perfil: 'equipe' });
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    try {
      await AuthService.register(form);
      alert('Cadastro realizado com sucesso! Por favor, faça o login.');
      navigate('/login');
    } catch (err) {
      setErro(err.message || 'Erro no cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.formContainer}>
        <Card title="Cadastro de Novo Usuário">
          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              name="nome"
              placeholder="Nome Completo"
              value={form.nome}
              onChange={handleChange}
              required
            />
            <Input
              type="email"
              name="email"
              placeholder="E-mail"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Input
              type="password"
              name="senha"
              placeholder="Senha (mínimo 6 caracteres, com letras e números)"
              value={form.senha}
              onChange={handleChange}
              required
            />
            <Select name="perfil" value={form.perfil} onChange={handleChange}>
              <option value="equipe">Quero registrar minha Equipe</option>
              <option value="comissao">Sou da Comissão Organizadora</option>
            </Select>

            <Button type="submit" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
          </form>
        </Card>
        {erro && <p className={styles.error}>{erro}</p>}
      </div>
    </div>
  );
}

export default Register;