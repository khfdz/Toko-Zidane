import axios from 'axios';
import Cookies from 'js-cookie';

// IP COMPUTER
// const API_URL = 'http://192.168.1.3:5151';

//IP LOCALHOST 
const API_URL = 'http://localhost:5151';

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

// Fetch the current user's cart
export const fetchCartForCurrentUser = async () => {
    const response = await axiosInstance.get('/carts/me');
    return response.data;
};

// Add items to the cart
// Fungsi untuk mengirimkan hanya 'items'
export const addItemsToCart = async (items) => {
    try {
        const response = await axiosInstance.post('/carts/add', { items }); // Hanya mengirim items
        console.log('Items berhasil ditambahkan ke cart:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error menambahkan barang ke cart:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const addAdditionalItemsToCart = async (additionalItems) => {
    const dataToSend = {
        additionalItems
    };

    try {
        const response = await axiosInstance.post('/carts/add', dataToSend);
        console.log('Additional items berhasil ditambahkan ke cart:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error menambahkan additional items ke cart:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Fungsi untuk menambahkan diskon
export const addDiscount = async ({ discount, discountText }) => {
    const combinedData = {
        discount,
        discountText,
    };

    try {
        const response = await axiosInstance.post('/carts/add', combinedData);
        console.log('Diskon berhasil ditambahkan:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error menambahkan diskon:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Fungsi untuk menambahkan catatan
export const addNote = async (note) => {
    try {
        const response = await axiosInstance.post('/carts/add', { note });
        console.log('Catatan berhasil ditambahkan:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error menambahkan catatan:', error.response ? error.response.data : error.message);
        throw error;
    }
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
    await axiosInstance.delete(`/carts/${id}`);
    return id;
};

// Edit a specific cart by ID
export const editCartById = async (id, updates) => {
    const response = await axiosInstance.put(`/carts/${id}`, updates); // Kirim updates langsung
    return response.data;
};

// Clear Cart 
export const clearCart = async () => {
    const response = await axiosInstance.post('/carts/clear');
    return response.data;
};
