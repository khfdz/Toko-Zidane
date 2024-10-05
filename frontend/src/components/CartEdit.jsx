import { useState } from 'react';
import PropTypes from 'prop-types';

const CartEdit = ({ item, cartId, onClose, onSave, isAdditional }) => {
  const [name, setName] = useState(item.product.name);
  const [quantity, setQuantity] = useState(item.product.quantity);
  const [price, setPrice] = useState(item.product.price);

  const handleSave = async () => {
    try {
      const updates = {
        name,
        quantity,
        price,
      };

      if (quantity < 1) {
        alert("Quantity must be at least 1.");
        return;
      }

      if (price < 0) {
        alert("Price cannot be negative.");
        return;
      }

      // Call the parent save handler with updated data
      await onSave(updates);
    } catch (error) {
      console.error('Error updating cart:', error);
      alert("An error occurred while updating the cart. Please try again.");
    }
  };

  const handleQuantityChange = (value) => {
    setQuantity(Math.max(1, value));
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
          <span className="text-sm text-gray-600">ID Produk: {item._id}</span>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Quantity</label>
          <div className="flex items-center">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="bg-gray-300 px-4 py-2 rounded-l"
              disabled={quantity <= 1}
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              className="border p-2 w-full text-center"
            />
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="bg-gray-300 px-4 py-2 rounded-r"
            >
              +
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Price</label>
          <input
            type="text"
            value={`Rp. ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`}
            onChange={(e) => setPrice(parseFloat(e.target.value.replace(/[^0-9]/g, '')) || 0)}
            className="border p-2 w-full rounded"
          />
        </div>

        <div className="flex justify-between">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

CartEdit.propTypes = {
  item: PropTypes.object.isRequired,
  cartId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  isAdditional: PropTypes.bool.isRequired,
};

export default CartEdit;
