import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { renderHomePage, attachHomeEventListeners } from './pages/home.js';
import { renderMoviesPage, attachMoviesEventListeners } from './pages/movies.js';
import { renderSeriesPage, attachSeriesEventListeners } from './pages/series.js';
import { renderCelebritiesPage, attachCelebritiesEventListeners } from './pages/celebrities.js';

class CinemaApp {
    constructor() {
        this.init();
    }
    
    async init() {
        await this.handleRoute();
        
        window.addEventListener('navigate', (e) => this.navigateTo(e.detail.path));
        window.addEventListener('popstate', () => this.handleRoute());
        
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
        
        if (path === '/' || path === '/home' || path === '') {
            pageContent = await renderHomePage();
            attachFunction = attachHomeEventListeners;
        } else if (path === '/movies') {
            pageContent = await renderMoviesPage();
            attachFunction = attachMoviesEventListeners;
        } else if (path === '/series') {
            pageContent = await renderSeriesPage();
            attachFunction = attachSeriesEventListeners;
        } else if (path === '/celebrities') {
            pageContent = await renderCelebritiesPage();
            attachFunction = attachCelebritiesEventListeners;
        } else {
            pageContent = '<div class="error" style="text-align:center; margin-top:100px;"><h1>404</h1><p>Page not found</p></div>';
        }
        
        content.innerHTML = pageContent;
        
        if (attachFunction) {
            setTimeout(() => attachFunction(), 100);
        }
        
        window.scrollTo(0, 0);
    }
}

new CinemaApp();