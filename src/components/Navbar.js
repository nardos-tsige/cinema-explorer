export class Navbar {
    constructor() {
        const path = window.location.pathname;
        if (path === '/' || path === '/home' || path === '') this.currentPage = 'home';
        else if (path === '/movies') this.currentPage = 'movies';
        else if (path === '/series') this.currentPage = 'series';
        else if (path === '/celebrities') this.currentPage = 'celebrities';
        else this.currentPage = 'home';
    }
    
    render() {
        return `
            <nav class="navbar">
                <div class="nav-container">
                    <a href="/" class="logo" data-link>
                        <i class="fas fa-film"></i> Cinema Explorer
                    </a>
                    <ul class="nav-links">
                        <li><a href="/" data-link class="${this.currentPage === 'home' ? 'active' : ''}">
                            <i class="fas fa-home"></i> Home
                        </a></li>
                        <li><a href="/movies" data-link class="${this.currentPage === 'movies' ? 'active' : ''}">
                            <i class="fas fa-video"></i> Movies
                        </a></li>
                        <li><a href="/series" data-link class="${this.currentPage === 'series' ? 'active' : ''}">
                            <i class="fas fa-tv"></i> Series
                        </a></li>
                        <li><a href="/celebrities" data-link class="${this.currentPage === 'celebrities' ? 'active' : ''}">
                            <i class="fas fa-star"></i> Celebrities
                        </a></li>
                    </ul>
                </div>
            </nav>
        `;
    }
    
    attachEventListeners() {
        document.querySelectorAll('[data-link]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                window.dispatchEvent(new CustomEvent('navigate', { detail: { path: href } }));
            });
        });
    }
}