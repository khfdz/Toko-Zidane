import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:5151';

// Function to get the token from cookies
const getToken = () => Cookies.get('token');

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

// Get all products
export const getAllProducts = async () => {
    try {
        const response = await axiosInstance.get('/products');
        return response.data;
    } catch {
        throw new Error('Failed to fetch products');
    }
};

// Get product by ID
export const getProductById = async (id) => {
    try {
        const response = await axiosInstance.get(`/products/${id}`);
        return response.data;
    } catch {
        throw new Error('Failed to fetch product');
    }
};

// Create a new product
export const createProduct = async (productData, imageFile) => {
    try {
        const formData = new FormData();
        formData.append('category', productData.category);
        formData.append('name', productData.name);
        formData.append('cost_price', productData.cost_price);
        formData.append('retail_price', productData.retail_price);
        formData.append('wholesale_price', productData.wholesale_price);
        formData.append('stock', productData.stock);
        formData.append('barcode', productData.barcode);
        if (imageFile) formData.append('image', imageFile);

        const response = await axiosInstance.post('/products', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch {
        throw new Error('Failed to create product');
    }
};

// Update product by ID
export const updateProductById = async (id, productData, imageFile) => {
    try {
        const formData = new FormData();
        formData.append('category', productData.category);
        formData.append('name', productData.name);
        formData.append('cost_price', productData.cost_price);
        formData.append('retail_price', productData.retail_price);
        formData.append('wholesale_price', productData.wholesale_price);
        formData.append('stock', productData.stock);
        formData.append('barcode', productData.barcode);
        if (imageFile) formData.append('image', imageFile);

        const response = await axiosInstance.put(`/products/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch {
        throw new Error('Failed to update product');
    }
};

// Delete product by ID
export const deleteProductById = async (id) => {
    try {
        const response = await axiosInstance.delete(`/products/${id}`);
        return response.data;
    } catch {
        throw new Error('Failed to delete product');
    }
};
