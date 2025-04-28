import api from './api';

const cdcService = {
    getAll: async () => {
        try {
            console.log('Fetching CDCs from:', process.env.REACT_APP_API_URL + '/cdcs');
            const response = await api.get('/cdcs');
            console.log('CDC response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching CDCs:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            } else if (error.request) {
                console.error('Request error:', error.request);
            } else {
                console.error('Error message:', error.message);
            }
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const response = await api.get(`/cdcs/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching CDC:', error);
            throw error;
        }
    },

    create: async (data) => {
        try {
            const response = await api.post('/cdcs', data);
            return response.data;
        } catch (error) {
            console.error('Error creating CDC:', error);
            throw error;
        }
    },

    update: async (id, data) => {
        try {
            const response = await api.put(`/cdcs/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating CDC:', error);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const response = await api.delete(`/cdcs/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting CDC:', error);
            throw error;
        }
    }
};

export default cdcService; 