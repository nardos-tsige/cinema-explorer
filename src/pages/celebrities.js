import { peopleService } from '../api/peopleService.js';
import { HeroCarousel } from '../components/Hero.js';
import { Card } from '../components/Card.js';
import { Pagination } from '../components/Pagination.js';

let currentPage = 1;
let totalPages = 1;

export async function renderCelebritiesPage() {
    try {
        const [trending, popular] = await Promise.all([
            peopleService.getTrending(),
            peopleService.getPopular(currentPage)
        ]);
        
        const heroItems = trending.results?.slice(0, 5) || [];
        const celebrities = popular.results || [];
        totalPages = Math.min(popular.total_pages || 1, 500);
        
        const hero = new HeroCarousel(heroItems, 'person');
        const pagination = new Pagination(currentPage, totalPages, handlePageChange);
        
        return `
            ${hero.render()}
            <section class="section">
                <div class="section-header">
                    <h2 class="section-title">🎭 All Celebrities</h2>
                </div>
                <div id="celebritiesGrid">${renderCelebritiesGrid(celebrities)}</div>
                <div id="pagination">${pagination.render()}</div>
            </section>
        `;
    } catch (error) {
        console.error('Celebrities page error:', error);
        return '<div class="error">Failed to load celebrities page</div>';
    }
}

function renderCelebritiesGrid(celebrities) {
    if (!celebrities || !celebrities.length) {
        return '<p class="loading">No celebrities found</p>';
    }
    
    const cardsHtml = celebrities.map(celebrity => {
        const card = new Card(celebrity, 'person');
        return card.render();
    }).join('');
    
    return `<div class="cards-grid">${cardsHtml}</div>`;
}

async function handlePageChange(page) {
    currentPage = page;
    await refreshCelebritiesContent();
}

async function refreshCelebritiesContent() {
    try {
        const response = await peopleService.getPopular(currentPage);
        const celebrities = response.results || [];
        totalPages = Math.min(response.total_pages || 1, 500);
        
        const celebritiesGrid = document.getElementById('celebritiesGrid');
        if (celebritiesGrid) {
            celebritiesGrid.innerHTML = renderCelebritiesGrid(celebrities);
        }
        
        const paginationContainer = document.getElementById('pagination');
        if (paginationContainer) {
            const pagination = new Pagination(currentPage, totalPages, handlePageChange);
            paginationContainer.innerHTML = pagination.render();
            pagination.attachEventListeners();
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        console.error('Refresh error:', error);
    }
}

export function attachCelebritiesEventListeners() {
    const hero = new HeroCarousel([], 'person');
    hero.attachEventListeners();
    
    const pagination = new Pagination(currentPage, totalPages, handlePageChange);
    pagination.attachEventListeners();
}