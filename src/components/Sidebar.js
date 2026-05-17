export class Sidebar {
    constructor(genres, type, onGenreSelect) {
        this.genres = genres || [];
        this.type = type;
        this.onGenreSelect = onGenreSelect;
        this.selectedGenreId = null;
    }
    
    render() {
        if (!this.genres.length) {
            return '<aside class="sidebar"><h3><i class="fas fa-tags"></i> Genres</h3><p><i class="fas fa-spinner fa-spin"></i> Loading...</p></aside>';
        }
        
        return `
            <aside class="sidebar">
                <h3><i class="fas ${this.type === 'movie' ? 'fa-film' : 'fa-tv'}"></i> ${this.type === 'movie' ? 'Movie' : 'TV'} Genres</h3>
                <ul class="genre-list">
                    <li class="genre-item ${!this.selectedGenreId ? 'active' : ''}" data-genre-id="">
                        <i class="fas fa-list"></i> All ${this.type === 'movie' ? 'Movies' : 'Series'}
                    </li>
                    ${this.genres.map(genre => `
                        <li class="genre-item ${this.selectedGenreId === genre.id ? 'active' : ''}" 
                            data-genre-id="${genre.id}">
                            <i class="fas fa-tag"></i> ${genre.name}
                        </li>
                    `).join('')}
                </ul>
            </aside>
        `;
    }
    
    attachEventListeners() {
        document.querySelectorAll('.genre-item').forEach(item => {
            item.addEventListener('click', () => {
                const genreId = item.dataset.genreId;
                this.selectedGenreId = genreId ? parseInt(genreId) : null;
                if (this.onGenreSelect) {
                    this.onGenreSelect(this.selectedGenreId);
                }
                this.updateActiveState();
            });
        });
    }
    
    updateActiveState() {
        document.querySelectorAll('.genre-item').forEach(item => {
            const genreId = item.dataset.genreId;
            const isActive = genreId === '' ? !this.selectedGenreId : parseInt(genreId) === this.selectedGenreId;
            if (isActive) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
}