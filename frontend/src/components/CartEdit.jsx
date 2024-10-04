import { useState } from 'react';

const CartEdit = ({ item, onClose, onSave }) => {
  const [name, setName] = useState(item.product.name);
  const [quantity, setQuantity] = useState(item.product.quantity);
  const [price, setPrice] = useState(item.product.price);

  const handleSave = () => {
    // Lakukan sesuatu dengan data yang baru diubah
    const updatedItem = {
      ...item,
      product: {
        ...item.product,
        name,
        quantity,
        price,
      },
    };
    onSave(updatedItem); // Mengirim data yang diubah ke parent (CartItem)
    onClose(); // Tutup popup
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Item</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="border p-2 w-full rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            className="border p-2 w-full rounded"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
        </div>
      </div>
    </div>
  );
};

export default CartEdit;
