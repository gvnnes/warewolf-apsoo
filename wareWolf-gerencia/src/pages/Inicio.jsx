import React from 'react';
import { useAuth } from '../context/AuthContext';
import Dashboard from '../components/Dashboard';
import styles from '../css/Inicio.module.css';
import Wolf from '../assets/Wolf.png';

function Inicio() {
  const { usuario } = useAuth();

  if (usuario) {
    return (
      <div className={styles.container}>
        <Dashboard />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Bem-vindo ao WareWolf!!</h1>
      <p>Sistema de chaveamento feito para melhorar a organização de campeonatos.</p>
      <img src={Wolf} alt="wolf" className={styles.logo}/>
    </div>
  );
}

export default Inicio;