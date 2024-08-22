// ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


const ProtectedRoute = ({ children }) => {
    const { state } = useAuth();

    if (!state.isAuthenticated) {
        // Redirige al usuario a la página de login si no está autenticado
        return <Navigate to="/login" />;
    }

    // Renderiza los hijos si el usuario está autenticado
    return children;
};

export default ProtectedRoute;