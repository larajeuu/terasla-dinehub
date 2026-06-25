import api from './api';

export const loginMerchant = async (data) => {
    const response = await api.post('/auth/login', data);
    return response.data;
};

export const register = async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
};

// Lupa password: minta link reset dikirim ke email merchant.
export const forgotPassword = async (identifier) => {
    const response = await api.post('/auth/forgot-password', { identifier });
    return response.data;
};

// Cek validitas token reset (dari link email) sebelum menampilkan form.
export const validateResetToken = async (token) => {
    const response = await api.get('/auth/reset-password/validate', { params: { token } });
    return response.data.valid;
};

// Set password baru memakai token dari link email.
export const resetPassword = async (token, password) => {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
};