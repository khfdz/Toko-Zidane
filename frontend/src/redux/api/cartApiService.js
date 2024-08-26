// src/api/cartApiService.js
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:5151';

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

// Fetch the current user's cart
export const fetchCartForCurrentUser = async () => {
    const response = await axiosInstance.get('/carts/me');
    return response.data;
  };
  

// Add items to the cart
export const addItemsToCart = async (items) => {
    const response = await axiosInstance.post('/carts/add', { items });
    return response.data;
};

// Fetch all carts
export const fetchAllCarts = async () => {
    const response = await axiosInstance.get('/carts');
    return response.data;
};

// Fetch a specific cart by ID
export const fetchCartById = async (id) => {
    const response = await axiosInstance.get(`/carts/${id}`);
    return response.data;
};

// Delete a specific cart by ID
export const deleteCartById = async (id) => {
    const response = await axiosInstance.delete(`/carts/${id}`);
    return response.data;
};

// Edit a specific cart by ID
export const editCartById = async (id, items) => {
    const response = await axiosInstance.put(`/carts/${id}`, { items });
    return response.data;
};
