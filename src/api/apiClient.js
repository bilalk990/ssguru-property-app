import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL placeholder - replace with actual API URL when provided
const BASE_URL = 'https://api.sspropertyguru.com/api';

const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// Request interceptor - attach auth token
apiClient.interceptors.request.use(
    async config => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.log('Error reading token:', error);
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    },
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
    response => response,
    async error => {
        if (error.response?.status === 401) {
            // Token expired - clear storage and redirect to login
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('userData');
        }
        return Promise.reject(error);
    },
);

export default apiClient;
