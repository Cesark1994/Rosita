import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

export function Navbar() {
    const { state } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (state.isAuthenticated && location.pathname === '/login') {
            navigate('/principal'); // Redirige a la página principal después de iniciar sesión
        }
    }, [state.isAuthenticated, navigate, location.pathname]);

    return (
        <nav className="navbar">
            {state.isAuthenticated ? (
                <>
                    <Link to="/principal">Inicio</Link>
                    <Link to="/perfil">Perfil</Link>
                </>
            ) : (
                <>
                    {location.pathname !== '/login' && <Link to="/login">Iniciar Sesión</Link>}
                    {location.pathname !== '/login' && <Link to="/registro">Registro</Link>}
                </>
            )}
        </nav>
    );
}
