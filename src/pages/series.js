import { seriesService } from '../api/seriesService.js';
import { HeroCarousel } from '../components/Hero.js';
import { Card } from '../components/Card.js';
import { Sidebar } from '../components/Sidebar.js';
import { Pagination } from '../components/Pagination.js';

let currentGenreId = null;
let currentPage = 1;
let totalPages = 1;
let currentGenres = [];

export async function renderSeriesPage() {
    try {
        const [onTheAir, genres, genreSeries] = await Promise.all([
            seriesService.getOnTheAir(),
            seriesService.getGenres(),
            currentGenreId ? seriesService.getSeriesByGenre(currentGenreId, currentPage) : seriesService.getPopular(currentPage)
        ]);
        
        const heroItems = onTheAir.results?.slice(0, 5) || [];
        currentGenres = genres.genres || [];
        const series = genreSeries.results || [];
        totalPages = Math.min(genreSeries.total_pages || 1, 500);
        
        const hero = new HeroCarousel(heroItems, 'series');
        const sidebar = new Sidebar(currentGenres, 'series', handleGenreSelect);
        const pagination = new Pagination(currentPage, totalPages, handlePageChange);
        
        return `
            ${hero.render()}
            <div class="page-layout">
                ${sidebar.render()}
                <div class="content-area">
                    <div id="seriesGrid">${renderSeriesGrid(series)}</div>
                    <div id="pagination">${pagination.render()}</div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Series page error:', error);
        return '<div class="error"><i class="fas fa-exclamation-triangle"></i> Failed to load series page</div>';
    }
}

function renderSeriesGrid(series) {
    if (!series || !series.length) {
        return '<p class="loading"><i class="fas fa-spinner fa-spin"></i> No series found</p>';
    }
    
    const cardsHtml = series.map(show => {
        const card = new Card(show, 'series');
        return card.render();
    }).join('');
    
    return `<div class="cards-grid" id="seriesCardsGrid">${cardsHtml}</div>`;
}

async function handleGenreSelect(genreId) {
    currentGenreId = genreId;
    currentPage = 1;
    await refreshSeriesContent();
}

async function handlePageChange(page) {
    currentPage = page;
    await refreshSeriesContent();
}

async function refreshSeriesContent() {
    try {
        const response = currentGenreId 
            ? await seriesService.getSeriesByGenre(currentGenreId, currentPage)
            : await seriesService.getPopular(currentPage);
        
        const series = response.results || [];
        totalPages = Math.min(response.total_pages || 1, 500);
        
        const seriesGrid = document.getElementById('seriesGrid');
        if (seriesGrid) {
            seriesGrid.innerHTML = renderSeriesGrid(series);
        }
        
        const paginationContainer = document.getElementById('pagination');
        if (paginationContainer) {
            const pagination = new Pagination(currentPage, totalPages, handlePageChange);
            paginationContainer.innerHTML = pagination.render();
            pagination.attachEventListeners();
        }
        
        attachSeriesCardListeners();
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        console.error('Refresh error:', error);
    }
}

function attachSeriesCardListeners() {
    document.querySelectorAll('#seriesCardsGrid .card').forEach(card => {
        card.removeEventListener('click', handleSeriesCardClick);
        card.addEventListener('click', handleSeriesCardClick);
    });
}

function handleSeriesCardClick(e) {
    const card = e.currentTarget;
    const id = card.dataset.id;
    if (id) {
        window.dispatchEvent(new CustomEvent('navigate', { 
            detail: { path: `/series/${id}` } 
        }));
    }
}

export function attachSeriesEventListeners() {
    const hero = new HeroCarousel([], 'series');
    hero.attachEventListeners();
    
    const sidebar = new Sidebar(currentGenres, 'series', handleGenreSelect);
    sidebar.attachEventListeners();
    
    const pagination = new Pagination(currentPage, totalPages, handlePageChange);
    pagination.attachEventListeners();
    
    attachSeriesCardListeners();
}