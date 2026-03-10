import apiClient from './apiClient';
import { featuredProperties } from '../constants/dummyData';

// Stub functions - replace with real API calls when backend is ready

export const getProperties = async (filters = {}) => {
    // TODO: Replace with real API
    // return apiClient.get('/properties', { params: filters });

    return new Promise(resolve => {
        setTimeout(() => {
            let results = [...featuredProperties];

            if (filters.city && filters.city !== 'All Cities') {
                results = results.filter(p => p.city === filters.city);
            }
            if (filters.type && filters.type !== 'All Types') {
                results = results.filter(p => p.type === filters.type);
            }
            if (filters.search) {
                const q = filters.search.toLowerCase();
                results = results.filter(
                    p =>
                        p.title.toLowerCase().includes(q) ||
                        p.city.toLowerCase().includes(q) ||
                        p.area.toLowerCase().includes(q),
                );
            }
            if (filters.minPrice) {
                results = results.filter(p => p.priceNum >= filters.minPrice);
            }
            if (filters.maxPrice && filters.maxPrice !== Infinity) {
                results = results.filter(p => p.priceNum <= filters.maxPrice);
            }

            resolve({ data: { success: true, properties: results } });
        }, 800);
    });
};

export const getPropertyById = async id => {
    // TODO: Replace with real API
    // return apiClient.get(`/properties/${id}`);

    return new Promise(resolve => {
        setTimeout(() => {
            const property = featuredProperties.find(p => p.id === id);
            resolve({ data: { success: true, property } });
        }, 500);
    });
};

export const addProperty = async formData => {
    // TODO: Replace with real API (multipart/form-data)
    // return apiClient.post('/properties', formData, {
    //   headers: { 'Content-Type': 'multipart/form-data' },
    // });

    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ data: { success: true, message: 'Property listed successfully' } });
        }, 1500);
    });
};

export const getMyProperties = async () => {
    // TODO: Replace with real API
    // return apiClient.get('/my-properties');

    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                data: {
                    success: true,
                    properties: featuredProperties.slice(0, 3),
                },
            });
        }, 800);
    });
};

export const deleteProperty = async id => {
    // TODO: Replace with real API
    // return apiClient.delete(`/properties/${id}`);

    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ data: { success: true, message: 'Property deleted' } });
        }, 800);
    });
};

export const submitEnquiry = async enquiryData => {
    // TODO: Replace with real API
    // return apiClient.post('/enquiry', enquiryData);

    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                data: { success: true, message: 'Enquiry submitted successfully' },
            });
        }, 1000);
    });
};
