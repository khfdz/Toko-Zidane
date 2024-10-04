import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  fetchCartForCurrentUserThunk, 
  clearCartThunk, 
  editCartByIdThunk 
} from '../redux/slices/cartSlice';
import { saveCartThunk, getAllSaveCartsThunk } from '../redux/slices/cartSaveSlice';
import { fetchAllUsers } from '../redux/slices/authSlice';
import PropTypes from 'prop-types';
import DiscountView from '../components/DiscountView';
import NoteView from '../components/NoteView';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import CustomerPopup from './CustomerPopup';

const SlideUp = ({ isVisible, onToggle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.carts.currentCart || { items: [] });

  const [isPopupVisible, setPopupVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [customers, setCustomers] = useState([]);
  const [isDiscountVisible, setDiscountVisible] = useState(false);
  const [isNoteVisible, setNoteVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchCartForCurrentUserThunk());
        const response = await dispatch(fetchAllUsers());
        const customerNames = response.payload.map(user => ({ _id: user._id, name: user.name }));
        setCustomers([{ _id: 'default', name: 'Pelanggan Setia' }, ...customerNames]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [dispatch]);

  const handleUpdateCart = async () => {
    await dispatch(fetchCartForCurrentUserThunk());
  };

  const handleNoteToggle = () => setNoteVisible(!isNoteVisible);

  const isValidNote = (note) => note && note.trim() !== '' && note !== '0' && note !== '.' && note !== 'aa' && note !== 'bb';

  const handleClearCart = async () => {
    try {
      await dispatch(clearCartThunk());
      await dispatch(fetchCartForCurrentUserThunk());
      alert('Keranjang berhasil dibersihkan!');
    } catch (error) {
      alert('Gagal membersihkan keranjang.');
      console.error('Error caught:', error);
    }
  };

  const handleDiscountToggle = () => setDiscountVisible(!isDiscountVisible);

  const handleSaveCart = async () => {
    if (cart.items.length === 0) {
      alert('Keranjang kosong, tidak bisa disimpan.');
      return;
    }

    try {
      await dispatch(saveCartThunk());
      alert('Keranjang berhasil disimpan!');
      dispatch(getAllSaveCartsThunk());
      onToggle();
    } catch (error) {
      alert('Gagal menyimpan keranjang.');
      console.error('Error caught:', error);
    }
  };

  const handlePayment = () => {
    navigate('/payment');
    onToggle();
  };

  const handleCustomerClick = () => setPopupVisible(true);

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer.name);
    setPopupVisible(false);

    if (cart._id) {
      const payload = { 
        id: cart._id, 
        updates: { 
          customerName: customer.name
        } 
      };
      dispatch(editCartByIdThunk(payload));
    }
  };

  const combinedItems = [...(cart.items || []), ...(cart.additionalItems || [])];

  return (
    <div>
      <div
        className={`z-50 fixed bottom-0 left-0 w-full h-full bg-gray-300 p-4 transition-transform duration-500 ease-in-out ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 
            className="text-md text-black font-semibold cursor-pointer bg-white drop-shadow-md p-2 rounded-md" 
            onClick={handleCustomerClick}
          >
            {selectedCustomer || cart.customer?.name || ''}
          </h2>
          
          <div className="flex space-x-2">
            <button 
              className="text-white font-md bg-warna3 font-bold w-8 p-1 h-8 rounded-md" 
              onClick={handleNoteToggle}
              title="Tambahkan Catatan"
            >
              N
            </button>
            <button 
              className="text-white font-md bg-warna3 font-bold w-8 p-1 h-8 rounded-md" 
              onClick={handleDiscountToggle}
              title="Terapkan Diskon"
            >
              %
            </button>
            <button 
              className="text-white font-md bg-warna1 w-8 p-1 h-8 rounded-md font-bold" 
              onClick={onToggle}
            >
              X
            </button>
          </div>
        </div>

        {/* <ul>
  {combinedItems.map((item, index) => (
    <CartItem key={`${item.product._id}-${index}`} item={item} />
  ))}
</ul> */}

<ul>
  {combinedItems.map((item, index) => (
    <CartItem 
    key={`${item.product._id}-${index}`} 
    item={item} 
    cartId={cart._id} 
    handleUpdateCart={handleUpdateCart}/>
  ))}
</ul>



        

        <CartSummary
          cart={cart}
          handleClearCart={handleClearCart}
          handleSaveCart={handleSaveCart}
          handlePayment={handlePayment}
        />
      </div>

      {isPopupVisible && (
        <CustomerPopup
          customers={customers}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleCustomerSelect={handleCustomerSelect}
          closePopup={() => setPopupVisible(false)}
        />
      )}

      {isDiscountVisible && (
        <DiscountView onClose={handleDiscountToggle} />
      )}

      {isNoteVisible && (
        <NoteView onClose={handleNoteToggle} />
      )}
    </div>
  );
};

SlideUp.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default SlideUp;
