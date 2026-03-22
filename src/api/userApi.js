import apiClient from './apiClient';

/**
 * User API Service
 * Maps to Postman 'Users' folder (excluding generic auth)
 */

// GET /api/v1/users
export const getUsers = async (params = {}) => {
    return apiClient.get('/users', { params });
};

// GET /api/v1/users/:id
export const getUserById = async (id) => {
    return apiClient.get(`/users/${id}`);
};

// PUT /api/v1/users/:id
export const updateUser = async (id, data) => {
    return apiClient.put(`/users/${id}`, data);
};

// DELETE /api/v1/users/:id
export const deleteUser = async (id) => {
    return apiClient.delete(`/users/${id}`);
};
