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

// Get all categories
export const getAllCategories = async () => {
    try {
        const response = await axiosInstance.get('/categories');
        return response.data;
    } catch {
        throw new Error('Failed to fetch categories');
    }
}

// Get category by ID
export const getCategoryById = async (id) => {
    try {
        const response = await axiosInstance.get(`/categories/${id}`);
        return response.data;
    } catch {
        throw new Error('Failed to fetch category');
    }
}

// Create a new category
export const createCategory = async (category) => {
    try {
        const response = await axiosInstance.post('/categories', category);
        return response.data;
    } catch {
        throw new Error('Failed to create category');
    }
}

// Update a category
export const updateCategory = async (id, category) => {
    try {
        const response = await axiosInstance.put(`/categories/${id}`, category);
        return response.data;
    } catch {
        throw new Error('Failed to update category');
    }
}

// Delete a category
export const deleteCategory = async (id) => {
    try {
        const response = await axiosInstance.delete(`/categories/${id}`);
        return response.data;
    } catch {
        throw new Error('Failed to delete category');
    }
}