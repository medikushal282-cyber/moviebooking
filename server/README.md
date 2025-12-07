# Movie Booking System - Backend API

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running on localhost:27017)
- Redis (running on localhost:6379)

### Installation & Setup

1. **Fix PowerShell Execution Policy** (Required first):
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

2. **Install Dependencies**:
   ```bash
   cd server
   npm install
   ```

3. **Configure Environment**:
   - Edit `server/.env` if needed (MongoDB/Redis URIs)

4. **Seed Database**:
   ```bash
   npm run seed
   ```
   This will import all 43 movies and 30 theatres into MongoDB.

5. **Start Server**:
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

## 📍 API Endpoints

### Movies
- `GET /api/v1/movies` - Get all movies
  - Query params: `?language=Hindi&genre=Action&year=2025&limit=10`
- `GET /api/v1/movies/:id` - Get single movie
- `GET /api/v1/movies/search?q=Alpha` - Search movies

### Theatres
- `GET /api/v1/theatres` - Get all theatres
  - Query params: `?location=Gachibowli`
- `GET /api/v1/theatres/:id` - Get single theatre

### Health Check
- `GET /api/health` - Check server status

## 🔧 Testing API

```bash
# Get all movies
curl http://localhost:5000/api/v1/movies

# Get Hindi movies from 2025
curl "http://localhost:5000/api/v1/movies?language=Hindi&year=2025"

# Search for Alpha
curl "http://localhost:5000/api/v1/movies/search?q=Alpha"

# Get all theatres
curl http://localhost:5000/api/v1/theatres
```

## 📁 Frontend Integration

The frontend `js/api.js` module provides:
- `fetchMovies(filters)` - Fetch all movies with optional filters
- `fetchMovieById(id)` - Fetch single movie
- `searchMovies(query)` - Search movies by title
- `fetchTheatres(location)` - Fetch all theatres
- `fetchTheatreById(id)` - Fetch single theatre

Import in HTML:
```html
<script src="js/api.js"></script>
```

## 🎯 Next Steps

1. Start MongoDB and Redis
2. Run `npm run seed` to populate database
3. Start backend with `npm run dev`
4. Update frontend pages to use `js/api.js`
5. Test with Live Server

## ⚡ Features

- ✅ RESTful API design
- ✅ Redis caching (1-2 hours)
- ✅ Search functionality
- ✅ Filter support (language, genre, year)
- ✅ CORS enabled
- ✅ Error handling
- ✅ All 43 movies + 30 theatres

## 📝 Notes

- **Static files**: Trailers served from `/trailers` endpoint
- **Cache**: Redis auto-caches GET requests
- **Database**: MongoDB with indexed fields for performance
