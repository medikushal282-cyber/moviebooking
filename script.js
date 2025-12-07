
// Smooth scroll to sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Initialize WebSocket connection for real-time seat updates
function initSeatUpdates() {
    if (document.getElementById('seats-container')) {
        const socketProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const socket = new WebSocket(`${socketProtocol}//${window.location.host}/ws/seats/`);
        
        socket.onmessage = function(e) {
            const data = JSON.parse(e.data);
            if (data.type === 'seat_update') {
                const seatElement = document.getElementById(`seat-${data.seat_id}`);
                if (seatElement) {
                    seatElement.className = `seat seat-${data.status}`;
                    seatElement.title = data.status === 'available' ? 'Available' : 
                                      data.status === 'selected' ? 'Selected' : 'Occupied';
                    
                    if (data.status === 'occupied' && selectedSeats.includes(data.seat_id)) {
                        // Remove occupied seat from selection
                        selectedSeats = selectedSeats.filter(seat => seat !== data.seat_id);
                        updateOrderSummary();
                    }
                }
            }
        };
        
        socket.onclose = function() {
            console.log('Socket closed. Reconnecting...');
            setTimeout(initSeatUpdates, 2000);
        };
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('ReelRush Cinematics initialized');
    initSeatUpdates();
    
    // Load movies for homepage
    if (document.querySelector('.movie-card')) {
        const loadMovies = async () => {
            try {
                const response = await fetch('/api/movies/now-playing/');
                const movies = await response.json();
                renderMovies(movies);
            } catch (error) {
                console.error('Error loading movies:', error);
            }
        };
        
        loadMovies();
    }
});
// Theme toggle functionality
function toggleTheme() {
    const html = document.documentElement;
    html.classList.toggle('dark');
    localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
}

// Initialize theme from localStorage or preference
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
    }
}

initializeTheme();