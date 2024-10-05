import { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import PropTypes from 'prop-types';
import CartEdit from './CartEdit';
import { deleteItemFromCart, editCartItemById } from "../redux/api/cartApiService";

const CartItem = ({ item, cartId, handleUpdateCart, discount }) => {
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedItem, setUpdatedItem] = useState(item);

  useEffect(() => {
    setUpdatedItem(item);
  }, [item]);

  const formatPrice = (price) => `Rp. ${price?.toLocaleString('id-ID') || '0'}`;

  const handlers = useSwipeable({
    onSwipedLeft: () => setShowActions(true),
    onSwipedRight: () => setShowActions(false),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const handleEdit = () => {
    setIsEditing(true);
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

  const calculateFinalPrice = () => {
    const itemTotal = item.product.price * item.product.quantity;
    return discount ? itemTotal - (itemTotal * (discount / 100)) : itemTotal;
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      await editCartItemById(cartId, item._id, updatedData);
      setUpdatedItem(updatedData);  // Update the item with new values
      handleUpdateCart();  // Refresh the cart
      setIsEditing(false);  // Close edit modal
    } catch (error) {
      console.error('Error saving edited item:', error);
    }
  };

  return (
    <div {...handlers} className="relative overflow-hidden bg-white p-2 rounded-xl mb-2 flex justify-between">
      <div className={`absolute right-0 top-0 h-full flex items-center space-x-2 bg-gray-200 p-2 transition-transform duration-300 ${showActions ? 'translate-x-0' : 'translate-x-full'}`}>
        <button className="bg-green-500 text-white px-3 py-1 rounded">+</button>
        <button className="bg-yellow-500 text-white px-3 py-1 rounded">-</button>
        <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={handleDelete}>Delete</button>
      </div>

      <div className="flex justify-between items-center w-full" onClick={handleEdit}>
        <div className="cursor-pointer w-full">
          <span>{updatedItem?.product?.name || 'Nama Produk Tidak Ada'}</span>
          <br />
          <span>{updatedItem?.product?.quantity || 0} x {formatPrice(updatedItem?.product?.price)}</span>
          <br />
          <span className="text-sm text-gray-600">ID Produk: {item._id || 'ID Produk Tidak Ada'}</span>
        </div>
        <div className="text-right">
          <span className="font-bold">{formatPrice(calculateFinalPrice())}</span>
        </div>
      </div>

      {isEditing && (
        <CartEdit
          item={updatedItem}
          cartId={cartId}
          onClose={() => setIsEditing(false)}
          onSave={handleSaveEdit}  // Pass the save handler to CartEdit
          isAdditional={false}
        />
      )}
    </div>
  );
};

CartItem.propTypes = {
  item: PropTypes.object.isRequired,
  cartId: PropTypes.string.isRequired,
  handleUpdateCart: PropTypes.func.isRequired,
  discount: PropTypes.number,
};

export default CartItem;
