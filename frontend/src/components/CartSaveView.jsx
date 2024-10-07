import React from 'react';

const CartSaveView = ({ onClose }) => {
  // Dummy data untuk simulasi
  const savedCart = {
    id: "6701277267474aa956814217",
    totalPrice: 194652,
    savedAt: "2024-10-05T11:48:02.982Z"
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-xl mx-auto mt-10 relative">
      <h2 className="text-xl font-bold mb-4">Saved Cart Details</h2>
      
      {/* Tombol Close */}
      <button 
        onClick={onClose} 
        className="absolute top-2 right-2 text-white bg-red-500 hover:bg-red-600 rounded-full px-3 py-1"
      >
        Close
      </button>

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
    </div>
  );
};

export default CartSaveView;
