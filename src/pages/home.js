import { movieService } from '../api/movieService.js';
import { seriesService } from '../api/seriesService.js';
import { peopleService } from '../api/peopleService.js';
import { HeroCarousel } from '../components/Hero.js';
import { Card } from '../components/Card.js';

export async function renderHomePage() {
    try {
        const [nowPlaying, trendingMovies, trendingSeries, trendingPeople] = await Promise.all([
            movieService.getNowPlaying(),
            movieService.getTrending(),
            seriesService.getTrending(),
            peopleService.getTrending()
        ]);
        
        const heroItems = nowPlaying.results?.slice(0, 5) || [];
        const movies = trendingMovies.results?.slice(0, 10) || [];
        const series = trendingSeries.results?.slice(0, 10) || [];
        const people = trendingPeople.results?.slice(0, 10) || [];
        
        const hero = new HeroCarousel(heroItems, 'movie');
        
        return `
            ${hero.render()}
            ${renderSection('<i class="fas fa-fire"></i> Trending Movies', movies, 'movie')}
            ${renderSection('<i class="fas fa-tv"></i> Trending Series', series, 'series')}
            ${renderSection('<i class="fas fa-star"></i> Trending Celebrities', people, 'person')}
        `;
    } catch (error) {
        console.error('Home page error:', error);
        return '<div class="error"><i class="fas fa-exclamation-triangle"></i> Failed to load content. Please check your API key.</div>';
    }
}

function renderSection(title, items, type) {
    if (!items || !items.length) return '';
    
    const cardsHtml = items.map(item => {
        const card = new Card(item, type);
        return card.render();
    }).join('');
    
    return `
        <section class="section">
            <div class="section-header">
                <h2 class="section-title">${title}</h2>
            </div>
            <div class="cards-grid" data-section="${type}">${cardsHtml}</div>
        </section>
    `;
}

export function attachHomeEventListeners() {
    
    attachCardClickListeners();
    
    const hero = new HeroCarousel([], 'movie');
    hero.attachEventListeners();
}

function attachCardClickListeners() {
    document.querySelectorAll('.card').forEach(card => {
        
        card.removeEventListener('click', handleCardClick);
        card.addEventListener('click', handleCardClick);
    });
}

function handleCardClick(e) {
    
    const card = e.currentTarget;
    const id = card.dataset.id;
    const type = card.dataset.type;
    
    if (id && type) {
        console.log(`Navigating to /${type}/${id}`);
        window.dispatchEvent(new CustomEvent('navigate', { 
            detail: { path: `/${type}/${id}` } 
        }));
    }
}