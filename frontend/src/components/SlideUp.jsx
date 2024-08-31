import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCartForCurrentUserThunk, clearCartThunk } from '../redux/slices/cartSlice';
import { saveCartThunk, getAllSaveCartsThunk } from '../redux/slices/cartSaveSlice';
import { fetchAllUsers } from '../redux/slices/authSlice';
import PropTypes from 'prop-types';
import { setTotalPrice } from '../redux/slices/paymentSlice';

const SlideUp = ({ isVisible, onToggle }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.carts.currentCart || { items: [] });
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('Pelanggan Setia');
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    dispatch(fetchCartForCurrentUserThunk());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAllUsers())
      .then((response) => {
        console.log('Fetched users:', response);
        setCustomers([{ _id: 'default', name: 'Pelanggan Setia', email: '', phone: '', debt: 0 }, ...response.payload]); // Tambahkan "Pelanggan Setia"
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, [dispatch]);

  const handleClearCart = () => {
    dispatch(clearCartThunk())
      .then((response) => {
        alert('Cart cleared successfully!');
        console.log('Success response:', response);
      })
      .catch((error) => {
        alert('Failed to clear the cart.');
        console.error('Error caught:', error);
      });
  };

  const handleSaveCart = () => {
    if (cart.items.length === 0) {
      alert('Cart is empty, unable to save');
      return;
    }

    dispatch(saveCartThunk())
      .then((response) => {
        alert('Cart saved successfully!');
        console.log('Success response:', response);

        dispatch(getAllSaveCartsThunk())
          .then((response) => {
            console.log('All saved carts:', response);
          })
          .catch((error) => {
            console.error('Error fetching saved carts:', error);
          });

        onToggle();
      })
      .catch((error) => {
        alert('Failed to save the cart.');
        console.error('Error caught:', error);
      });
  };

  const navigate = useNavigate();
  const handlePayment = () => {
    dispatch(setTotalPrice(cart.totalPrice || 0));
    navigate('/payment');
    onToggle();
  };

  const handleCustomerClick = () => setPopupVisible(true);

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer.name);
    setPopupVisible(false);
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price) => `Rp. ${price.toLocaleString('id-ID')}`;

  const cartItems = cart.items || [];
  const note = cart.note || '';
  const discount = cart.discount || 0;
  const additionalText = cart.additionalText || '';
  const additionalPrice = cart.additionalPrice || 0;
  const totalProduct = cart.totalProduct || 0;
  const totalQuantity = cart.totalQuantity || 0;
  const totalPrice = cart.totalPrice || 0;

  return (
    <div>
      <div
        className={`z-50 fixed bottom-0 left-0 w-full h-full bg-gray-300 p-4 transition-transform duration-500 ease-in-out ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold cursor-pointer" onClick={handleCustomerClick}>
            Pembeli: {selectedCustomer}
          </h2>
          <button className="text-red-500" onClick={onToggle}>
            Close
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className="bg-yellow-200 p-4 rounded-md text-center text-lg font-semibold">CART MASIH KOSONG :)</span>
          </div>
        ) : (
          <div className="overflow-y-auto max-h-[500px]">
            <ul>
              {cartItems.map((item) => (
                <li key={item._id} className="bg-white p-2 rounded-xl mb-2 flex justify-between">
                  <div>
                    <span>{item.product.name}</span>
                    <br />
                    <span>{item.product.quantity} x {formatPrice(item.product.price)}</span>
                  </div>
                  <div className="text-right">
                    <span>{formatPrice(item.product.totalPriceProduct)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {cartItems.length > 0 && (
          <>
            <div>
              <div className="bg-white p-2 rounded-xl mb-2 flex justify-between mt-1">
                <div>
                  <span>{additionalText}</span>
                  <br />
                  <span>{formatPrice(additionalPrice)}</span>
                </div>
                <div className="text-right">additionalTotal</div>
              </div>
            </div>

            <div className="mt-2 bg-white p-2 rounded-xl mb-2 text-center">
              <span>Note: {note}</span>
              <br />
              <span>Potongan: {formatPrice(discount)}</span>
            </div>

            <div className="flex space-x-12 text-center mb-2">
              <div className="bg-warna3 w-full rounded-md">Total Product: {totalProduct}</div>
              <div className="bg-warna3 w-full rounded-md">Total Quantity: {totalQuantity}</div>
            </div>

            <div className="bg-white p-2 rounded-xl mb-2 text-center">
              <span>Total: {formatPrice(totalPrice)}</span>
            </div>

            <div className="fixed bottom-4 left-4 right-4 flex justify-between items-center">
              <button onClick={handleClearCart} className="bg-red-500 w-[70px] text-white p-2">hapus</button>
              <button onClick={handleSaveCart} className="bg-blue-500 w-[120px] text-white p-2">Simpan</button>
              <button onClick={handlePayment} className="bg-green-500 w-[180px] text-white p-2">Bayar</button>
            </div>
          </>
        )}
      </div>

      {/* Popup untuk memilih pelanggan */}
      {isPopupVisible && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg w-[300px] max-h-[80%] overflow-y-auto">
            <input
              type="text"
              placeholder="Cari pelanggan..."
              className="w-full p-2 border border-gray-300 rounded mb-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul>
              {filteredCustomers.map((customer) => (
                <li
                  key={customer._id}
                  className="p-2 border-b cursor-pointer hover:bg-gray-100"
                  onClick={() => handleCustomerSelect(customer)}
                >
                  {customer.name}
                </li>
              ))}
            </ul>
            <button
              className="mt-2 bg-red-500 text-white p-2 rounded"
              onClick={() => setPopupVisible(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Validasi PropTypes
SlideUp.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default SlideUp;
