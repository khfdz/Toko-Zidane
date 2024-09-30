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

  const handleNoteToggle = () => {
    setNoteVisible(!isNoteVisible);
  };

    // Tambahkan handler untuk memperbarui catatan


  const isValidNote = (note) => {
    return note && note.trim() !== '' && note !== '0' && note !== '.' && note !== 'aa' && note !== 'bb';
  };

  const handleClearCart = async () => {
    try {
      await dispatch(clearCartThunk());
      alert('Keranjang berhasil dibersihkan!');
    } catch (error) {
      alert('Gagal membersihkan keranjang.');
      console.error('Error caught:', error);
    }
  };

  const handleDiscountToggle = () => {
    setDiscountVisible(!isDiscountVisible);
  };

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

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price) => `Rp. ${price.toLocaleString('id-ID')}`;
  const combinedItems = [...(cart.items || []), ...(cart.additionalItems || [])];

  return (
    <div>
      <div
        className={`z-50 fixed bottom-0 left-0 w-full h-full bg-gray-300 p-4  transition-transform duration-500 ease-in-out ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
      >
<div className="flex justify-between items-center mb-4">
  <h2 
    className="text-md text-black font-semibold cursor-pointer bg-white drop-shadow-md p-2 rounded-md" 
    onClick={handleCustomerClick}
  >
    {selectedCustomer || cart.customer?.name || ''}
  </h2>
  
  <div className="flex space-x-2"> {/* Mengelompokkan tombol */}
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
      className="text-white font-md bg-warna1 font-bold w-8 h-8 rounded-md" 
      onClick={onToggle}
      title="Tutup"
    >
      X
    </button>
  </div>
</div>


        {combinedItems.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className="bg-yellow-200 p-4 rounded-md text-center text-lg font-semibold">CART MASIH KOSONG :)</span>
          </div>
        ) : (
          <div className="overflow-y-auto max-h-[500px] mb-2 drop-shadow-md rounded-xl">
            <ul>
              {combinedItems.map((item) => (
                <li key={item._id} className="bg-white p-2 rounded-xl mb-2 flex justify-between">
                  <div>
                    <span>{item.product.name}</span>
                    <br />
                    <span>{item.product.quantity} x {formatPrice(item.product.price)}</span>
                  </div>
                  <div className="text-right mt-2">
                    <span>{formatPrice(item.product.totalPriceProduct || item.product.price * item.product.quantity)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {combinedItems.length > 0 && (
          <>
            {cart.additionalText && cart.additionalPrice > 0 && (
              <div className="bg-white p-2 rounded-xl mb-2 flex justify-between -mt-2">
                <div>
                  <span>{cart.additionalText}</span>
                  <br />
                  <span>{formatPrice(cart.additionalPrice)}</span>
                </div>
                <div className="text-right">additionalTotal</div>
              </div>
            )}

            <div className="flex space-x-12 text-center mb-3 text-black drop-shadow-md">
              <div className="bg-white w-full rounded-md font-semibold p-1">Jenis: {cart.totalProduct || 0} item</div>
              <div className="bg-white w-full rounded-md font-semibold p-1">Total: {cart.totalQuantity || 0} item</div>
            </div>

            {(cart.note || cart.discount > 0) && (
              <div className="mt-2 bg-white p-2 rounded-xl mb-2">
                <div className="flex justify-between items-center">
                  <p>Total Sementara:</p>
                  <span>{formatPrice(cart.subTotal || 0)}</span>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className='w-[230px] break-words'>
                      Diskon: {cart.discountText}
                    </span>
                    <span>- {formatPrice(cart.discount)}</span>
                  </div>
                )}
              </div>
            )}

            <div className="bg-white drop-shadow-md font-semibold p-2 rounded-xl mb-2 text-center">
              <span>Total: {formatPrice(cart.totalPrice || 0)}</span>
            </div>

            {isValidNote(cart.note) && (
  <div className="bg-white p-2 rounded-xl mb-2 text-left">
    <span>Catatan: {cart.note}</span>
  </div>
)}

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
              <button onClick={() => setPopupVisible(false)} className="mt-2 bg-gray-300 p-2 rounded">Close</button>
            </div>
          </div>
        )}

        {isDiscountVisible && (
          <DiscountView onClose={handleDiscountToggle} />
        )}

{isNoteVisible && (
  <NoteView 
    onClose={handleNoteToggle} 
    initialNote={cart.note} // Mengirim catatan yang ada ke NoteView
  />
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
