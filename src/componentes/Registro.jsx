import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Registro.css';

export function Registro() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegistro = (e) => {
        e.preventDefault();
        // Implementar lógica para registro aquí
        console.log('Registro:', { username, email, password });
        navigate('/login');
    };

    return (
        <section className="registro-section">
            <h1>Registro</h1>
            <form className="registro-form" onSubmit={handleRegistro}>
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">REGISTRARSE</button>
            </form>
        </section>
    );
}
