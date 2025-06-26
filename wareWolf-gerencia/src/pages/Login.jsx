import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await AuthService.login(email, senha);
      
      login(data);
      navigate('/');
    } catch (err) {
      setErro(err.message || 'Erro ao fazer login');
    }
  };

  return (
    <>
      <div className="container" style={{textAlign: 'center', maxWidth: '400px', margin: '2rem auto'}}>
        <h1>Login</h1>
        <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required style={{padding: '10px'}}/>
          <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required style={{padding: '10px'}}/>
          <button type="submit" className="add">Entrar</button>
        </form>
        <div style={{ marginTop: '1.5rem' }}>
          <Link to="/forgot-password">Esqueceu sua senha?</Link>
        </div>
        {erro && <p style={{ color: 'red', marginTop: '1rem' }}>{erro}</p>}
      </div>
    </>
  );
}

export default Login;