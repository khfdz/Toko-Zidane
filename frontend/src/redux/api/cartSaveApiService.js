import axios from 'axios';
import Cookies from 'js-cookie';

// IP COMPUTER
// const API_URL = 'http://192.168.1.3:5151';

// IP LAPTOP
const API_URL = `http://192.168.161.92:5151`;

// Function to get the token from cookies
const getToken = () => Cookies.get('authToken');    

// Axios instance with dynamic token addition
const axiosInstance = axios.create({
    baseURL: API_URL
});

// Add a request interceptor to include the token in every request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getToken(); // Get the token from cookies
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Save cart
export const saveCart = async (items) => {
    const response = await axiosInstance.post('/cart-saves/save', { items });
    if (response.status !== 200) { // Atau status lain yang dianggap sukses
        throw new Error('Failed to save the cart');
    }
    return response.data;
};

// Load save cart
export const loadCart = async (id) => {
    const response = await axiosInstance.put(`/carts-saves/load/${id}`);
    return response.data;    
}

// Delete save cart by ID
export const deleteSaveCart = async (id) => {
    const response = await axiosInstance.delete(`/carts-saves/${id}`);
    return response.data;
}

// Get all save carts
export const getAllSaveCarts = async () => {
    const response = await axiosInstance.get('/cart-saves');
    return response.data;
}

// Get save cart by ID
export const getSaveCartById = async (id) => {
    const response = await axiosInstance.get(`/carts-saves/${id}`);
    return response.data;
}