// App.jsx
import React, { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';
import { Chat } from './componentes/Chat';
import { Login } from './componentes/Login';
import { Musica } from './componentes/Musica';
import { Navbar } from './componentes/Navbar';
import { NotFound } from './componentes/NotFound';
import { Perfil } from './componentes/Perfil';
import { Principal } from './componentes/Principal';
import { Registro } from './componentes/Registro';
import { Playlists } from './componentes/Playlists'; // Importa el componente Playlists
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './componentes/ProtectedRoute'; // Importa el componente ProtectedRoute

function AppContent() {
    const { state, actions } = useAuth();
    const navigate = useNavigate();

    // Efecto para verificar si hay un token en localStorage y autenticar al usuario
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !state.isAuthenticated) {
            actions.login({ token });
        }
    }, [state.isAuthenticated, actions]);

    // Efecto para redirigir al usuario a la página de login si no está autenticado
    useEffect(() => {
        if (!state.isAuthenticated) {
            // Guarda la ruta actual antes de redirigir
            localStorage.setItem('redirectAfterLogin', window.location.pathname);
            navigate('/login');
        }
    }, [state.isAuthenticated, navigate]);

    // Efecto para redirigir al usuario a la ruta guardada después de autenticarse
    useEffect(() => {
        if (state.isAuthenticated) {
            const redirectPath = localStorage.getItem('redirectAfterLogin');
            if (redirectPath) {
                localStorage.removeItem('redirectAfterLogin');
                navigate(redirectPath);
            }
        }
    }, [state.isAuthenticated, navigate]);

    return (
        <>
            <Navbar />
            <Routes>
                {/* Rutas que no requieren autenticación */}
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                
                {/* Rutas que requieren autenticación */}
                <Route path="/" element={<ProtectedRoute><Principal /></ProtectedRoute>} />
                <Route path="/principal" element={<ProtectedRoute><Principal /></ProtectedRoute>} />
                <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                <Route path="/musica" element={<ProtectedRoute><Musica /></ProtectedRoute>} />
                <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
                <Route path="/playlists" element={<ProtectedRoute><Playlists /></ProtectedRoute>} />
                
                {/* Ruta para páginas no encontradas */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
}

export default App;