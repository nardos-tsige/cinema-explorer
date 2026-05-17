import { detailsService } from '../api/detailsService.js';
import { Card } from '../components/Card.js';

export async function renderDetailsPage(type, id) {
    console.log('renderDetailsPage called with:', type, id);
    
    try {
        let data;
        let credits = null;
        
        if (type === 'movie') {
            data = await detailsService.getMovieDetails(id);
            credits = await detailsService.getMovieCredits(id);
        } else if (type === 'series') {
            data = await detailsService.getSeriesDetails(id);
            credits = await detailsService.getSeriesCredits(id);
        } else {
            data = await detailsService.getPersonDetails(id);
            credits = await detailsService.getPersonMovieCredits(id);
        }
        
        console.log('Data loaded:', data.title || data.name);
        
        return `
            ${renderHero(data, type)}
            ${renderDetails(data, type, credits)}
        `;
    } catch (error) {
        console.error('Details page error:', error);
        return `
            <div class="error" style="text-align: center; margin-top: 100px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #ff4444;"></i>
                <h2>Failed to load details</h2>
                <p>${error.message}</p>
                <a href="/" style="color: #ff8c00;">Go back home</a>
            </div>
        `;
    }
}

function renderHero(data, type) {
    const imageBaseUrl = 'https://image.tmdb.org/t/p/original';
    const backdropPath = data.backdrop_path || data.profile_path;
    const imageUrl = backdropPath ? `${imageBaseUrl}${backdropPath}` : '';
    
    const title = data.title || data.name;
    const rating = data.vote_average?.toFixed(1);
    const releaseDate = data.release_date || data.first_air_date || data.birthday;
    
    return `
        <div class="details-hero" style="background-image: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url('${imageUrl}'); background-size: cover; background-position: center; min-height: 400px; display: flex; align-items: flex-end; padding: 3rem; border-radius: 20px; margin: 2rem 0;">
            <div class="details-hero-content">
                <h1 style="font-size: 2.5rem; margin-bottom: 1rem;">${title}</h1>
                <div class="details-meta" style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                    ${releaseDate ? `<span><i class="far fa-calendar-alt"></i> ${releaseDate.split('-')[0]}</span>` : ''}
                    ${rating ? `<span><i class="fas fa-star" style="color: #ff8c00;"></i> ${rating}/10</span>` : ''}
                </div>
                <p style="line-height: 1.6;">${data.overview || 'No description available.'}</p>
            </div>
        </div>
    `;
}

function renderDetails(data, type, credits) {
    if (type === 'person') {
        return renderPersonDetails(data, credits);
    }
    return renderMovieSeriesDetails(data, credits);
}

function renderMovieSeriesDetails(data, credits) {
    const cast = credits?.cast?.slice(0, 10) || [];
    
    return `
        <div style="margin: 2rem 0;">
            <div style="background: rgba(26, 26, 46, 0.8); border-radius: 16px; padding: 1.5rem; margin-bottom: 1rem;">
                <h3><i class="fas fa-info-circle"></i> Details</h3>
                <p><strong>Status:</strong> ${data.status || 'Unknown'}</p>
                <p><strong>Original Language:</strong> ${data.original_language?.toUpperCase() || 'Unknown'}</p>
                ${data.genres?.length ? `<p><strong>Genres:</strong> ${data.genres.map(g => g.name).join(', ')}</p>` : ''}
            </div>
            
            ${cast.length ? `
            <div style="background: rgba(26, 26, 46, 0.8); border-radius: 16px; padding: 1.5rem;">
                <h3><i class="fas fa-users"></i> Cast</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 1rem; margin-top: 1rem;">
                    ${cast.map(actor => `
                        <div class="cast-card" data-id="${actor.id}" data-type="person" style="cursor: pointer; text-align: center;">
                            <img src="https://image.tmdb.org/t/p/w200${actor.profile_path}" alt="${actor.name}" style="width: 100%; border-radius: 12px;" onerror="this.src='https://via.placeholder.com/200x300?text=No+Image'">
                            <p><strong>${actor.name}</strong></p>
                            <small>${actor.character || 'Actor'}</small>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
        </div>
    `;
}

function renderPersonDetails(data, credits) {
    const movies = credits?.cast?.slice(0, 12) || [];
    
    return `
        <div style="margin: 2rem 0;">
            <div style="background: rgba(26, 26, 46, 0.8); border-radius: 16px; padding: 1.5rem; margin-bottom: 1rem;">
                <h3><i class="fas fa-book-open"></i> Biography</h3>
                <p>${data.biography || 'No biography available.'}</p>
            </div>
            
            <div style="background: rgba(26, 26, 46, 0.8); border-radius: 16px; padding: 1.5rem; margin-bottom: 1rem;">
                <h3><i class="fas fa-address-card"></i> Personal Info</h3>
                <p><strong>Born:</strong> ${data.birthday || 'Unknown'}</p>
                <p><strong>Place of Birth:</strong> ${data.place_of_birth || 'Unknown'}</p>
                <p><strong>Known For:</strong> ${data.known_for_department || 'Acting'}</p>
            </div>
            
            ${movies.length ? `
            <div style="background: rgba(26, 26, 46, 0.8); border-radius: 16px; padding: 1.5rem;">
                <h3><i class="fas fa-film"></i> Known For</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem; margin-top: 1rem;">
                    ${movies.map(movie => {
                        const card = new Card(movie, 'movie');
                        return card.render();
                    }).join('')}
                </div>
            </div>
            ` : ''}
        </div>
    `;
}

export function attachDetailsEventListeners() {
    document.querySelectorAll('.cast-card').forEach(card => {
        card.removeEventListener('click', handleCastClick);
        card.addEventListener('click', handleCastClick);
    });
}

function handleCastClick(e) {
    const card = e.currentTarget;
    const id = card.dataset.id;
    if (id) {
        window.dispatchEvent(new CustomEvent('navigate', { 
            detail: { path: `/person/${id}` } 
        }));
    }
}