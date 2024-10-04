import { useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from 'prop-types';
import { addAdditionalItemsToCart } from "../redux/api/cartApiService";
import { fetchCartForCurrentUserThunk } from '../redux/slices/cartSlice';

const AdditionalView = ({ onClose, inputValue }) => {
    const dispatch = useDispatch();
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(1); // Default quantity 1

    const handleInputChange = (e) => {
        setName(e.target.value);
    };

    const increaseQuantity = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const decreaseQuantity = () => {
        setQuantity(prevQuantity => Math.max(prevQuantity - 1, 1)); // Tidak boleh kurang dari 1
    };

    const handleSave = async () => {
        if (!name) {
            alert("Nama produk tidak boleh kosong.");
            return;
        }

        const additionalItems = [
            {
                product: {
                    price: parseInt(inputValue, 10), // Gunakan nilai dari Manual sebagai harga
                    name: name,
                    quantity: quantity
                }
            }
        ];

        try {
            const response = await addAdditionalItemsToCart(additionalItems);
            console.log('Response:', response);
            dispatch(fetchCartForCurrentUserThunk());
            alert('Produk tambahan berhasil ditambahkan ke keranjang.');
            onClose(); // Menutup modal setelah berhasil menambahkan produk
        } catch (error) {
            console.error('Error menambahkan produk tambahan:', error);
            alert('Gagal menambahkan produk ke keranjang.');
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-[90%] max-w-md relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-2xl mr-2 rounded font-bold">
                    &times; {/* Simbol X untuk menutup */}
                </button>
                <div className="text-lg font-semibold mb-4 text-center">Additional View</div>
                
                <input 
                    type="text" 
                    value={name} 
                    onChange={handleInputChange} 
                    placeholder="Masukkan nama" 
                    className="border-2 border-warna2 p-2 rounded w-full mb-4" 
                />
                
                {/* Kontrol Quantity */}
                <div className="flex items-center justify-between mb-4 bg-warna2 font-bold">
                    <button 
                        onClick={decreaseQuantity} 
                        className="w-[100px] bg-warna3 text-white text-2xl font-bold p-2 rounded mt-2 ml-2 mb-2"
                    >
                        -
                    </button>
                    <span className="px-4">{quantity}</span>
                    <button 
                        onClick={increaseQuantity} 
                        className="w-[100px] bg-warna3 text-white text-2xl font-bold p-2 rounded mt-2 mr-2 mb-2"
                    >
                        +
                    </button>
                </div>
                
                <button 
                    onClick={handleSave} 
                    className="bg-warna3 text-white rounded font-semibold p-2 w-full"
                >
                    Simpan
                </button>
            </div>
        </div>
    );
};

AdditionalView.propTypes = {
    onClose: PropTypes.func.isRequired,
    inputValue: PropTypes.string.isRequired, // Menambahkan prop untuk menerima nilai input
};

export default AdditionalView;
