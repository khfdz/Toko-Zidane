import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

const PaymentInput = ({ payment, onChange, formatPrice }) => {
  const [displayValue, setDisplayValue] = useState(payment);

  useEffect(() => {
    // Update displayValue when payment changes
    setDisplayValue(formatPrice(Number(payment))); // Pastikan payment adalah angka
  }, [payment, formatPrice]);

  const handleChange = (e) => {
    // Strip non-numeric characters and update the raw payment value
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    const numericValue = Number(rawValue); // Konversi ke angka

    setDisplayValue(formatPrice(numericValue)); // Update display value dengan format
    onChange(numericValue); // Panggil onChange handler dengan nilai numerik
  };

  return (
    <div className="mb-4">
      <p className="text-lg font-semibold">Bayar:</p>
      <input
        type="text"
        placeholder="Masukkan jumlah pembayaran"
        value={displayValue}
        onChange={handleChange}
        className="w-full p-2 border rounded-md"
      />
    </div>
  );
};

PaymentInput.propTypes = {
  payment: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  formatPrice: PropTypes.func.isRequired,
};

export default PaymentInput;
