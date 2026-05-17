# 🎬 Cinema Explorer

A movie and TV series discovery web application built with **HTML, CSS, JavaScript**, and **Vite**, powered by The Movie Database (TMDB) API.

**Live Demo:** [cinema-explorer.vercel.app](https://cinema-explorer-ashy.vercel.app/)

---

## ✨ Features

- Browse trending movies, TV series, and celebrities
- Filter content by genre with sidebar navigation
- Pagination for exploring large content libraries
- Responsive design for mobile, tablet, and desktop
- Dynamic detail pages for movies, series, and celebrities

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| HTML5, CSS3, JavaScript (ES6+) | Frontend |
| Vite | Build tool |
| TMDB API | Movie/TV data |
| Font Awesome | Icons |

---

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/nardos-tsige/cinema-explorer.git

# Install dependencies
npm install

# Create .env file with your TMDB API key
echo VITE_TMDB_API_KEY=your_api_key_here > .env

# Run development server
npm run dev

Visit http://localhost:3004 to view the app.

🔑 Environment Variables
Variable	Description
VITE_TMDB_API_KEY	TMDB Bearer Token (starts with eyJ...)

📁 Project Structure
src/
├── api/          # API service layer
├── components/   # Reusable UI components
├── pages/        # Page modules
├── styles/       # Global CSS
└── app.js        # Application entry

📱 Responsive Design
Desktop: Full layout with sidebar

Tablet: Adjusted grid spacing

Mobile: Stacked layout

🙏 Acknowledgments
[TMDB](https://www.themoviedb.org/) for providing movie data

👩‍💻 Author
Nardos Tsige
[GitHub](https://github.com/nardos-tsige)

📄 License
MIT
