import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../services/AuthService';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const data = await AuthService.forgotPassword(email);
      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ textAlign: 'center', maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Recuperar Senha</h2>
      <p>Digite seu e-mail para receber um token de redefinição.</p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="email"
          placeholder="Seu e-mail de cadastro"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '10px' }}
        />
        <button type="submit">Enviar</button>
      </form>
      {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      <div style={{ marginTop: '1rem' }}>
        <Link to="/login">Voltar para o Login</Link>
      </div>
    </div>
  );
}

export default ForgotPassword;