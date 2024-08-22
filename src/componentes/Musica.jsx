import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { useAuth } from '../contexts/AuthContext';
import SongList from './SongList';
import {
    CreateSongModal,
    CreateArtistModal,
    ArtistListModal,
    UpdateSongModal,
    FiltersModal
} from './Modals'; // Importa los modales agrupados
import { useNavigate } from 'react-router-dom';
import './Musica.css';

export function Musica() {
    const [songs, setSongs] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [playing, setPlaying] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const playerRef = useRef(null);
    const { state } = useAuth();
    const [showCreateSongModal, setShowCreateSongModal] = useState(false);
    const [showCreateArtistModal, setShowCreateArtistModal] = useState(false);
    const [showArtistListModal, setShowArtistListModal] = useState(false);
    const [showUpdateSongModal, setShowUpdateSongModal] = useState(false);
    const [selectedSong, setSelectedSong] = useState(null);
    const [filters, setFilters] = useState({
        title: '',
        album: '',
        artists: '',
        genres: '',
        year: '',
        duration: '',
        view_count: '',
        created_at_min: '',
        created_at_max: '',
        updated_at_min: '',
        updated_at_max: '',
        owner: '',
        ordering: '',
        page: 1,
        page_size: 10
    });
    const [showFiltersModal, setShowFiltersModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSongs(currentPage, searchQuery);
    }, [currentPage, searchQuery, filters]);

    const fetchSongs = async (page, query = '') => {
        setLoading(true);
        try {
            let url = `${import.meta.env.VITE_API_BASE_URL}/harmonyhub/songs/?page=${page}&page_size=10`;

            if (query) url += `&title=${encodeURIComponent(query)}`;
            Object.entries(filters).forEach(([key, value]) => {
                if (value) url += `&${key}=${encodeURIComponent(value)}`;
            });

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Token ${state.token}`
                }
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            setSongs(data.results);
            setTotalPages(Math.ceil(data.count / 10));
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
            alert("Error al cargar las canciones. Inténtalo de nuevo.");
        }
    };

    const handleCreateSong = (newSong) => setSongs(prev => [newSong, ...prev]);
    const handleCreateArtist = (newArtist) => setArtistList(prev => [newArtist, ...prev]);
    const handleUpdateSong = (updatedSong) => setSongs(prev => prev.map(song => song.id === updatedSong.id ? updatedSong : song));

    const handleDeleteSong = async (id) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/harmonyhub/songs/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${state.token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error al eliminar la canción, status: ${response.status}`);
            }

            setSongs(prevSongs => prevSongs.filter(song => song.id !== id));
            alert('Canción eliminada exitosamente.');
        } catch (error) {
            console.error('Error al eliminar la canción:', error);
            alert('Hubo un problema al eliminar la canción. Inténtalo de nuevo.');
        }
    };

    const handleNavigateToPlaylists = () => {
        navigate('/playlists');
    };

    return (
        <section className="music-section">
            <div className="search-bar">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    placeholder="Buscar canciones..."
                    autoComplete="off"
                />
            </div>
            <div className="advanced-filters">
                <button onClick={() => setShowFiltersModal(true)} className={`filter-button ${Object.values(filters).some(v => v !== '') ? 'active' : ''}`}>
                    Filtros avanzados {Object.values(filters).some(v => v !== '') ? '(activos)' : ''}
                </button>
            </div>
            {loading ? <p>Cargando canciones...</p> : error ? <p>Error: {error.message}</p> : null}
            <SongList
                songs={songs}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                onDeleteSong={handleDeleteSong}
                onSelectSong={setSelectedSong}
                onPlaySong={setCurrentSong}
            />
            {currentSong && (
                <div className="player-container">
                    <ReactPlayer
                        ref={playerRef}
                        url={currentSong.song_file}
                        playing={playing}
                        controls
                        width="100%"
                        height="50px"
                    />
                    <button onClick={() => setPlaying(!playing)}>
                        {playing ? "Pausar" : "Reproducir"}
                    </button>
                </div>
            )}
            <div className="creation-buttons">
                <button onClick={() => setShowCreateSongModal(true)} className="small-button">Crear Canción</button>
                <button onClick={() => setShowCreateArtistModal(true)} className="small-button">Crear Artista</button>
                <button onClick={() => setShowArtistListModal(true)} className="small-button">Mostrar Artistas</button>
                <button onClick={handleNavigateToPlaylists} className="small-button">Lista de Reproducción</button>
            </div>
            {showCreateSongModal && <CreateSongModal onClose={() => setShowCreateSongModal(false)} onCreateSong={handleCreateSong} token={state.token} />}
            {showCreateArtistModal && <CreateArtistModal onClose={() => setShowCreateArtistModal(false)} onCreateArtist={handleCreateArtist} token={state.token} />}
            {showArtistListModal && <ArtistListModal onClose={() => setShowArtistListModal(false)} />}
            {showUpdateSongModal && selectedSong && (
                <UpdateSongModal
                    song={selectedSong}
                    onClose={() => setShowUpdateSongModal(false)}
                    onUpdateSong={handleUpdateSong}
                    token={state.token}
                />
            )}
            {showFiltersModal && (
                <FiltersModal
                    filters={filters}
                    setFilters={setFilters}
                    onClose={() => setShowFiltersModal(false)}
                    onApplyFilters={() => { fetchSongs(1); setShowFiltersModal(false); }}
                />
            )}
        </section>
    );
}
