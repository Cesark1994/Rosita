import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Principal.css';

export function Principal() {
    const navigate = useNavigate();
    const { actions } = useAuth();

    const handleLogout = () => {
        actions.logout();
        navigate('/login');
    };

    return (
        <section className="principal-section">
            <h1>LO QUE QUIERAS</h1>
            <div className="button-container">
                <button onClick={() => navigate('/musica')}>MUSICA</button>
                <button onClick={() => navigate('/chat')}>CHAT</button>
            </div>
            <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
        </section>
    );
}
