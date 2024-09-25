import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

const PaymentInput = ({ payment, onChange }) => {
  const [displayValue, setDisplayValue] = useState(payment);

  useEffect(() => {
    // Update displayValue when payment changes
    setDisplayValue(payment ? `Rp. ${Number(payment).toLocaleString('id-ID')}` : '');
  }, [payment]);

  const handleChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    setDisplayValue(rawValue ? `Rp. ${Number(rawValue).toLocaleString('id-ID')}` : ''); // Format the value with "Rp."
    onChange(rawValue); // Call the parent onChange with the raw value
  };

  return (
    <div className="mb-4">
      <p className="text-lg font-semibold bg-warna2 text-center ">Bayar:</p>
      <input
  type="text"
  placeholder="Masukkan jumlah pembayaran"
  value={displayValue}
  onChange={handleChange}
  className="w-full p-2 border-2 border-warna2 rounded-md text-xl font-semibold focus:outline-none text-center" // Adjusted border thickness
/>

    </div>
  );
};

PaymentInput.propTypes = {
  payment: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PaymentInput;
