import React from 'react';

export default function SongList({ songs, currentPage, totalPages, onPageChange, onDeleteSong, onSelectSong, onPlaySong }) {
    const goToFirstPage = () => onPageChange(1);
    const goToLastPage = () => onPageChange(totalPages);
    const handlePageChange = (direction) => {
        if (direction === 'next' && currentPage < totalPages) onPageChange(currentPage + 1);
        else if (direction === 'prev' && currentPage > 1) onPageChange(currentPage - 1);
    };

    return (
        <div className="song-list">
            <h2>Lista de Canciones</h2>
            {songs.length === 0 ? (
                <p>No hay canciones disponibles.</p>
            ) : (
                <ul>
                    {songs.map(song => (
                        <li key={song.id}>
                            <strong>{song.title}</strong> - {song.year}
                            <button onClick={() => onPlaySong(song)}>Reproducir</button>
                            <button onClick={() => { onSelectSong(song); }}>Editar</button>
                            <button onClick={() => onDeleteSong(song.id)}>Eliminar</button>
                        </li>
                    ))}
                </ul>
            )}
            <div className="pagination-controls">
                <button onClick={goToFirstPage} disabled={currentPage === 1}>
                    Pag 1
                </button>
                <button onClick={() => handlePageChange('prev')} disabled={currentPage === 1}>
                    Anterior
                </button>
                <span>Página {currentPage} de {totalPages}</span>
                <button onClick={() => handlePageChange('next')} disabled={currentPage === totalPages}>
                    Siguiente
                </button>
                <button onClick={goToLastPage} disabled={currentPage === totalPages}>
                    Última Pag
                </button>
            </div>
        </div>
    );
}
