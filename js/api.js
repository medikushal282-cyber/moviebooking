// API Base URL Configuration - Dynamic for dev/production
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api/v1'
    : `${window.location.origin}/api/v1`;

/**
 * Fetch all movies with optional filters
 * @param {Object} filters - Optional filters (language, genre, year, limit)
 * @returns {Promise<Object>} API response with movies data
 */
async function fetchMovies(filters = {}) {
    try {
        const query = new URLSearchParams(filters);
        const url = `${API_BASE_URL}/movies${query.toString() ? '?' + query.toString() : ''}`;
        console.log('Fetching movies from:', url);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching movies:', error);
        throw error;
    }
}

/**
 * Fetch a single movie by ID
 * @param {string} id - Movie ID
 * @returns {Promise<Object>} API response with single movie data
 */
async function fetchMovieById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/movies/${id}`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Movie not found');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching movie:', error);
        throw error;
    }
}

/**
 * Search movies by title
 * @param {string} query - Search query
 * @returns {Promise<Object>} API response with search results
 */
async function searchMovies(query) {
    try {
        if (!query || query.trim() === '') {
            throw new Error('Search query cannot be empty');
        }

        const response = await fetch(`${API_BASE_URL}/movies/search?q=${encodeURIComponent(query)}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error searching movies:', error);
        throw error;
    }
}

/**
 * Fetch all theatres with optional location filter
 * @param {string} location - Optional location filter
 * @returns {Promise<Object>} API response with theatres data
 */
async function fetchTheatres(location = '') {
    try {
        const url = location
            ? `${API_BASE_URL}/theatres?location=${encodeURIComponent(location)}`
            : `${API_BASE_URL}/theatres`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching theatres:', error);
        throw error;
    }
}

/**
 * Fetch a single theatre by ID
 * @param {string} id - Theatre ID
 * @returns {Promise<Object>} API response with single theatre data
 */
async function fetchTheatreById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/theatres/${id}`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Theatre not found');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching theatre:', error);
        throw error;
    }
}

/**
 * Display loading spinner in a container
 * @param {HTMLElement} container - Container element
 */
function showLoading(container) {
    container.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center; min-height: 200px;">
            <div style="width: 50px; height: 50px; border: 4px solid rgba(160, 153, 216, 0.3); border-top-color: #a099d8; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        </div>
        <style>
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        </style>
    `;
}

/**
 * Display error message in a container
 * @param {HTMLElement} container - Container element
 * @param {string} message - Error message
 * @param {Function} retryCallback - Optional retry function
 */
function showError(container, message, retryCallback = null) {
    container.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 200px; text-align: center; padding: 2rem;">
            <p style="color: #ff6b6b; font-size: 1.1rem; margin-bottom: 1rem;">${message}</p>
            ${retryCallback ? `
                <button onclick="(${retryCallback.toString()})()" 
                        style="padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #cf30aa, #a099d8); 
                               border: none; border-radius: 0.5rem; color: white; font-weight: 600; cursor: pointer;">
                    Retry
                </button>
            ` : ''}
        </div>
    `;
}
