// src/pages/CartSave.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate untuk navigasi

const CartSave = () => {
  // Dummy data untuk simulasi
  const savedCart = {
    id: "6701277267474aa956814217",
    totalPrice: 194652,
    savedAt: "2024-10-05T11:48:02.982Z"
  };

  const navigate = useNavigate(); // Inisialisasi navigate

  const handleBackClick = () => {
    navigate('/transaksi'); // Navigasi ke halaman transaksi
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-xl mx-auto mt-10 relative z-50">
      <h2 className="text-xl font-bold mb-4">Saved Cart Details</h2>

      {/* Tabel dengan informasi yang diminta */}
      <table className="w-full text-left">
        <tbody>
          <tr>
            <th className="p-2">ID:</th>
            <td className="p-2">{savedCart.id}</td>
          </tr>
          <tr>
            <th className="p-2">Total Price:</th>
            <td className="p-2">Rp {savedCart.totalPrice.toLocaleString()}</td>
          </tr>
          <tr>
            <th className="p-2">Saved At:</th>
            <td className="p-2">{new Date(savedCart.savedAt).toLocaleDateString()}</td>
          </tr>
        </tbody>
      </table>

      {/* Tombol Kembali */}
      <button 
        onClick={handleBackClick} 
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 ease-in-out"
      >
        Kembali
      </button>
    </div>
  );
};

export default CartSave;
