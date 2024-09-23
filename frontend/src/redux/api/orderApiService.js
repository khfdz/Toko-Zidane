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

// Function to handle errors
const handleResponse = (response, expectedStatus) => {
    if (response.status !== expectedStatus) {
        throw new Error(`Unexpected response status: ${response.status}`);
    }
    return response.data;
};

// Create order
export const createOrder = async (orderData) => {
    const response = await axiosInstance.post('/orders/create', orderData);
    return handleResponse(response, 201); // Status code for resource creation
};

// Get all orders
export const getAllOrders = async () => {
    const response = await axiosInstance.get('/orders');
    return response.data;
};

// Delete order by ID
export const deleteOrder = async (orderId) => {
    const response = await axiosInstance.delete(`/orders/${orderId}`);
    return handleResponse(response, 200); // Status code for successful deletion
};

// Edit order by ID
export const editOrder = async (orderId, updateData) => {
    const response = await axiosInstance.patch(`/orders/${orderId}`, updateData);
    return handleResponse(response, 200); // Status code for successful update
};

// Get total debt by customer ID
export const getTotalDebtByCustomerId = async (customerId) => {
    const response = await axiosInstance.get(`/orders/debt/${customerId}`);
    return response.data;
};

export const payDebt = async ({ customerId, paymentAmount }) => {
    const response = await axiosInstance.put(`/orders/pay-debt/${customerId}`, {
      customerId,
      paymentAmount
    });
    return response.data;
};

// Get latest order by customer ID
export const getLatestOrderByCustomerId = async (customerId) => {
    const response = await axiosInstance.get(`/orders/latest/${customerId}`);
    return response.data.latestOrder;
};
