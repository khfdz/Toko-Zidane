import axios from 'axios';
import Cookies from 'js-cookie';

// IP COMPUTER
const API_URL = 'http://192.168.1.3:5151';

// IP LAPTOP
// const API_URL = `http://192.168.161.92:5151`;

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

// Login user
export const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
};

// Get all users
export const getAllUsers = async () => {
    const response = await axiosInstance.get(`/auth`);
    return response.data;
};

// Register a new user
export const register = async (email, phone, password) => {
    const response = await axiosInstance.post(`/auth/register`, { email, phone, password });
    return response.data;
};

// Get user by ID
export const getUserById = async (id) => {
    const response = await axiosInstance.get(`/auth/${id}`);
    return response.data;
};

// Get user profile from token
export const getUserProfile = async () => {
    const response = await axiosInstance.get(`/auth/profile`);
    return response.data;
};

// Update user by ID
export const updateUserById = async (id, userData) => {
    const response = await axiosInstance.put(`/auth/${id}`, userData);
    return response.data;
};

// Delete user by ID
export const deleteUserById = async (id) => {
    const response = await axiosInstance.delete(`/auth/${id}`);
    return response.data;
};
