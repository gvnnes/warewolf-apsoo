import React from "react"; 
import styles from '../css/Navbar.module.css';
import Wolf from '../assets/Wolf.png';
import { FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { usuario, logout } = useAuth();

  return (
    <nav className={styles.navbar}>
      <div>
        <img src={Wolf} alt="wolf" className={styles.wolf}/>
      </div>
      <div className={styles.logo}>WAREWOLF</div>

      <ul className={styles.navLinks}>
        <li><Link to="/">Início</Link></li>
        <li><Link to="/explorar">Explorar</Link></li>
        <li><Link to="/campeonatos">Campeonatos</Link></li>
        <li><Link to="/pontuacao">Pontuação</Link></li>
        <li><Link to="/chaveamento">Chaveamentos</Link></li>

        {usuario?.perfil === 'equipe' && (
          <>
            <li><Link to="/equipes">Minha Equipe</Link></li>
            <li><Link to="/atletas">Meus Atletas</Link></li>
            <li><Link to="/meus-times">Meus Times</Link></li>
          </>
        )}
        
        {usuario?.perfil === 'comissao' && (
          <>
            <li><Link to="/validar-documentos">Validar Documentos</Link></li>
            <li><Link to="/gerenciar-equipes">Gerenciar Equipes</Link></li>
            <li><Link to="/gerenciar-modalidades">Gerenciar Modalidades</Link></li>

          </>
        )}
        
        {usuario ? (
          <>
            <li>
              <Link to="/perfil" title="Seu perfil">
                <FaUserCircle className={styles.perfilIcone} />
                <span style={{ marginLeft: '5px' }}>{usuario.nome}</span>
              </Link>
            </li>
            <li>
              <button onClick={logout} className={styles.logoutBtn}>
                Sair
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login">Entrar</Link></li>
            <li><Link to="/register">Cadastrar</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;