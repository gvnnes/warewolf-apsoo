import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProfileRoute = ({ children, allowedProfiles }) => {
  const { usuario } = useAuth();

  if (!usuario) {
    return <Navigate to="/login" />;
  }

  if (allowedProfiles.includes(usuario.perfil)) {
    return children;
  }

  return <Navigate to="/" />;
};

export default ProfileRoute;