import apiClient from './apiClient';

/**
 * Agent API Service
 * Maps to Postman 'Agent' folder
 */

// GET /api/v1/agents
export const getAgents = async (params = {}) => {
    return apiClient.get('/agents', { params });
};

// GET /api/v1/agents/:id
export const getAgentById = async (id) => {
    return apiClient.get(`/agents/${id}`);
};

// GET /api/v1/agents/me (Self profile for agent)
export const getAgentMe = async () => {
    return apiClient.get('/agents/me');
};

// PATCH /api/v1/agents/update-profile
export const updateAgentProfile = async (formData) => {
    return apiClient.patch('/agents/update-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};
