import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Perfil.css";

export function Perfil() {
    const { state } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        user_id: "",
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        dob: "",
        bio: "",
        state: ""
    });
    const [states, setStates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Fetch the user's profile data
    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/profiles/profile_data/`, {
                    method: "GET",
                    headers: {
                        Authorization: `Token ${state.token}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setProfile(prevProfile => ({
                    ...prevProfile,
                    user_id: data.user__id,
                    username: data.username,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    email: data.email,
                    dob: data.dob,
                    bio: data.bio,
                    state: data.state
                }));
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        }

        fetchProfile();
    }, [state.token]);

    // Fetch the list of user states
    useEffect(() => {
        async function fetchStates() {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/user-states/`, {
                    headers: {
                        "Authorization": `Token ${state.token}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setStates(data.results);
            } catch (error) {
                setError(error);
            }
        }

        fetchStates();
    }, [state.token]);

    function handleChange(event) {
        const { name, value } = event.target;
        setProfile(prevProfile => ({
            ...prevProfile,
            [name]: value
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            const updatedProfile = {
                username: profile.username,
                first_name: profile.first_name,
                last_name: profile.last_name,
                email: profile.email,
                dob: profile.dob,
                bio: profile.bio,
                state: parseInt(profile.state, 10)
            };

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/profiles/${profile.user_id}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${state.token}`
                },
                body: JSON.stringify(updatedProfile)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status} - ${errorData.detail}`);
            }

            setSuccess(true);
            alert("Perfil actualizado con éxito.");
            setTimeout(() => {
                navigate("/perfil"); // Redirige a la página de perfil después de una actualización exitosa
            }, 2000); // Espera 2 segundos para mostrar el mensaje de éxito
        } catch (error) {
            setError(error);
            alert("Error al actualizar el perfil. Inténtalo de nuevo.");
        }
    }

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="perfil-container">
            <h1>Actualizar Perfil</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Nombre de usuario:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={profile.username || ''}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="first_name">Nombre:</label>
                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={profile.first_name || ''}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="last_name">Apellido:</label>
                    <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={profile.last_name || ''}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Correo electrónico:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={profile.email || ''}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="dob">Fecha de nacimiento:</label>
                    <input
                        type="date"
                        id="dob"
                        name="dob"
                        value={profile.dob || ''}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="bio">Biografía:</label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={profile.bio || ''}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="state">Estado:</label>
                    <select
                        id="state"
                        name="state"
                        value={profile.state || ''}
                        onChange={handleChange}
                    >
                        <option value="">Selecciona un estado</option>
                        {states.map(state => (
                            <option key={state.id} value={state.id}>
                                {state.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">
                    Actualizar
                </button>
            </form>
        </div>
    );
}

export default Perfil;


