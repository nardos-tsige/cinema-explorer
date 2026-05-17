import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { renderHomePage, attachHomeEventListeners } from './pages/home.js';
import { renderMoviesPage, attachMoviesEventListeners } from './pages/movies.js';
import { renderSeriesPage, attachSeriesEventListeners } from './pages/series.js';
import { renderCelebritiesPage, attachCelebritiesEventListeners } from './pages/celebrities.js';
import { renderDetailsPage, attachDetailsEventListeners } from './pages/details.js';

class CinemaApp {
    constructor() {
        this.init();
    }
    
    async init() {
        await this.handleRoute();
        
        window.addEventListener('navigate', (e) => {
            this.navigateTo(e.detail.path);
        });
        
        window.addEventListener('popstate', () => {
            this.handleRoute();
        });
        
        const footer = new Footer();
        document.getElementById('footer').innerHTML = footer.render();
    }
    
    async navigateTo(path) {
        window.history.pushState({}, '', path);
        await this.handleRoute();
    }
    
    async handleRoute() {
        const path = window.location.pathname;
        const content = document.getElementById('content');
        const navbarContainer = document.getElementById('navbar');
        
        const navbar = new Navbar();
        navbarContainer.innerHTML = navbar.render();
        navbar.attachEventListeners();
        
        let pageContent = '';
        let attachFunction = null;
        
        console.log('Current path:', path);
        
        const movieMatch = path.match(/^\/movie\/(\d+)$/);
        const seriesMatch = path.match(/^\/series\/(\d+)$/);
        const personMatch = path.match(/^\/person\/(\d+)$/);
        
        if (movieMatch) {
            console.log('Loading movie details for ID:', movieMatch[1]);
            pageContent = await renderDetailsPage('movie', movieMatch[1]);
            attachFunction = attachDetailsEventListeners;
        }
        else if (seriesMatch) {
            console.log('Loading series details for ID:', seriesMatch[1]);
            pageContent = await renderDetailsPage('series', seriesMatch[1]);
            attachFunction = attachDetailsEventListeners;
        }
        else if (personMatch) {
            console.log('Loading person details for ID:', personMatch[1]);
            pageContent = await renderDetailsPage('person', personMatch[1]);
            attachFunction = attachDetailsEventListeners;
        }
        else if (path === '/' || path === '/home' || path === '') {
            console.log('Loading home page');
            pageContent = await renderHomePage();
            attachFunction = attachHomeEventListeners;
        }
        else if (path === '/movies') {
            console.log('Loading movies page');
            pageContent = await renderMoviesPage();
            attachFunction = attachMoviesEventListeners;
        }
        else if (path === '/series') {
            console.log('Loading series page');
            pageContent = await renderSeriesPage();
            attachFunction = attachSeriesEventListeners;
        }
        else if (path === '/celebrities') {
            console.log('Loading celebrities page');
            pageContent = await renderCelebritiesPage();
            attachFunction = attachCelebritiesEventListeners;
        }
        else {
            console.log('404 - Path not found:', path);
            pageContent = `
                <div class="error-page" style="text-align: center; margin-top: 100px;">
                    <i class="fas fa-film" style="font-size: 64px; color: #ff8c00;"></i>
                    <h1 style="font-size: 72px; margin: 20px 0;">404</h1>
                    <p style="font-size: 20px;">Page not found</p>
                    <a href="/" style="color: #ff8c00; text-decoration: none; margin-top: 20px; display: inline-block;">
                        <i class="fas fa-home"></i> Go back home
                    </a>
                </div>
            `;
            attachFunction = null;
        }
        
        content.innerHTML = pageContent;
        
        if (attachFunction) {
            setTimeout(() => {
                attachFunction();
                attachGlobalCardListeners();
            }, 100);
        } else {
            attachGlobalCardListeners();
        }
        
        window.scrollTo(0, 0);
    }
}

function attachGlobalCardListeners() {
    document.querySelectorAll('.card').forEach(card => {
        card.removeEventListener('click', handleGlobalCardClick);
        card.addEventListener('click', handleGlobalCardClick);
    });
}

function handleGlobalCardClick(e) {
    const card = e.currentTarget;
    const id = card.dataset.id;
    const type = card.dataset.type;
    
    console.log('Card clicked:', { id, type });
    
    if (id && type) {
        
        window.dispatchEvent(new CustomEvent('navigate', { 
            detail: { path: `/${type}/${id}` } 
        }));
    }
}

const app = new CinemaApp();