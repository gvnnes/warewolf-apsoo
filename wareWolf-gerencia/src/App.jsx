import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import ProfileRoute from './components/ProfileRoute';

import Inicio from './pages/Inicio';
import Explorar from './pages/Explorar';
import DetalheAtleta from './pages/DetalheAtleta';
import Campeonatos from './pages/Campeonatos';
import Pontuacao from './pages/Pontuacao';
import Chaveamento from './pages/Chaveamento';
import Login from './pages/Login';
import Register from './pages/Register';
import Perfil from './pages/Perfil';
import Equipes from './pages/Equipes';
import Atletas from './pages/Atletas';
import MeusTimes from './pages/MeusTimes';
import ValidarDocumentos from './pages/ValidarDocumentos';
import GerenciarEquipes from './pages/GerenciarEquipes';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import DetalhePartida from './pages/DetalhePartida';
import GerenciarModalidades from './pages/GerenciarModalidades';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Rotas Públicas */}
        <Route index element={<Inicio />} />
        <Route path="/explorar" element={<Explorar />} />
        <Route path="/atleta/:id" element={<DetalheAtleta />} />
        <Route path="/campeonatos" element={<Campeonatos />} />
        <Route path="/pontuacao" element={<Pontuacao />} />
        <Route path="/chaveamento" element={<Chaveamento />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/partidas/:id" element={<DetalhePartida />} /> 
        
        {/* Rotas Privadas com verificação de perfil */}
        <Route path="/perfil" element={<ProfileRoute allowedProfiles={['equipe', 'comissao', 'admin']}><Perfil /></ProfileRoute>} />
        <Route path="/equipes" element={<ProfileRoute allowedProfiles={['equipe']}><Equipes /></ProfileRoute>} />
        <Route path="/atletas" element={<ProfileRoute allowedProfiles={['equipe']}><Atletas /></ProfileRoute>} />
        <Route path="/meus-times" element={<ProfileRoute allowedProfiles={['equipe']}><MeusTimes /></ProfileRoute>} />
        
        {/* Rotas exclusivas da Comissão */}
        <Route path="/validar-documentos" element={<ProfileRoute allowedProfiles={['comissao']}><ValidarDocumentos /></ProfileRoute>} />
        <Route path="/gerenciar-equipes" element={<ProfileRoute allowedProfiles={['comissao']}><GerenciarEquipes /></ProfileRoute>} />
        <Route path="/gerenciar-modalidades" element={<ProfileRoute allowedProfiles={['comissao']}><GerenciarModalidades /></ProfileRoute>} />
      </Route>
    </Routes>
  );
}

export default App;