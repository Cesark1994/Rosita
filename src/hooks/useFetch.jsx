import { useCallback, useState } from 'react';

// Definimos un hook personalizado llamado useFetch que acepta una URL y opciones de configuración para la solicitud
export default function useFetch(url, options) {
    // Declaramos tres estados: data, isLoading e isError
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    // Definimos una función de callback llamada doFetch que realiza la solicitud fetch
    const doFetch = useCallback(async () => {
        // Establecemos isLoading a true e isError a false antes de realizar la solicitud
        setIsLoading(true);
        setIsError(false);
        try {
            // Realizamos la solicitud fetch con la URL y las opciones proporcionadas
            const response = await fetch(url, options);
            // Si la respuesta no es correcta, lanzamos un error
            if (!response.ok) throw new Error('Network response was not ok');
            // Convertimos la respuesta a JSON y actualizamos el estado data
            const result = await response.json();
            setData(result);
        } catch (error) {
            // Si ocurre un error, establecemos isError a true
            setIsError(true);
        } finally {
            // Finalmente, establecemos isLoading a false
            setIsLoading(false);
        }
    }, [url, options]); // La función doFetch depende de url y options

    // Retornamos un array con el estado actual y la función doFetch
    return [{ data, isLoading, isError }, doFetch];
}