export class Card {
    constructor(item, type) {
        this.item = item;
        this.type = type;
        this.imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
    }
    
    render() {
        const imagePath = this.getItemImage();
        const title = this.getItemTitle();
        const subtitle = this.getItemSubtitle();
        const rating = this.getItemRating();
        
        let routeType = this.type;
        if (this.type === 'movie') routeType = 'movie';
        else if (this.type === 'series') routeType = 'series';
        else if (this.type === 'person') routeType = 'person';
        
        return `
            <div class="card" data-id="${this.item.id}" data-type="${routeType}" style="cursor: pointer;">
                <img src="${imagePath}" alt="${title}" loading="lazy" onerror="this.src='https://via.placeholder.com/500x750?text=No+Image'">
                <div class="card-info">
                    <h3 class="card-title">${title}</h3>
                    ${subtitle ? `<p class="card-subtitle">${subtitle}</p>` : ''}
                    ${rating ? `<div class="card-rating"><i class="fas fa-star"></i> ${rating.toFixed(1)}</div>` : ''}
                </div>
            </div>
        `;
    }
    
    getItemImage() {
        const path = this.item.poster_path || this.item.profile_path;
        return path ? `${this.imageBaseUrl}${path}` : '';
    }
    
    getItemTitle() {
        if (this.type === 'movie') return this.item.title || 'Untitled';
        if (this.type === 'series') return this.item.name || 'Untitled';
        if (this.type === 'person') return this.item.name || 'Unknown';
        return 'Untitled';
    }
    
    getItemSubtitle() {
        if (this.type === 'person') return this.item.known_for_department;
        if (this.type === 'movie') return this.item.release_date?.split('-')[0] || '';
        if (this.type === 'series') return this.item.first_air_date?.split('-')[0] || '';
        return '';
    }
    
    getItemRating() {
        return this.item.vote_average > 0 ? this.item.vote_average : null;
    }
}