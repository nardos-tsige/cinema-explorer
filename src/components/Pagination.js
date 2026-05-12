export class Pagination {
    constructor(currentPage, totalPages, onPageChange) {
        this.currentPage = currentPage;
        this.totalPages = Math.min(totalPages, 500);
        this.onPageChange = onPageChange;
    }
    
    render() {
        if (this.totalPages <= 1) return '';
        
        const pages = this.getVisiblePages();
        
        return `
            <div class="pagination">
                <button class="first" ${this.currentPage === 1 ? 'disabled' : ''}>« First</button>
                <button class="prev" ${this.currentPage === 1 ? 'disabled' : ''}>‹ Prev</button>
                ${pages.map(page => `
                    <button class="${page === this.currentPage ? 'active' : ''}" data-page="${page}">
                        ${page}
                    </button>
                `).join('')}
                <button class="next" ${this.currentPage === this.totalPages ? 'disabled' : ''}>Next ›</button>
                <button class="last" ${this.currentPage === this.totalPages ? 'disabled' : ''}>Last »</button>
            </div>
        `;
    }
    
    getVisiblePages() {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(this.totalPages, start + maxVisible - 1);
        
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }
        
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        
        return pages;
    }
    
    attachEventListeners() {
        document.querySelectorAll('.pagination button').forEach(btn => {
            if (btn.disabled) return;
            
            btn.addEventListener('click', () => {
                let newPage = this.currentPage;
                
                if (btn.classList.contains('first')) newPage = 1;
                else if (btn.classList.contains('last')) newPage = this.totalPages;
                else if (btn.classList.contains('prev')) newPage = this.currentPage - 1;
                else if (btn.classList.contains('next')) newPage = this.currentPage + 1;
                else if (btn.dataset.page) newPage = parseInt(btn.dataset.page);
                
                if (newPage !== this.currentPage && newPage >= 1 && newPage <= this.totalPages) {
                    this.onPageChange(newPage);
                }
            });
        });
    }
}