import { apiClient } from './apiClient.js';

export const peopleService = {
    getTrending: () => apiClient('/trending/person/week'),
    
    getPopular: (page = 1) => apiClient(`/person/popular?language=en-US&page=${page}`)
};