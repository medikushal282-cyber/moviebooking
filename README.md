# 🎬 BookYourShow Cinematics

A beautiful, modern movie booking web application with dynamic seat selection and stunning UI.

## ✨ Features

- **Dynamic Movie Catalog**: Browse through a curated selection of movies
- **Advanced Filtering**: Filter movies by genre, language, format, rating, duration, and year
- **Interactive Seat Selection**: Choose your seats with real-time visual feedback
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Beautiful UI**: Modern glassmorphism design with smooth animations
- **3D Movie Cards**: Eye-catching card effects with hover interactions

## 🚀 Getting Started

### Prerequisites

No installation required! Just a modern web browser.

### Running the Application

You have two options to run this application locally:

#### Option 1: Using NPM (Recommended)

```bash
# Start the development server
npm start
```

This will automatically open your browser to `http://localhost:3000`

#### Option 2: Direct File Opening

Simply open `index.html` in your web browser by double-clicking it.

> **Note**: Some features work better when served through a local server (Option 1).

## 📁 Project Structure

```
moviebooking/
├── index.html          # Homepage with featured movies
├── movies.html         # Full movie catalog with filters
├── book.html           # Booking page with seat selection
├── data.js             # Centralized movie data
├── script.js           # Main JavaScript functionality
├── style.css           # Global styles
├── components/         # Reusable web components
│   ├── navbar.js
│   ├── footer.js
│   ├── movie-grid.js
│   └── waves-background.js
└── README.md           # This file
```

## 🎨 Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **JavaScript (ES6+)** - Interactive functionality
- **Tailwind CSS** - Utility-first styling via CDN
- **Feather Icons** - Beautiful icon set

## 🎯 Pages

### Home (`index.html`)
- Featured "Now Playing" movies
- "Coming Soon" section
- Quick navigation

### Movies (`movies.html`)
- Complete movie catalog
- Advanced filtering system
- Search functionality
- Sort by popularity, rating, or release date

### Booking (`book.html`)
- Movie details
- Showtime selection
- Interactive seat map
- Order summary
- Pricing calculation

## 💡 Usage

1. **Browse Movies**: Navigate to the Movies page to see all available films
2. **Filter & Search**: Use the filter bar to find movies by your preferences
3. **Book Tickets**: Click "Book Now" on any movie
4. **Select Seats**: Choose your preferred seats from the interactive seating chart
5. **Review Order**: Check your order summary and proceed to payment

## 🎭 Mock Data

The application uses mock data defined in `data.js`. To add or modify movies, edit the `MOVIES_DATA` array in that file.

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 📝 Future Enhancements

- Backend integration with real API
- User authentication
- Payment gateway integration
- Booking history
- Email confirmations
- Real-time seat availability with WebSockets

## 📄 License

MIT License - feel free to use this project for learning or personal use.

---

**Enjoy your movie! 🍿**
