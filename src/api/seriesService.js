import { apiClient } from './apiClient.js';

export const seriesService = {
    getOnTheAir: (page = 1) => apiClient(`/tv/on_the_air?language=en-US&page=${page}`),
    
    getTrending: () => apiClient('/trending/tv/week'),
    
    getPopular: (page = 1) => apiClient(`/tv/popular?language=en-US&page=${page}`),
    
    getGenres: () => apiClient('/genre/tv/list?language=en'),
    
    getSeriesByGenre: (genreId, page = 1) => apiClient(`/discover/tv?with_genres=${genreId}&page=${page}&language=en-US`)
};