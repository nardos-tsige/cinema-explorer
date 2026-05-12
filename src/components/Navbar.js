export class Navbar {
    constructor() {
        this.currentPage = window.location.pathname.split('/').pop() || '';
    }
    
    render() {
        return `
            <nav class="navbar">
                <div class="nav-container">
                    <a href="/" class="logo" data-link>🎬 Cinema Explorer</a>
                    <ul class="nav-links">
                        <li><a href="/" data-link class="${this.currentPage === '' || this.currentPage === '/' ? 'active' : ''}">Home</a></li>
                        <li><a href="/movies" data-link class="${this.currentPage === 'movies' ? 'active' : ''}">Movies</a></li>
                        <li><a href="/series" data-link class="${this.currentPage === 'series' ? 'active' : ''}">Series</a></li>
                        <li><a href="/celebrities" data-link class="${this.currentPage === 'celebrities' ? 'active' : ''}">Celebrities</a></li>
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