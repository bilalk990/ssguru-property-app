import apiClient from './apiClient';

/**
 * Franchise API Service
 * Maps to Postman 'Franchise' folder
 */

// GET /api/v1/franchise
export const getFranchises = async (params = {}) => {
    return apiClient.get('/franchise', { params });
};

// GET /api/v1/franchise/:id
export const getFranchiseById = async (id) => {
    return apiClient.get(`/franchise/${id}`);
};

// POST /api/v1/franchise/create
export const createFranchise = async (formData) => {
    return apiClient.post('/franchise/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

// PUT /api/v1/franchise/:id
export const updateFranchise = async (id, data) => {
    return apiClient.put(`/franchise/${id}`, data);
};

// DELETE /api/v1/franchise/:id
export const deleteFranchise = async (id) => {
    return apiClient.delete(`/franchise/${id}`);
};

// PATCH /api/v1/franchise/:id/toggle-status
export const toggleFranchiseStatus = async (id) => {
    return apiClient.patch(`/franchise/${id}/toggle-status`);
};
