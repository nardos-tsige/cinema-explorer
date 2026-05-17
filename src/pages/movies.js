import { movieService } from '../api/movieService.js';
import { HeroCarousel } from '../components/Hero.js';
import { Card } from '../components/Card.js';
import { Sidebar } from '../components/Sidebar.js';
import { Pagination } from '../components/Pagination.js';

let currentGenreId = null;
let currentPage = 1;
let totalPages = 1;
let currentGenres = [];

export async function renderMoviesPage() {
    try {
        const [nowPlaying, genres, genreMovies] = await Promise.all([
            movieService.getNowPlaying(),
            movieService.getGenres(),
            currentGenreId ? movieService.getMoviesByGenre(currentGenreId, currentPage) : movieService.getPopular(currentPage)
        ]);
        
        const heroItems = nowPlaying.results?.slice(0, 5) || [];
        currentGenres = genres.genres || [];
        const movies = genreMovies.results || [];
        totalPages = Math.min(genreMovies.total_pages || 1, 500);
        
        const hero = new HeroCarousel(heroItems, 'movie');
        const sidebar = new Sidebar(currentGenres, 'movie', handleGenreSelect);
        const pagination = new Pagination(currentPage, totalPages, handlePageChange);
        
        return `
            ${hero.render()}
            <div class="page-layout">
                ${sidebar.render()}
                <div class="content-area">
                    <div id="moviesGrid">${renderMoviesGrid(movies)}</div>
                    <div id="pagination">${pagination.render()}</div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Movies page error:', error);
        return '<div class="error"><i class="fas fa-exclamation-triangle"></i> Failed to load movies page</div>';
    }
}

function renderMoviesGrid(movies) {
    if (!movies || !movies.length) {
        return '<p class="loading"><i class="fas fa-spinner fa-spin"></i> No movies found</p>';
    }
    
    const cardsHtml = movies.map(movie => {
        const card = new Card(movie, 'movie');
        return card.render();
    }).join('');
    
    return `<div class="cards-grid" id="moviesCardsGrid">${cardsHtml}</div>`;
}

async function handleGenreSelect(genreId) {
    currentGenreId = genreId;
    currentPage = 1;
    await refreshMoviesContent();
}

async function handlePageChange(page) {
    currentPage = page;
    await refreshMoviesContent();
}

async function refreshMoviesContent() {
    try {
        const response = currentGenreId 
            ? await movieService.getMoviesByGenre(currentGenreId, currentPage)
            : await movieService.getPopular(currentPage);
        
        const movies = response.results || [];
        totalPages = Math.min(response.total_pages || 1, 500);
        
        const moviesGrid = document.getElementById('moviesGrid');
        if (moviesGrid) {
            moviesGrid.innerHTML = renderMoviesGrid(movies);
        }
        
        const paginationContainer = document.getElementById('pagination');
        if (paginationContainer) {
            const pagination = new Pagination(currentPage, totalPages, handlePageChange);
            paginationContainer.innerHTML = pagination.render();
            pagination.attachEventListeners();
        }
        
        attachMovieCardListeners();
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        console.error('Refresh error:', error);
    }
}

function attachMovieCardListeners() {
    document.querySelectorAll('#moviesCardsGrid .card').forEach(card => {
        card.removeEventListener('click', handleMovieCardClick);
        card.addEventListener('click', handleMovieCardClick);
    });
}

function handleMovieCardClick(e) {
    const card = e.currentTarget;
    const id = card.dataset.id;
    if (id) {
        window.dispatchEvent(new CustomEvent('navigate', { 
            detail: { path: `/movie/${id}` } 
        }));
    }
}

export function attachMoviesEventListeners() {
    
    const hero = new HeroCarousel([], 'movie');
    hero.attachEventListeners();
    
    const sidebar = new Sidebar(currentGenres, 'movie', handleGenreSelect);
    sidebar.attachEventListeners();
    
    const pagination = new Pagination(currentPage, totalPages, handlePageChange);
    pagination.attachEventListeners();
    
    attachMovieCardListeners();
}