const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export async function apiClient(endpoint) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_KEY}`
        }
    };
    
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}