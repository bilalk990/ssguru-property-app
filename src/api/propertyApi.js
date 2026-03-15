import apiClient from './apiClient';

/**
 * Property API Service
 * Maps to Postman 'Properties' folder
 */

// GET /api/v1/properties
export const getProperties = async (params = {}) => {
    // Postman: Supports search, city, type, minPrice, maxPrice, agentId, franchiseId
    return apiClient.get('/properties', { params });
};

// GET /api/v1/properties/:id
export const getPropertyById = async (id) => {
    return apiClient.get(`/properties/${id}`);
};

// GET /api/v1/properties/franchise/:franchiseId
export const getPropertiesByFranchise = async (franchiseId) => {
    return apiClient.get(`/properties/franchise/${franchiseId}`);
};

// GET /api/v1/properties/agent/:agentId
export const getPropertiesByAgent = async (agentId) => {
    return apiClient.get(`/properties/agent/${agentId}`);
};

// POST /api/v1/properties
export const addProperty = async (formData) => {
    return apiClient.post('/properties', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

// PUT /api/v1/properties/:id
export const updateProperty = async (id, formData) => {
    return apiClient.put(`/properties/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

// DELETE /api/v1/properties/:id
export const deleteProperty = async (id) => {
    return apiClient.delete(`/properties/${id}`);
};

// My Properties (Frontend logic filter or backend endpoint if exists)
export const getMyProperties = async (userId) => {
    // Assuming we fetch filtered properties or there's a specific 'me' endpoint
    return apiClient.get('/properties', { params: { userId } });
};

// Enquiry (Assuming mapping to a specific endpoint or generic contact)
export const submitEnquiry = async (enquiryData) => {
    // Postman doesn't have a specific 'Enquiry' folder, likely handles via messages or generic POST
    return apiClient.post('/enquiry', enquiryData);
};
