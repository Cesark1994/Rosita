import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { useAuth } from "../contexts/AuthContext";
import "./Login.css";

export function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [{ data, isError, isLoading }, doFetch] = useFetch(
        `${import.meta.env.VITE_API_BASE_URL}api-auth/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        }
    );

    const { actions } = useAuth();
    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        doFetch();
    }

    function handleChange(event) {
        const { name, value } = event.target;
        if (name === "username") setUsername(value);
        if (name === "password") setPassword(value);
    }

    React.useEffect(() => {
        if (data && !isError) {
            actions.login(data);
            navigate("/principal");
        }
    }, [data, isError, actions, navigate]);

    return (
        <section className="login-section">
            <h1 className="app-title">LO QUE QUIERAS</h1> {/* Añadir el h1 con el nombre de la app */}
            <h2>Iniciar Sesión</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Nombre de usuario:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Cargando..." : "Iniciar Sesión"}
                </button>
                {isError && <p className="error-message">Error al iniciar sesión. Inténtalo de nuevo.</p>}
            </form>
        </section>
    );
}

export default Login;
