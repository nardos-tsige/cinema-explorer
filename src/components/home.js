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
            ${renderSection('🔥 Trending Movies', movies, 'movie')}
            ${renderSection('📺 Trending Series', series, 'series')}
            ${renderSection('⭐ Trending Celebrities', people, 'person')}
        `;
    } catch (error) {
        console.error('Home page error:', error);
        return '<div class="error">Failed to load content. Please check your API key.</div>';
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
            <div class="cards-grid">${cardsHtml}</div>
        </section>
    `;
}

export function attachHomeEventListeners() {
    const hero = new HeroCarousel([], 'movie');
    hero.attachEventListeners();
}