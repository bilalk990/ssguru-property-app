import apiClient from './apiClient';

// Stub functions - replace with real API calls when backend is ready

export const sendOtp = async phoneNumber => {
    // TODO: Replace with real API
    // return apiClient.post('/login', { phone: phoneNumber });

    // Simulated response
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ data: { success: true, message: 'OTP sent successfully' } });
        }, 1500);
    });
};

export const verifyOtp = async (phoneNumber, otp) => {
    // TODO: Replace with real API
    // return apiClient.post('/verify-otp', { phone: phoneNumber, otp });

    // Simulated response
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (otp === '1234') {
                resolve({
                    data: {
                        success: true,
                        token: 'dummy_jwt_token_xxx',
                        user: {
                            id: 1,
                            name: 'User',
                            phone: phoneNumber,
                            email: '',
                        },
                    },
                });
            } else {
                reject({ response: { data: { message: 'Invalid OTP' } } });
            }
        }, 1500);
    });
};
