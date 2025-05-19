import api from './api';

export const regionService = {
    getAll: async () => {
        try {
            const response = await api.get('/regions');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const response = await api.get(`/regions/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    create: async (data) => {
        try {
            const response = await api.post('/regions', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    update: async (id, data) => {
        try {
            const response = await api.put(`/regions/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const response = await api.delete(`/regions/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}; 