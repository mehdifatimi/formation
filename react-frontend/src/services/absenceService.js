import api from './api';

/**
 * Get all absences with optional filters
 * @param {Object} filters - Optional filters
 * @returns {Promise} Promise object with absences data
 */
export const getAbsences = async (filters = {}) => {
    try {
        const token = localStorage.getItem('token');
        console.log('Token actuel:', token);
        console.log('Headers de la requête:', api.defaults.headers);
        
        const response = await api.get('/absences', { params: filters });
        return response.data;
    } catch (error) {
        console.error('Error fetching absences:', error);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        throw error;
    }
};

/**
 * Get absence statistics
 * @param {Object} filters - Optional filters
 * @returns {Promise} Promise object with statistics data
 */
export const getAbsenceStatistics = async (filters = {}) => {
    try {
        const token = localStorage.getItem('token');
        console.log('Token actuel pour les statistiques:', token);
        console.log('Headers de la requête pour les statistiques:', api.defaults.headers);
        
        const response = await api.get('/absences/statistics', { params: filters });
        return response.data;
    } catch (error) {
        console.error('Error fetching absence statistics:', error);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        throw error;
    }
};

/**
 * Create a new absence
 * @param {Object} absenceData - Absence data
 * @returns {Promise} Promise object with created absence data
 */
export const createAbsence = async (absenceData) => {
    try {
        const response = await api.post('/absences', absenceData);
        return response.data;
    } catch (error) {
        console.error('Error creating absence:', error);
        throw error;
    }
};

/**
 * Update an existing absence
 * @param {number} id - Absence ID
 * @param {Object} absenceData - Updated absence data
 * @returns {Promise} Promise object with updated absence data
 */
export const updateAbsence = async (id, absenceData) => {
    try {
        const response = await api.put(`/absences/${id}`, absenceData);
        return response.data;
    } catch (error) {
        console.error('Error updating absence:', error);
        throw error;
    }
};

/**
 * Delete an absence
 * @param {number} id - Absence ID
 * @returns {Promise} Promise object
 */
export const deleteAbsence = async (id) => {
    try {
        await api.delete(`/absences/${id}`);
    } catch (error) {
        console.error('Error deleting absence:', error);
        throw error;
    }
}; 