import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'; 
import { addDiscountThunk, fetchCartForCurrentUserThunk } from '../redux/slices/cartSlice';

const DiscountView = ({ onClose, discount, discountText }) => {
  const dispatch = useDispatch(); 
  const [isDiscountActive, setIsDiscountActive] = useState(false);
  const [discountValue, setDiscountValue] = useState('');
  const [discountName, setDiscountName] = useState('');

  const formatCurrency = (value) => {
    const numericValue = value.replace(/\D/g, ''); 
    const formattedValue = Number(numericValue).toLocaleString('id-ID');
    return `Rp.${formattedValue}`;
  };

  const handleDiscountValueChange = (e) => {
    const rawValue = e.target.value;
    setDiscountValue(formatCurrency(rawValue));
  };

  const handleApplyDiscount = async () => {
    if (discountValue && discountName) {
      try {
        await dispatch(addDiscountThunk({
          discount: Number(discountValue.replace(/\D/g, '')),
          discountText: discountName,
        }));

        alert(`Diskon "${discountName}" berhasil diterapkan!`);

        await dispatch(fetchCartForCurrentUserThunk());
        onClose(); 
      } catch (error) {
        console.error('Error saat menerapkan diskon:', error);
        alert('Gagal menerapkan diskon. Silakan coba lagi.');
      }
    }
  };

  const toggleDiscount = async () => {
    setIsDiscountActive(!isDiscountActive);

    if (!isDiscountActive) {
      setDiscountValue('');
      setDiscountName('');
    } else {
      await dispatch(addDiscountThunk({
        discount: 0, // Kirimkan nilai 0 jika menonaktifkan diskon
        discountText: '',
      }));

      await dispatch(fetchCartForCurrentUserThunk());
      onClose();
    }
  };

  useEffect(() => {
    if (discount > 0 && discountText) {
      setDiscountValue(formatCurrency(discount.toString()));
      setDiscountName(discountText);
      setIsDiscountActive(true);
    }
  }, [discount, discountText]);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg w-[90%] max-w-md">
        <h2 className="text-lg font-semibold mb-4">Diskon</h2>

        <div className="flex items-center justify-between mb-4">
          <label htmlFor="discountToggle" className="font-semibold">
            {isDiscountActive ? 'Diskon Aktif' : 'Diskon Tidak Aktif'}
          </label>
          <input
            type="checkbox"
            id="discountToggle"
            checked={isDiscountActive}
            onChange={toggleDiscount}
            className="h-5 w-5"
          />
        </div>

        {isDiscountActive && (
          <>
            <input
              type="text"
              placeholder="Masukkan nilai diskon..."
              value={discountValue}
              onChange={handleDiscountValueChange}
              className="border border-gray-300 p-2 rounded w-full mb-4"
            />
            <input
              type="text"
              placeholder="Masukkan nama diskon..."
              value={discountName}
              onChange={(e) => setDiscountName(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full mb-4"
            />
            <button
              onClick={handleApplyDiscount}
              className="bg-warna3 text-white p-2 rounded w-full mb-2"
            >
              Terapkan
            </button>
          </>
        )}

        <button onClick={onClose} className="mt-2 bg-warna5 text-white p-2 rounded w-full">
          Tutup
        </button>
      </div>
    </div>
  );
};

DiscountView.propTypes = {
  onClose: PropTypes.func.isRequired,
  discount: PropTypes.number,
  discountText: PropTypes.string,
};

export default DiscountView;
