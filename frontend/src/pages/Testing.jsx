import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editCartByIdThunk, fetchCartForCurrentUserThunk } from '../redux/slices/cartSlice';

const Testing = () => {
  const dispatch = useDispatch();
  const currentCart = useSelector((state) => state.carts.currentCart);
  const [customerName, setCustomerName] = useState('');
  const [dataToSend, setDataToSend] = useState({ id: '', customerName: '' });

  useEffect(() => {
    dispatch(fetchCartForCurrentUserThunk());
  }, [dispatch]);

  useEffect(() => {
    if (currentCart) {
      setCustomerName(currentCart.customerName || '');
      setDataToSend({
        id: currentCart._id,
        customerName: currentCart.customerName || '',
      });
    }
  }, [currentCart]);


  const handleSave = () => {
    if (dataToSend.id && dataToSend.customerName) {
      const updates = { customerName: dataToSend.customerName };
      const payload = { id: dataToSend.id, updates }; // Format yang benar
      console.log('Data to send:', payload); // Debugging log
      dispatch(editCartByIdThunk(payload))
        .then((response) => {
          console.log('Response after edit:', response);
        })
        .catch((error) => {
          console.error('Error editing cart:', error);
        });
    } else {
      console.error('Data to send is incomplete');
    }
  };
  

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Cart</h1>
      <div className="mb-4">
        <label className="block text-gray-700">Customer Name</label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => {
            setCustomerName(e.target.value);
            setDataToSend((prev) => ({
              ...prev,
              customerName: e.target.value,
            }));
          }}
          className="mt-1 p-2 border border-gray-300 rounded w-full"
        />
      </div>
      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Save
      </button>
      {currentCart && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Cart Details</h2>
          <p><strong>ID:</strong> {currentCart._id}</p>
          <p><strong>Note:</strong> {currentCart.note}</p>
          <p><strong>Total Price:</strong> {currentCart.totalPrice}</p>
          <p><strong>Total Quantity:</strong> {currentCart.totalQuantity}</p>
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Items</h3>
            {currentCart.items.map((item) => (
              <div key={item._id} className="border p-2 mb-2 rounded">
                <p><strong>Product Name:</strong> {item.product.name}</p>
                <p><strong>Price:</strong> {item.product.price}</p>
                <p><strong>Quantity:</strong> {item.product.quantity}</p>
                <p><strong>Total Price for Product:</strong> {item.product.totalPriceProduct}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Testing;
