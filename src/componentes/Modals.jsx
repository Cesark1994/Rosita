import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import './EditPlaylistModal.css';

// Componente para crear una nueva canción


export function CreateSongModal({ onClose, onCreateSong, token }) {
    const [newSong, setNewSong] = useState({
        title: '',
        year: '',
        album: '',
        song_file: null
    });
    const [error, setError] = useState(null);

    const handleCreateSong = async () => {
        setError(null);

        // Validar que el título de la canción no esté vacío
        if (!newSong.title) {
            setError('El título de la canción es obligatorio.');
            return;
        }

        const formData = new FormData();
        formData.append('title', newSong.title);
        formData.append('year', newSong.year);
        if (newSong.album) {
            formData.append('album', newSong.album);
        }
        formData.append('song_file', newSong.song_file);

        try {
            const response = await fetch('https://sandbox.academiadevelopers.com/harmonyhub/songs/', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error al crear la canción');
            }

            const createdSong = await response.json();
            onCreateSong(createdSong);
            onClose();
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Crear Canción</h2>
                {error && <p className="error">{error}</p>}
                <input
                    type="text"
                    name="title"
                    value={newSong.title}
                    onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
                    placeholder="Título de la canción"
                    required
                />
                <input
                    type="number"
                    name="year"
                    value={newSong.year}
                    onChange={(e) => setNewSong({ ...newSong, year: e.target.value })}
                    placeholder="Año de lanzamiento"
                />
                <input
                    type="text"
                    name="album"
                    value={newSong.album}
                    onChange={(e) => setNewSong({ ...newSong, album: e.target.value })}
                    placeholder="ID del álbum (opcional)"
                />
                <input
                    type="file"
                    accept=".mp3"
                    onChange={(e) => setNewSong({ ...newSong, song_file: e.target.files[0] })}
                />
                <button onClick={handleCreateSong}>Crear Canción</button>
                <button onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
}

// Componente para crear un nuevo artista
export function CreateArtistModal({ onClose, onCreateArtist, token }) {
    const [newArtist, setNewArtist] = useState({
        name: '',
        bio: '',
        website: ''
    });
    const [error, setError] = useState(null);

    const handleCreateArtist = async () => {
        setError(null); // Limpiar errores anteriores

        if (newArtist.name.trim() === '') {
            setError('El nombre es obligatorio.');
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/harmonyhub/artists/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`
                },
                body: JSON.stringify(newArtist)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            onCreateArtist(data);
            setNewArtist({ name: '', bio: '', website: '' });
            alert("Artista creado exitosamente.");
            onClose();
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="modal" role="dialog" aria-labelledby="createArtistTitle" aria-describedby="createArtistDesc">
            <div className="modal-content">
                <h2 id="createArtistTitle">Crear Artista</h2>
                {error && <p className="error">{error}</p>}
                <input
                    type="text"
                    name="name"
                    value={newArtist.name}
                    onChange={(e) => setNewArtist({ ...newArtist, name: e.target.value })}
                    placeholder="Nombre del artista"
                    required
                />
                <textarea
                    name="bio"
                    value={newArtist.bio}
                    onChange={(e) => setNewArtist({ ...newArtist, bio: e.target.value })}
                    placeholder="Biografía"
                />
                <input
                    type="text"
                    name="website"
                    value={newArtist.website}
                    onChange={(e) => setNewArtist({ ...newArtist, website: e.target.value })}
                    placeholder="Página web"
                />
                <button onClick={handleCreateArtist}>Crear Artista</button>
                <button onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
}

// Componente para listar artistas
export function ArtistListModal({ onClose, artistList }) {
    return (
        <div className="modal" role="dialog" aria-labelledby="artistListTitle">
            <div className="modal-content">
                <h2 id="artistListTitle">Lista de Artistas</h2>
                {artistList.length === 0 ? (
                    <p>No hay artistas disponibles.</p>
                ) : (
                    <ul>
                        {artistList.map(artist => (
                            <li key={artist.id}>
                                <strong>{artist.name}</strong>
                                <p>{artist.bio}</p>
                                <a href={artist.website} target="_blank" rel="noopener noreferrer">{artist.website}</a>
                            </li>
                        ))}
                    </ul>
                )}
                <button onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
}

// Componente para actualizar una canción
export function UpdateSongModal({ onClose, song, onUpdateSong, token }) {
    const [updatedSong, setUpdatedSong] = useState(song);
    const [error, setError] = useState(null);

    const handleUpdateSong = async () => {
        setError(null); // Limpiar errores anteriores

        if (updatedSong.title.trim() === '') {
            setError('El título es obligatorio.');
            return;
        }

        if (!updatedSong.id) {
            setError('El ID de la canción no está definido.');
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/harmonyhub/songs/${updatedSong.id}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`
                },
                body: JSON.stringify(updatedSong)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            onUpdateSong(data);
            alert("Canción actualizada exitosamente.");
            onClose();
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="modal" role="dialog" aria-labelledby="updateSongTitle">
            <div className="modal-content">
                <h2 id="updateSongTitle">Actualizar Canción</h2>
                {error && <p className="error">{error}</p>}
                <input
                    type="text"
                    name="title"
                    value={updatedSong.title || ''}
                    onChange={(e) => setUpdatedSong({ ...updatedSong, title: e.target.value })}
                    placeholder="Título de la canción"
                    required
                />
                <input
                    type="number"
                    name="year"
                    value={updatedSong.year || ''}
                    onChange={(e) => setUpdatedSong({ ...updatedSong, year: e.target.value })}
                    placeholder="Año de lanzamiento"
                />
                <input
                    type="number"
                    name="album"
                    value={updatedSong.album || ''}
                    onChange={(e) => setUpdatedSong({ ...updatedSong, album: e.target.value })}
                    placeholder="ID del álbum"
                />
                <button onClick={handleUpdateSong}>Actualizar Canción</button>
                <button onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
}

// Componente para buscar canciones con filtros
export function FiltersModal({ filters, setFilters, onClose, onApplyFilters, songs = [], onPlaySong, onDeleteSong }) {
    const [filteredSongs, setFilteredSongs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (songs.length > 0) {
            handleFilterChange('title', searchQuery);
        }
    }, [searchQuery, songs]);

    const handleFilterChange = (key, value) => {
        setFilters(prevFilters => ({ ...prevFilters, [key]: value }));

        if (key === 'title') {
            const results = songs.filter(song => 
                song.title && song.title.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredSongs(results);
        }
    };

    const handleUpdate = () => {
        onApplyFilters();
    };

    return (
        <div className="modal" role="dialog" aria-labelledby="filtersTitle">
            <div className="modal-content">
                <h2 id="filtersTitle">Buscar Canción</h2>
                
                {/* Filtro por Título */}
                <div className="filter-item">
                    <label htmlFor="filter-title">Título</label>
                    <input
                        id="filter-title"
                        name="filter-title"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar por título"
                    />
                </div>

                {/* Filtro por Año de Lanzamiento */}
                <div className="filter-item">
                    <label htmlFor="filter-year">Año de Lanzamiento</label>
                    <input
                        id="filter-year"
                        name="filter-year"
                        type="number"
                        value={filters.year || ''}
                        onChange={(e) => handleFilterChange('year', e.target.value)}
                        placeholder="Filtrar por año"
                    />
                </div>

                {/* Filtro por Artista */}
                <div className="filter-item">
                    <label htmlFor="filter-artist">Artista</label>
                    <input
                        id="filter-artist"
                        name="filter-artist"
                        type="text"
                        value={filters.artist || ''}
                        onChange={(e) => handleFilterChange('artist', e.target.value)}
                        placeholder="Filtrar por artista"
                    />
                </div>

                {/* Filtro por Género */}
                <div className="filter-item">
                    <label htmlFor="filter-genre">Género</label>
                    <input
                        id="filter-genre"
                        name="filter-genre"
                        type="text"
                        value={filters.genre || ''}
                        onChange={(e) => handleFilterChange('genre', e.target.value)}
                        placeholder="Filtrar por género"
                    />
                </div>

                {/* Filtro por Álbum */}
                <div className="filter-item">
                    <label htmlFor="filter-album">Álbum</label>
                    <input
                        id="filter-album"
                        name="filter-album"
                        type="text"
                        value={filters.album || ''}
                        onChange={(e) => handleFilterChange('album', e.target.value)}
                        placeholder="Filtrar por álbum"
                    />
                </div>

                {/* Resultados de la búsqueda */}
                {filteredSongs.length > 0 && (
                    <div className="song-results">
                        <h3>Resultados de la búsqueda</h3>
                        <ul>
                            {filteredSongs.map(song => (
                                <li key={song.id}>
                                    <strong>{song.title}</strong> - {song.year}
                                    <button onClick={() => onPlaySong(song)}>Reproducir</button>
                                    <button onClick={() => onDeleteSong(song.id)}>Eliminar</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {filteredSongs.length === 0 && searchQuery && (
                    <p>No se encontraron canciones con el título "{searchQuery}".</p>
                )}

                <div className="modal-buttons">
                    <button onClick={handleUpdate} className="update-button">Actualizar</button>
                    <button onClick={onApplyFilters}>Aplicar Filtros</button>
                    <button onClick={onClose}>Cerrar</button>
                </div>
            </div>
        </div>
    );
}

// Componente para editar una lista de reproducción en un modal
export function EditPlaylistModal({ playlist, onClose, onSave }) {
    const [newTitle, setNewTitle] = useState(playlist.name);

    const handleSave = () => {
        onSave(playlist.id, newTitle);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Editar Lista de Reproducción</h3>
                <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Nuevo nombre"
                />
                <div className="modal-buttons">
                    <button onClick={handleSave} className="save-button">Guardar</button>
                    <button onClick={onClose} className="cancel-button">Cancelar</button>
                </div>
            </div>
        </div>
    );
}
