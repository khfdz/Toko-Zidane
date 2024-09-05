import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserById } from '../redux/slices/authSlice'; // Pastikan fungsi ini ada

const PaymentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Ambil data dari Redux store
  const totalPrice = useSelector((state) => state.carts.currentCart.totalPrice);
  const customerId = useSelector((state) => state.carts.currentCart.customerId); // Ambil ID customer dari cart
  const [payment, setPayment] = useState('');
  const [change, setChange] = useState(0);
  const [debt, setDebt] = useState(0);
  const [suggestedPayments, setSuggestedPayments] = useState([]);
  const [customerName, setCustomerName] = useState('');

  useEffect(() => {
    // Ambil data user berdasarkan ID customer dari cart
    dispatch(fetchUserById(customerId))
      .then((response) => {
        const user = response.payload;
        setCustomerName(user.name);
        setDebt(user.debt);
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
      });
  }, [dispatch, customerId]);

  const handleToTransactionPage = () => {
    navigate('/transaksi');
  };

  const calculateChangeAndDebt = (paymentValue) => {
    const changeAmount = paymentValue - totalPrice;
    setChange(changeAmount >= 0 ? changeAmount : 0);
    setDebt(changeAmount < 0 ? Math.abs(changeAmount) : debt);
  };

  const handlePaymentChange = (e) => {
    const paymentValue = Number(e.target.value);
    setPayment(paymentValue);
    calculateChangeAndDebt(paymentValue);
  };

  const handleQuickPayment = (amount) => {
    setPayment(amount);
    calculateChangeAndDebt(amount);
  };

  useEffect(() => {
    const pecahanUang = [500, 1000, 2000, 5000, 10000, 20000, 50000, 100000];
    let suggestions = new Set();
    suggestions.add(totalPrice);

    pecahanUang.forEach((pecahan) => {
      let nextPayment = Math.ceil(totalPrice / pecahan) * pecahan;
      if (nextPayment >= totalPrice) {
        suggestions.add(nextPayment);
      }
    });

    const sortedSuggestions = [...suggestions].sort((a, b) => a - b);
    setSuggestedPayments(sortedSuggestions);
  }, [totalPrice]);

  const handlePay = () => {
    alert('Pembayaran berhasil!');
    navigate('/transaksi');
  };

  const handleCicilHutang = () => {
    alert('Kembalian digunakan untuk mencicil hutang!');
    navigate('/transaksi');
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <button className="absolute top-4 right-4 bg-warna3 p-1 rounded-md" onClick={handleToTransactionPage}>
        Kembali
      </button>
      <h1 className="text-2xl font-bold mb-6 text-center">Pembayaran</h1>

      <div className="mb-4">
        <p className="text-lg font-semibold">Nama Pembeli:</p>
        <p className="text-xl font-bold">{customerName}</p> {/* Menggunakan customerName langsung */}
      </div>

      <div className="mb-4">
        {debt === 0 ? (
          <p className="text-green-600">Pelanggan tidak mempunyai hutang, yeay!</p>
        ) : (
          <p className="text-red-600">Pelanggan mempunyai hutang: {formatPrice(debt)}</p>
        )}
      </div>

      <div className="mb-4">
        <p className="text-lg font-semibold">Total Price:</p>
        <p className="text-xl font-bold text-warna3">{formatPrice(totalPrice)}</p>
      </div>

      <div className="mb-4">
        <p className="text-lg font-semibold">Bayar:</p>
        <input
          type="number"
          placeholder="Masukkan jumlah pembayaran"
          value={payment}
          onChange={handlePaymentChange}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        {suggestedPayments.map((amount, index) => (
          <button
            key={index}
            className="bg-gray-200 p-2 rounded-md text-center"
            onClick={() => handleQuickPayment(amount)}
          >
            {amount === totalPrice ? 'UANG PAS' : formatPrice(amount)}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <p className="text-lg font-semibold">Kembalian:</p>
        <p className="text-xl font-bold text-green-600">{formatPrice(change)}</p>
      </div>

      {debt > 0 && (
        <p className="text-red-500">Uang yang dibayarkan kurang. Silakan tambah jumlah pembayaran.</p>
      )}

      {change === 0 && debt === 0 && (
        <button className="bg-blue-500 text-white w-full p-2 rounded-md" onClick={handlePay}>
          Bayar
        </button>
      )}

      {change > 0 && debt === 0 && (
        <button className="bg-blue-500 text-white w-full p-2 rounded-md" onClick={handlePay}>
          Bayar
        </button>
      )}

      {debt > 0 && change > 0 && (
        <div className="mb-4">
          <p className="text-lg font-semibold text-yellow-600">Apakah ingin menggunakan kembalian untuk mencicil hutang?</p>
          <button className="bg-blue-500 text-white w-full p-2 rounded-md mt-2" onClick={handleCicilHutang}>
            Ya, cicil hutang
          </button>
          <button className="bg-red-500 text-white w-full p-2 rounded-md mt-2" onClick={handlePay}>
            Tidak, bayar saja
          </button>
        </div>
      )}
    </div>
  );
};

const formatPrice = (price) => {
  return `Rp. ${price.toLocaleString('id-ID')}`;
};

export default PaymentPage;
