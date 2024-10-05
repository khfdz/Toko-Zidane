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
// Edit a specific cart by ID
export const editCartById = async (id, type, updates) => {
    console.log(`Updating ${type} in cart:`, id);
    console.log(`Updates for ${type}:`, updates);

    try {
        const response = await axiosInstance.patch(`/carts/${id}`, {
            type, // Menambahkan informasi jenis
            updates // Menambahkan data pembaruan
        });
        console.log(`${type.charAt(0).toUpperCase() + type.slice(1)} in cart updated successfully:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error updating ${type} in cart:`, error.response ? error.response.data : error.message);
        throw error; // Pastikan melempar error agar dapat ditangani di tempat lain
    }
};

// Untuk mengedit item reguler

// Fungsi untuk mengedit item dalam cart berdasarkan ID cart dan ID item
export const editCartItemById = async (cartId, itemId, updatedItem) => {
    try {
        // Pastikan updatedItem memiliki struktur yang benar sebelum dikirim
        console.log(`Mengedit item dengan ID ${itemId} di cart ${cartId}:`, updatedItem);

        // Mengirim permintaan patch dengan data yang diperbarui
        const response = await axiosInstance.patch(`/carts/item/${cartId}/${itemId}`, updatedItem);

        // Menampilkan hasil respons jika berhasil
        console.log('Item berhasil diperbarui:', response.data);
        return response.data;
    } catch (error) {
        // Menangkap dan menampilkan error dengan lebih detail
        console.error('Error memperbarui item dalam cart:', error.response ? error.response.data : error.message);
        
        // Tambahkan pengecekan jika ada respons dari server
        if (error.response) {
            console.log('Status:', error.response.status); // Menampilkan status error
            console.log('Data:', error.response.data);     // Menampilkan data error dari server
        }
        
        throw error; // Melempar error untuk ditangani di tempat lain
    }
};





// Clear Cart 
export const clearCart = async () => {
    const response = await axiosInstance.post('/carts/clear');
    return response.data;
};

// Fungsi untuk menghapus item dari cart// cartApiService.js
export const deleteItemFromCart = async (cartId, itemId) => {
    try {
        const response = await axiosInstance.delete(`/carts/item/${cartId}/${itemId}`);
        console.log('Item berhasil dihapus dari cart:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error menghapus item dari cart:', error.response ? error.response.data : error.message);
        throw error;
    }
};
