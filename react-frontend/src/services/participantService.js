import api from './api';

/**
 * Get all participants
 * @returns {Promise} Promise object with participants data
 */
export const getParticipants = async () => {
    try {
        const response = await api.get('/participants');
        return response.data;
    } catch (error) {
        console.error('Error fetching participants:', error);
        throw error;
    }
};

/**
 * Get a specific participant by ID
 * @param {number} id - Participant ID
 * @returns {Promise} Promise object with participant data
 */
export const getParticipantById = async (id) => {
    try {
        const response = await api.get(`/participants/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching participant with ID ${id}:`, error);
        throw error;
    }
};

/**
 * Create a new participant
 * @param {Object} participantData - Participant data to create
 * @returns {Promise} Promise object with created participant data
 */
export const createParticipant = async (participantData) => {
    try {
        const response = await api.post('/participants', participantData);
        return response.data;
    } catch (error) {
        console.error('Error creating participant:', error);
        throw error;
    }
};

/**
 * Update an existing participant
 * @param {number} id - Participant ID
 * @param {Object} participantData - Updated participant data
 * @returns {Promise} Promise object with updated participant data
 */
export const updateParticipant = async (id, participantData) => {
    try {
        const response = await api.put(`/participants/${id}`, participantData);
        return response.data;
    } catch (error) {
        console.error(`Error updating participant with ID ${id}:`, error);
        throw error;
    }
};

/**
 * Delete a participant
 * @param {number} id - Participant ID
 * @returns {Promise} Promise object
 */
export const deleteParticipant = async (id) => {
    try {
        await api.delete(`/participants/${id}`);
    } catch (error) {
        console.error(`Error deleting participant with ID ${id}:`, error);
        throw error;
    }
};

/**
 * Attach a formation to a participant
 * @param {number} participantId - Participant ID
 * @param {number} formationId - Formation ID
 * @returns {Promise} Promise object
 */
export const attachFormation = async (participantId, formationId) => {
    try {
        const response = await api.post(`/participants/${participantId}/formations`, { formation_id: formationId });
        return response.data;
    } catch (error) {
        console.error(`Error attaching formation ${formationId} to participant ${participantId}:`, error);
        throw error;
    }
};

/**
 * Detach a formation from a participant
 * @param {number} participantId - Participant ID
 * @param {number} formationId - Formation ID
 * @returns {Promise} Promise object
 */
export const detachFormation = async (participantId, formationId) => {
    try {
        await api.delete(`/participants/${participantId}/formations/${formationId}`);
    } catch (error) {
        console.error(`Error detaching formation ${formationId} from participant ${participantId}:`, error);
        throw error;
    }
};

/**
 * Update formation status for a participant
 * @param {number} participantId - Participant ID
 * @param {number} formationId - Formation ID
 * @param {string} status - New status
 * @returns {Promise} Promise object
 */
export const updateFormationStatus = async (participantId, formationId, status) => {
    try {
        const response = await api.put(`/participants/${participantId}/formations/${formationId}/status`, { status });
        return response.data;
    } catch (error) {
        console.error(`Error updating formation status for participant ${participantId}:`, error);
        throw error;
    }
};

/**
 * Get progress data for all participants
 * @returns {Promise} Promise object with participant progress data
 */
export const getParticipantProgress = async () => {
    try {
        const token = localStorage.getItem('token');
        console.log('Token actuel:', token);
        console.log('Headers de la requête:', {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        });
        const response = await api.get('/participants/progress', {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        console.log('Réponse reçue:', response);
        return response.data;
    } catch (error) {
        console.error('Error fetching participant progress:', error);
        console.error('Détails de l\'erreur:', {
            status: error.response?.status,
            data: error.response?.data,
            headers: error.response?.headers,
            config: error.config
        });
        throw error;
    }
}; 