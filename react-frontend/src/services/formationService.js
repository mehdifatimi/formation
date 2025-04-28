import api from './api';

/**
 * Get all formations
 * @returns {Promise} Promise object with formations data
 */
export const getFormations = async () => {
    try {
        const response = await api.get('/formations');
        return response.data;
    } catch (error) {
        console.error('Error fetching formations:', error);
        throw error;
    }
};

/**
 * Get a specific formation by ID
 * @param {number} id - Formation ID
 * @returns {Promise} Promise object with formation data
 */
export const getFormationById = async (id) => {
    try {
        const response = await api.get(`/formations/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching formation with ID ${id}:`, error);
        throw error;
    }
};

/**
 * Create a new formation
 * @param {Object} formationData - Formation data to create
 * @returns {Promise} Promise object with created formation data
 */
export const createFormation = async (formationData) => {
    try {
        const response = await api.post('/formations', formationData);
        return response.data;
    } catch (error) {
        console.error('Error creating formation:', error);
        throw error;
    }
};

/**
 * Update an existing formation
 * @param {number} id - Formation ID
 * @param {Object} formationData - Updated formation data
 * @returns {Promise} Promise object with updated formation data
 */
export const updateFormation = async (id, formationData) => {
    try {
        const response = await api.put(`/formations/${id}`, formationData);
        return response.data;
    } catch (error) {
        console.error(`Error updating formation with ID ${id}:`, error);
        throw error;
    }
};

/**
 * Delete a formation
 * @param {number} id - Formation ID
 * @returns {Promise} Promise object
 */
export const deleteFormation = async (id) => {
    try {
        await api.delete(`/formations/${id}`);
    } catch (error) {
        console.error(`Error deleting formation with ID ${id}:`, error);
        throw error;
    }
};

/**
 * Validate a formation (admin only)
 * @param {number} id - Formation ID
 * @returns {Promise} Promise object
 */
export const validateFormation = async (id) => {
    try {
        const response = await api.post(`/formations/${id}/validate`);
        return response.data;
    } catch (error) {
        console.error(`Error validating formation with ID ${id}:`, error);
        throw error;
    }
};

/**
 * Reject a formation (admin only)
 * @param {number} id - Formation ID
 * @param {string} reason - Reason for rejection
 * @returns {Promise} Promise object
 */
export const rejectFormation = async (id, reason) => {
    try {
        const response = await api.post(`/formations/${id}/reject`, { reason });
        return response.data;
    } catch (error) {
        console.error(`Error rejecting formation with ID ${id}:`, error);
        throw error;
    }
};

/**
 * Get pending validations (admin only)
 * @returns {Promise} Promise object with pending formations
 */
export const getPendingValidations = async () => {
    try {
        const response = await api.get('/formations/pending-validations');
        return response.data;
    } catch (error) {
        console.error('Error fetching pending validations:', error);
        throw error;
    }
}; 