import api from './api';

const authService = {
    /**
     * Login user
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise} Promise object with user data and token
     */
    login: async (email, password) => {
        try {
            // Obtenir le CSRF cookie d'abord
            await api.get('http://127.0.0.1:8000/sanctum/csrf-cookie');
            
            const response = await api.post('/login', { email, password });
            
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                console.log('Token et données utilisateur stockés avec succès');
            }
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    /**
     * Register user
     * @param {Object} userData - User data
     * @returns {Promise} Promise object with user data
     */
    register: async (userData) => {
        try {
            const response = await api.post('/api/register', userData);
            return response.data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    /**
     * Logout user
     * @returns {Promise} Promise object
     */
    logout: async () => {
        try {
            await api.post('/logout');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    },

    /**
     * Get current user
     * @returns {Object|null} Current user data or null
     */
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    /**
     * Check if user is authenticated
     * @returns {boolean} True if user is authenticated
     */
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    /**
     * Get auth token
     * @returns {string|null} Auth token or null
     */
    getToken: () => {
        return localStorage.getItem('token');
    },

    /**
     * Refresh auth token
     * @returns {Promise} Promise object with new token
     */
    refreshToken: async () => {
        try {
            const response = await api.post('/api/refresh-token');
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            return response.data;
        } catch (error) {
            console.error('Token refresh error:', error);
            throw error;
        }
    }
};

export default authService;