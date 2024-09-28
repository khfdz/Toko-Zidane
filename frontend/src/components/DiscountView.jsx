import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch } from 'react-redux'; // Import useDispatch dari Redux
import { AddNoteAndDiscount } from '../redux/api/cartApiService'; // Import fungsi API

const DiscountView = ({ onClose, items }) => {
  const dispatch = useDispatch(); // Gunakan dispatch Redux
  const [isDiscountActive, setIsDiscountActive] = useState(false);
  const [discountValue, setDiscountValue] = useState('');
  const [discountName, setDiscountName] = useState(''); // State untuk nama diskon

  // Fungsi untuk memformat harga dengan titik sebagai pemisah ribuan
  const formatCurrency = (value) => {
    const numericValue = value.replace(/\D/g, ''); // Hanya ambil angka dari input
    const formattedValue = Number(numericValue).toLocaleString('id-ID');
    return `Rp.${formattedValue}`;
  };

  const handleApplyDiscount = async () => {
    if (discountValue && discountName) {
      try {
        // Panggil AddNoteAndDiscount menggunakan dispatch Redux
        const result = await dispatch(AddNoteAndDiscount({
          items, // Kirim item yang diterima dari props
          note: discountName,
          discount: Number(discountValue.replace(/\D/g, '')), // Ambil nilai numerik diskon
          discountText: discountName,
        }));
        alert(`Diskon "${discountName}" berhasil diterapkan!`);
        console.log(result);
        onClose(); // Tutup modal setelah berhasil
      } catch (error) {
        console.error('Error saat menerapkan diskon:', error);
        alert('Gagal menerapkan diskon. Silakan coba lagi.');
      }
    }
  };

  const handleDiscountValueChange = (e) => {
    const rawValue = e.target.value;
    setDiscountValue(formatCurrency(rawValue)); // Format harga langsung di input
  };

  const toggleDiscount = () => {
    setIsDiscountActive(!isDiscountActive);
    if (!isDiscountActive) {
      setDiscountValue('');
      setDiscountName(''); // Reset nilai diskon dan nama diskon saat dinonaktifkan
    }
  };

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
              className="bg-warna3 text-white p-2 rounded w-full"
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
  items: PropTypes.array.isRequired, // Terima items sebagai prop
};

export default DiscountView;
