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

// POST /api/v1/franchise/apply
export const applyForFranchise = async (franchiseData) => {
    return apiClient.post('/franchise/apply', franchiseData);
};
