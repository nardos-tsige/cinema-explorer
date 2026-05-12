import { apiClient } from './apiClient.js';

export const movieService = {
    getNowPlaying: (page = 1) => apiClient(`/movie/now_playing?language=en-US&page=${page}`),
    
    getTrending: () => apiClient('/trending/movie/week'),
    
    getPopular: (page = 1) => apiClient(`/movie/popular?language=en-US&page=${page}`),
    
    getGenres: () => apiClient('/genre/movie/list?language=en'),
    
    getMoviesByGenre: (genreId, page = 1) => apiClient(`/discover/movie?with_genres=${genreId}&page=${page}&language=en-US`)
};