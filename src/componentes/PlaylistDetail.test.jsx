import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PlaylistDetail from './PlaylistDetail';

test('muestra mensaje cuando no hay canciones', () => {
    render(<PlaylistDetail songs={[]} />);
    expect(screen.getByText('No hay canciones disponibles.')).toBeInTheDocument();
});

test('muestra lista de canciones', () => {
    const songs = [{ id: 1, title: 'Canción 1' }, { id: 2, title: 'Canción 2' }];
    render(<PlaylistDetail songs={songs} />);
    expect(screen.getByText('Canción 1')).toBeInTheDocument();
    expect(screen.getByText('Canción 2')).toBeInTheDocument();
});

test('llama a handleAddSong cuando se hace clic en el botón Agregar', () => {
    const handleAddSong = jest.fn();
    const availableSongs = [{ id: 1, title: 'Canción 1' }];
    render(<PlaylistDetail availableSongs={availableSongs} handleAddSong={handleAddSong} />);
    fireEvent.click(screen.getByText('Agregar'));
    expect(handleAddSong).toHaveBeenCalledWith(1);
});

test('botones de paginación funcionan correctamente', () => {
    const handlePreviousPage = jest.fn();
    const handleNextPage = jest.fn();
    render(
        <PlaylistDetail
            availableSongs={[{ id: 1, title: 'Canción 1' }]}
            handlePreviousPage={handlePreviousPage}
            handleNextPage={handleNextPage}
            previousPage={true}
            nextPage={true}
        />
    );
    fireEvent.click(screen.getByText('Página Anterior'));
    expect(handlePreviousPage).toHaveBeenCalled();
    fireEvent.click(screen.getByText('Página Siguiente'));
    expect(handleNextPage).toHaveBeenCalled();
});