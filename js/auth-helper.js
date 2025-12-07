// Authentication Helper Utility

// Check if token is expired
function isTokenExpired() {
    const token = getToken();
    if (!token) return true;

    try {
        // Decode JWT payload (base64)
        const payload = JSON.parse(atob(token.split('.')[1]));

        // Check expiration (exp is in seconds, Date.now() is in milliseconds)
        if (payload.exp && Date.now() >= payload.exp * 1000) {
            return true;
        }
        return false;
    } catch (error) {
        console.error('Token decode error:', error);
        return true;
    }
}

// Check if user is logged in
function isAuthenticated() {
    const token = localStorage.getItem('token');
    if (!token || token === '') return false;

    // Check if token is expired
    if (isTokenExpired()) {
        logout();
        return false;
    }

    return true;
}

// Protect page - redirect to login if not authenticated
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Get current user data
function getCurrentUser() {
    try {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
    }
}

// Get auth token
function getToken() {
    return localStorage.getItem('token');
}

// Logout user
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Make authenticated API request
async function authFetch(url, options = {}) {
    const token = getToken();

    if (!token) {
        logout();
        return;
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
    };

    try {
        const response = await fetch(url, {
            ...options,
            headers
        });

        // If unauthorized, logout
        if (response.status === 401) {
            logout();
            return;
        }

        return response;
    } catch (error) {
        console.error('Auth Fetch Error:', error);
        throw error;
    }
}
