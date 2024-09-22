import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCartForCurrentUserThunk, clearCartThunk, editCartByIdThunk } from '../redux/slices/cartSlice';
import { saveCartThunk, getAllSaveCartsThunk } from '../redux/slices/cartSaveSlice';
import { fetchAllUsers } from '../redux/slices/authSlice';
import PropTypes from 'prop-types';

const SlideUp = ({ isVisible, onToggle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.carts.currentCart || { items: [] });
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState(''); // Tetap gunakan customerId
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    dispatch(fetchCartForCurrentUserThunk());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAllUsers())
      .then((response) => {
        console.log('Fetched users:', response);
        // Mengambil nama dan ID pelanggan
        const customerNames = response.payload.map(user => ({ _id: user._id, name: user.name }));
        setCustomers([{ _id: 'default', name: 'Pelanggan Setia' }, ...customerNames]);
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

  const handlePayment = () => {
    // Contoh: Gunakan selectedCustomerId untuk keperluan pembayaran jika dibutuhkan
    console.log('Customer ID:', selectedCustomerId);
    navigate('/payment');
    onToggle();
  };

  const handleCustomerClick = () => setPopupVisible(true);

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer.name); // Set nama pelanggan
    setSelectedCustomerId(customer._id); // Set ID pelanggan
    setPopupVisible(false);

    // Update keranjang dengan nama dan ID pelanggan
    if (cart._id) {
      const payload = { 
        id: cart._id, 
        updates: { 
          customerName: customer.name, // Simpan nama pelanggan
          customerId: customer._id     // Simpan ID pelanggan
        } 
      };
      dispatch(editCartByIdThunk(payload))
        .then((response) => {
          console.log('Cart updated with new customer:', response);
        })
        .catch((error) => {
          console.error('Error updating cart:', error);
        });
    }
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
  const customerName = selectedCustomer || cart.customerName || 'Pelanggan Setia';

  return (
    <div>
      <div
        className={`z-50 fixed bottom-0 left-0 w-full h-full bg-gray-300 p-4 transition-transform duration-500 ease-in-out ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex justify-between items-center mb-4 ">
          <h2 className="text-md text-black font-semibold cursor-pointer bg-warna2 p-2 rounded-md" onClick={handleCustomerClick}>
            Nama Pembeli: {customerName}
          </h2>

          <button className="text-white font-md bg-warna1 font-bold w-8 h-8 rounded-md" onClick={onToggle}>
            X
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className="bg-yellow-200 p-4 rounded-md text-center text-lg font-semibold">CART MASIH KOSONG :)</span>
          </div>
        ) : (
          <div className="overflow-y-auto max-h-[500px] mb-2  ">
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
    {/* Conditional rendering for additionalText and additionalPrice */}
    {additionalText && additionalPrice > 0 && (
      <div className="bg-white p-2 rounded-xl mb-2 flex justify-between mt-1">
        <div>
          <span>{additionalText}</span>
          <br />
          <span>{formatPrice(additionalPrice)}</span>
        </div>
        <div className="text-right">additionalTotal</div>
      </div>
    )}

    {/* Conditional rendering for note and discount */}
    {(note || discount > 0) && (
      <div className="mt-2 bg-white p-2 rounded-xl mb-2 text-center">
        {note && <span>Note: {note}</span>}
        {note && <br />}
        {discount > 0 && <span>Potongan: {formatPrice(discount)}</span>}
      </div>
    )}

    <div className="flex space-x-12 text-center mb-3 text-black">
      <div className="bg-warna2 w-full rounded-md font-semibold p-1">Jenis: {totalProduct} item</div>
      <div className="bg-warna2 w-full rounded-md font-semibold p-1">Total: {totalQuantity} item</div>
    </div>

    <div className="bg-warna2 font-semibold p-2 rounded-xl mb-2 text-center">
      <span>Total: {formatPrice(totalPrice)}</span>
    </div>

    <div className="fixed bottom-4 left-4 right-4 flex justify-between items-center font-semibold">
      <button onClick={handleClearCart} className="bg-warna2 text-gray-800 w-[70px] p-2 rounded-md">Hapus</button>
      <button onClick={handleSaveCart} className="bg-warna3 w-[120px] text-white p-2 rounded-md">Simpan</button>
      <button onClick={handlePayment} className="bg-warna1 w-[180px] text-white p-2 rounded-md">Bayar</button>
    </div>
  </>
)}

        {isPopupVisible && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg w-[90%] max-w-md">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search customer..."
                className="border border-gray-300 p-2 rounded w-full"
              />
              <ul>
                {filteredCustomers.map((customer) => (
                  <li
                    key={customer._id}
                    onClick={() => handleCustomerSelect(customer)}
                    className="cursor-pointer p-2 hover:bg-gray-200"
                  >
                    {customer.name}
                  </li>
                ))}
              </ul>
              <button onClick={() => setPopupVisible(false)} className="mt-2 bg-gray-500 text-white p-2 rounded">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

SlideUp.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default SlideUp;
