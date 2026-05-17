import { apiClient } from './apiClient.js';

export const detailsService = {
    getMovieDetails: (id) => apiClient(`/movie/${id}?language=en-US`),
    getSeriesDetails: (id) => apiClient(`/tv/${id}?language=en-US`),
    getPersonDetails: (id) => apiClient(`/person/${id}?language=en-US`),
    getMovieCredits: (id) => apiClient(`/movie/${id}/credits`),
    getSeriesCredits: (id) => apiClient(`/tv/${id}/credits`),
    getPersonMovieCredits: (id) => apiClient(`/person/${id}/movie_credits`)
};