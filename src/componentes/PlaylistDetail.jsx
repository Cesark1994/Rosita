import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './PlaylistDetail.css';

export function PlaylistDetail({ playlistId, onClose }) {
    const { state } = useAuth();
    const [songs, setSongs] = useState([]);
    const [availableSongs, setAvailableSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);
    const [showSongs, setShowSongs] = useState(false); // Estado para manejar la visibilidad de la tarjeta de canciones

    useEffect(() => {
        fetchPlaylistSongs();
    }, [playlistId]);

    useEffect(() => {
        fetchAvailableSongs(currentPage, searchQuery);
    }, [searchQuery, currentPage]);

    useEffect(() => {
        console.log("Canciones de la lista actualizadas:", songs);
    }, [songs]);

    const fetchPlaylistSongs = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/playlist-entries/?playlist=${playlistId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Token ${state.token}`
                }
            });
    
            if (!response.ok) throw new Error(`Error de red: ${response.statusText}`);
    
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await response.text();
                console.error("Respuesta no es JSON:", text);
                throw new Error("Respuesta no es JSON");
            }
    
            const data = await response.json();
            console.log("Respuesta completa:", data); 
            console.log("Canciones de la lista:", data.results); 
            setSongs(data.results);
        } catch (error) {
            console.error("Error al cargar las canciones de la lista:", error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    async function fetchAvailableSongs(page = 1, search = '') {
        try {
            if (!page || isNaN(page)) page = 1;
            if (!search) search = '';

            const response = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/songs/?page=${page}&search=${search}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${state.token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al cargar las canciones disponibles');
            }

            const data = await response.json();
            setAvailableSongs(data.results);
            setNextPage(data.next ? page + 1 : null);
            setPreviousPage(data.previous ? page - 1 : null);
        } catch (error) {
            console.error('Error al cargar las canciones disponibles:', error);
            alert(`Error al cargar las canciones disponibles: ${error.message}`);
        }
    }

    async function handleAddSong(songId, order = 1) {
        if (!songId || !playlistId) {
            alert('ID de canción o ID de lista de reproducción no válido');
            return;
        }
    
        try {
            const requestBody = JSON.stringify({
                song: songId,
                playlist: playlistId,
                order: order
            });
            console.log("Enviando datos:", requestBody);
    
            const response = await fetch('https://sandbox.academiadevelopers.com/harmonyhub/playlist-entries/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${state.token}` 
                },
                body: requestBody
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.non_field_errors && errorData.non_field_errors.includes("Los campos playlist, song, order deben formar un conjunto único.")) {
                    alert('La canción ya existe en la lista de reproducción con el mismo orden.');
                } else {
                    console.error('Error al agregar la canción:', errorData);
                    alert(`Error al agregar la canción: ${JSON.stringify(errorData)}`);
                }
                return;
            }
    
            const newSong = await response.json();
            console.log('Canción agregada exitosamente:', newSong);
            setSongs(prev => [...prev, newSong]);
            fetchPlaylistSongs(); // Llamar para actualizar la lista de canciones
        } catch (error) {
            console.error('Error al agregar la canción:', error);
            alert(`Error al agregar la canción: ${error.message}`);
        }
    }

    const handleDeleteSong = async (entryId) => {
        try {
            const response = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/playlist-entries/${entryId}/`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Token ${state.token}`
                }
            });

            if (!response.ok) throw new Error(`Error de red: ${response.statusText}`);

            setSongs(prev => prev.filter(song => song.id !== entryId));
        } catch (error) {
            console.error("Error al eliminar la canción de la lista:", error);
            setError(error);
        }
    };

    const handlePlaySong = (songUrl) => {
        const audio = new Audio(songUrl);
        audio.play();
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleNextPage = () => {
        if (nextPage) {
            setCurrentPage(nextPage);
        }
    };

    const handlePreviousPage = () => {
        if (previousPage) {
            setCurrentPage(previousPage);
        }
    };

    const filteredSongs = songs.filter(song => 
        song.title && song.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="playlist-detail">
            <button onClick={onClose} className="close-button">Cerrar</button>
            {loading ? (
                <p>Cargando canciones...</p>
            ) : error ? (
                <p className="error-message">Error: {error.message}</p>
            ) : (
                <>
                    <button onClick={() => setShowSongs(!showSongs)} className="toggle-button">
                        {showSongs ? 'Ocultar' : 'Mostrar'} Canciones en la lista de reproducción
                    </button>
                    {showSongs && (
                        <div className="song-card">
                            <h2>Canciones en la lista de reproducción</h2>
                            <ul className="song-list">
                                {filteredSongs.length > 0 ? (
                                    filteredSongs.map(song => (
                                        <li key={song.id} className="song-item">
                                            <span>{song.title}</span>
                                            <button onClick={() => handlePlaySong(song.song_file)} className="play-button">Reproducir</button>
                                            <button onClick={() => handleDeleteSong(song.id)} className="delete-button">Eliminar</button>
                                        </li>
                                    ))
                                ) : (
                                    <li>No se encontraron canciones con el término de búsqueda "{searchQuery}".</li>
                                )}
                            </ul>
                        </div>
                    )}
                    <h2>Agregar canciones a la lista de reproducción</h2>
                    <ul className="available-song-list">
                        {availableSongs.map(song => (
                            <li key={song.id} className="available-song-item">
                                <span>{song.title || 'Sin título'}</span>
                                <button onClick={() => handleAddSong(song.id)} className="add-button">Agregar</button>
                            </li>
                        ))}
                    </ul>
                    <div className="pagination">
                        <button onClick={handlePreviousPage} disabled={!previousPage} className="page-button">Página Anterior</button>
                        <button onClick={handleNextPage} disabled={!nextPage} className="page-button">Página Siguiente</button>
                    </div>
                </>
            )}
        </div>
    );
}