import axios from 'axios';
import Cookies from 'js-cookie';

// const API_URL = 'http://192.168.1.3:5151';

//IP LOCALHOST 
const API_URL = 'http://localhost:5151';

const getToken = () => Cookies.get('authToken');

const axiosInstance = axios.create({
    baseURL: API_URL
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const handleResponse = (response, expectedStatus) => {
    if (response.status !== expectedStatus) {
        throw new Error(`Unexpected response status: ${response.status}`);
    }
    return response.data;
};

export const createDebtPayment = async (debtPaymentData) => {
    const response = await axiosInstance.post('/debt-payments/create', debtPaymentData);
    return handleResponse(response, 201);
};

export const getAllDebtPayments = async () => {
    const response = await axiosInstance.get('/debt-payments');
    return response.data;
};

export const getByCustomerId = async (customerId) => {
    const response = await axiosInstance.get(`/debt-payments/customer/${customerId}`);
    return response.data;
};

export const getLatestDebtAndOrderById = async (customerId) => {
    const response = await axiosInstance.get(`/debt-payments/latest/${customerId}`);
    return response.data;
};
