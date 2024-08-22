import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Playlists.css';
import { EditPlaylistModal } from './Modals';
import { PlaylistDetail } from './PlaylistDetail'; // Importar el nuevo componente

export function Playlists() {
    const { state } = useAuth();
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [editingPlaylist, setEditingPlaylist] = useState(null);
    const [searching, setSearching] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null); // Nuevo estado

    useEffect(() => {
        fetchPlaylists();
    }, [searchQuery, currentPage]);

    const fetchPlaylists = async () => {
        setLoading(true);
        setSearching(true);
        setNoResults(false);
        try {
            let url = `https://sandbox.academiadevelopers.com/harmonyhub/playlists/?title=${encodeURIComponent(searchQuery)}&page=${currentPage}`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Token ${state.token}`
                }
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            setPlaylists(data.results);
            setTotalPages(Math.ceil(data.count / 10));
            setLoading(false);
            setSearching(false);

            if (data.results.length === 0) {
                setNoResults(true);
            }
        } catch (error) {
            setError(error);
            setLoading(false);
            setSearching(false);
        }
    };

    const handleCreatePlaylist = async (title) => {
        const trimmedTitle = title?.trim();
        if (!trimmedTitle) {
            alert("El título no puede estar vacío");
            return;
        }
        try {
            const response = await fetch('https://sandbox.academiadevelopers.com/harmonyhub/playlists/', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${state.token}`
                },
                body: JSON.stringify({ name: trimmedTitle })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            const newPlaylist = await response.json();
            setPlaylists(prev => [newPlaylist, ...prev]);
            alert("Lista de reproducción creada con éxito");
        } catch (error) {
            setError(error);
            alert("Error al crear la lista de reproducción: " + error.message);
        }
    };

    const handleEditPlaylist = async (id, newTitle) => {
        const trimmedTitle = newTitle?.trim();
        if (!trimmedTitle) {
            alert("El título no puede estar vacío");
            return;
        }
        try {
            const response = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/playlists/${id}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${state.token}`
                },
                body: JSON.stringify({ name: trimmedTitle })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            const updatedPlaylist = await response.json();
            setPlaylists(prev => prev.map(playlist => playlist.id === id ? updatedPlaylist : playlist));
            setEditingPlaylist(null);
            alert("Lista de reproducción actualizada con éxito");
        } catch (error) {
            setError(error);
            alert("Error al actualizar la lista de reproducción: " + error.message);
        }
    };

    const handleDeletePlaylist = async (id) => {
        try {
            const response = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/playlists/${id}/`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Token ${state.token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            setPlaylists(prev => prev.filter(playlist => playlist.id !== id));
            alert("Lista de reproducción eliminada con éxito");
        } catch (error) {
            setError(error);
            alert("Error al eliminar la lista de reproducción: " + error.message);
        }
    };

    return (
        <div className="playlist-section">
            {selectedPlaylist ? (
                <PlaylistDetail playlistId={selectedPlaylist.id} onClose={() => setSelectedPlaylist(null)} />
            ) : (
                <>
                    <div className="playlist-header">
                        <button onClick={() => {
                            const title = prompt('Nombre de la nueva lista de reproducción');
                            if (title) handleCreatePlaylist(title);
                        }} className="create-button">
                            Crear Nueva Lista
                        </button>
                        <input
                            type="text"
                            className="playlist-search"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder="Buscar listas de reproducción..."
                        />
                    </div>
                    {searching && <p>Buscando listas de reproducción...</p>}
                    {loading ? (
                        <p>Cargando listas...</p>
                    ) : error ? (
                        <p>Error: {error.message}</p>
                    ) : noResults ? (
                        <p>No se encontraron listas de reproducción para "{searchQuery}".</p>
                    ) : (
                        <>
                            <p>Se encontraron {playlists.length} listas de reproducción.</p>
                            <div className="playlist-list">
                                {playlists.map(playlist => (
                                    <div className="playlist-item" key={playlist.id} onClick={() => setSelectedPlaylist(playlist)}>
                                        <span className="playlist-title">{playlist.name}</span>
                                        <div className="playlist-actions">
                                            <button className="edit-button" onClick={(e) => { e.stopPropagation(); setEditingPlaylist(playlist); }}>Editar</button>
                                            <button className="delete-button" onClick={(e) => { e.stopPropagation(); handleDeletePlaylist(playlist.id); }}>Eliminar</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                    <div className="pagination-buttons">
                        <button 
                            className="prev-button" 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                            disabled={currentPage === 1}>
                            Página Anterior
                        </button>
                        <button 
                            className="next-button" 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                            disabled={currentPage === totalPages}>
                            Página Siguiente
                        </button>
                    </div>

                    {editingPlaylist && (
                        <EditPlaylistModal
                            playlist={editingPlaylist}
                            onClose={() => setEditingPlaylist(null)}
                            onSave={handleEditPlaylist}
                        />
                    )}
                </>
            )}
        </div>
    );
}