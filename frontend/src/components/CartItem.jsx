import { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import CartEdit from './CartEdit';
import { deleteItemFromCart } from "../redux/api/cartApiService";

const CartItem = ({ item, cartId, handleUpdateCart }) => {
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const formatPrice = (price) => `Rp. ${price.toLocaleString('id-ID')}`;

  const handlers = useSwipeable({
    onSwipedLeft: () => setShowActions(true),
    onSwipedRight: () => setShowActions(false),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const handleEdit = () => setIsEditing(true);

  const handleSave = (updatedItem) => {
    setIsEditing(false);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Apakah Anda yakin ingin menghapus item ini?");
    if (confirmed) {
      try {
        await deleteItemFromCart(cartId, item._id);
        handleUpdateCart();
        setShowActions(false);
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  useEffect(() => {
    setShowActions(false);
  }, [item]);

  return (
    <div {...handlers} className="relative overflow-hidden bg-white p-2 rounded-xl mb-2 flex justify-between">
      <div
        className={`absolute right-0 top-0 h-full flex items-center space-x-2 bg-gray-200 p-2 transition-transform duration-300 ${
          showActions ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button className="bg-green-500 text-white px-3 py-1 rounded">+</button>
        <button className="bg-yellow-500 text-white px-3 py-1 rounded">-</button>
        <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={handleDelete}>Delete</button>
      </div>

      <div className="flex justify-between w-full">
        <div onClick={handleEdit} className="cursor-pointer">
          <span>{item.product.name}</span>
          <br />
          <span>{item.product.quantity} x {formatPrice(item.product.price)}</span>
        </div>
        <div className="text-right mt-2">
          <span>{formatPrice(item.product.totalPriceProduct || item.product.price * item.product.quantity)}</span>
        </div>
      </div>

      {isEditing && (
        <CartEdit item={item} onClose={() => setIsEditing(false)} onSave={handleSave} />
      )}
    </div>
  );
};

export default CartItem;
