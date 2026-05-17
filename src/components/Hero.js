export class HeroCarousel {
    constructor(items, type) {
        this.items = items || [];
        this.type = type;
        this.currentIndex = 0;
        this.imageBaseUrl = 'https://image.tmdb.org/t/p/original';
        this.autoPlayInterval = null;
    }
    
    render() {
        if (!this.items.length) return '<div class="hero loading"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';
        
        return `
            <div class="hero">
                <div class="carousel">
                    <div class="carousel-container">
                        <div class="carousel-track" id="carouselTrack">
                            ${this.items.map(item => this.createSlide(item)).join('')}
                        </div>
                    </div>
                    <button class="carousel-btn prev" id="prevBtn"><i class="fas fa-chevron-left"></i></button>
                    <button class="carousel-btn next" id="nextBtn"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
        `;
    }
    
    createSlide(item) {
        const title = item.title || item.name;
        const backdropPath = item.backdrop_path || item.poster_path;
        const imageUrl = backdropPath ? `${this.imageBaseUrl}${backdropPath}` : '';
        const rating = item.vote_average?.toFixed(1);
        
        return `
            <div class="carousel-slide">
                <img src="${imageUrl}" alt="${title}" onerror="this.src='https://via.placeholder.com/1920x500?text=Cinema+Explorer'">
                <div class="slide-overlay">
                    <h2 class="slide-title">${title}</h2>
                    ${rating ? `<div class="slide-rating"><i class="fas fa-star"></i> ${rating}/10</div>` : ''}
                </div>
            </div>
        `;
    }
    
    attachEventListeners() {
        const track = document.getElementById('carouselTrack');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (!track || !this.items.length) return;
        
        const slideWidth = track.children[0]?.offsetWidth || 0;
        
        const updateCarousel = () => {
            track.style.transform = `translateX(-${this.currentIndex * slideWidth}px)`;
        };
        
        const goToNext = () => {
            this.currentIndex = (this.currentIndex + 1) % this.items.length;
            updateCarousel();
        };
        
        prevBtn?.addEventListener('click', () => {
            this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
            updateCarousel();
            this.resetAutoPlay();
        });
        
        nextBtn?.addEventListener('click', () => {
            goToNext();
            this.resetAutoPlay();
        });
        
        this.startAutoPlay();
        
        window.addEventListener('resize', () => {
            const newSlideWidth = track.children[0]?.offsetWidth || 0;
            track.style.transform = `translateX(-${this.currentIndex * newSlideWidth}px)`;
        });
    }
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.currentIndex = (this.currentIndex + 1) % this.items.length;
            const track = document.getElementById('carouselTrack');
            const slideWidth = track?.children[0]?.offsetWidth || 0;
            if (track) track.style.transform = `translateX(-${this.currentIndex * slideWidth}px)`;
        }, 5000);
    }
    
    resetAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.startAutoPlay();
        }
    }
}