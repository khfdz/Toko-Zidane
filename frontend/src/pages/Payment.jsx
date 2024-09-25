import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCartForCurrentUserThunk } from '../redux/slices/cartSlice';
import { fetchTotalDebtByCustomerId, createNewOrder } from '../redux/slices/orderSlice';
import { createNewDebtPayment } from '../redux/slices/debtPaymentSlice'; // Ganti import ini

import CustomerInfo from '../components/CustomerInfo';
import DebtInfo from '../components/DebtInfo';
import TotalPrice from '../components/TotalPrice';
import PaymentInput from '../components/PaymentInput';
import QuickPayments from '../components/QuickPayments';
import ChangeDisplay from '../components/ChangeDisplay';
import LessDisplay from '../components/LessDisplay';
import ConfirmationDialog from '../components/ConfirmationDialog';
import PayAndDebtConfirmationDialog from '../components/PayAndDebtConfirmationDialog';

const PaymentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalPrice = useSelector((state) => state.carts.currentCart.totalPrice);
  const customer = useSelector((state) => state.carts.currentCart.customer);
  const [payment, setPayment] = useState('');
  const [change, setChange] = useState(0);
  const [debt, setDebt] = useState(0);
  const [suggestedPayments, setSuggestedPayments] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPayAndPayDebtConfirmation, setShowPayAndPayDebtConfirmation] = useState(false);
  const [less, setLess] = useState(0);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartResponse = await dispatch(fetchCartForCurrentUserThunk());
        console.log('Fetched cart for current user:', cartResponse.payload);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    if (!customer || !customer.id) {
      fetchCart();
    }
  }, [dispatch, customer]);

  useEffect(() => {
    const fetchDebt = async () => {
      if (customer && customer.id) {
        try {
          const debtResponse = await dispatch(fetchTotalDebtByCustomerId(customer.id));
          setCustomerName(customer.name);
          setDebt(debtResponse.payload.totalDebt);
        } catch (error) {
          console.error('Error fetching debt:', error);
        }
      }
    };

    fetchDebt();
  }, [dispatch, customer]);

  const handleToTransactionPage = () => {
    navigate('/transaksi');
  };

  const calculateChangeAndDebt = (paymentValue) => {
    const changeAmount = paymentValue - totalPrice;
    setChange(changeAmount >= 0 ? changeAmount : 0);
    setLess(totalPrice - paymentValue < 0 ? 0 : totalPrice - paymentValue);
  };

  const handlePaymentChange = (value) => {
    const paymentValue = Number(value);
    setPayment(value);
    calculateChangeAndDebt(paymentValue);
  };

  const handleQuickPayment = (amount) => {
    setPayment(amount.toString());
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
    setShowConfirmation(true);
  };

  const confirmPayment = async () => {
    try {
      await dispatch(createNewOrder({
        customerId: customer.id,
        paymentAmount: Number(payment),
        change,
        debt: 0,
        totalPrice
      }));

      alert('Pembayaran berhasil!');

      navigate('/temporary-invoice', {
        state: {
          customerName,
          customerId: customer.id,
        },
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Gagal memproses pembayaran.');
    }
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  const handlePayAndPayDebt = () => {
    setShowPayAndPayDebtConfirmation(true);
  };

  const confirmPayAndPayDebt = async () => {
    try {
      await dispatch(createNewOrder({
        customerId: customer.id,
        paymentAmount: Number(payment),
        change,
        debt: 0,
        totalPrice
      }));

      const debtPayment = change;

      await dispatch(createNewDebtPayment({ // Ganti dengan createNewDebtPayment
        customerId: customer.id,
        amount: debtPayment
      }));

      alert('Pembayaran dan pembayaran hutang berhasil!');

      navigate('/temporary-invoice-and-debt', {
        state: {
          customerName,
          customerId: customer.id,
        },
      });
    } catch (error) {
      console.error('Error processing payment and debt:', error);
      alert('Gagal memproses pembayaran dan pembayaran hutang.');
    }
  };

  const formatPrice = (price) => {
    return `Rp. ${price.toLocaleString('id-ID')}`;
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-left flex-grow">Pembayaran</h1>
        <button className="text-white font-semibold bg-warna3 p-2 rounded-md" onClick={handleToTransactionPage}>
          Kembali
        </button>
      </div>

      <CustomerInfo customerName={customerName} customerId={customer?.id || 'ID Tidak Ditemukan'} />
      <DebtInfo debt={debt} formatPrice={formatPrice} />
      <TotalPrice totalPrice={totalPrice} formatPrice={formatPrice} />
      <PaymentInput 
        formatPrice={formatPrice} 
        payment={payment} 
        onChange={handlePaymentChange} 
      />

      <QuickPayments
        suggestedPayments={suggestedPayments}
        onQuickPayment={handleQuickPayment}
        formatPrice={formatPrice}
        totalPrice={totalPrice} 
      />

      {change > 0 && <ChangeDisplay change={change} formatPrice={formatPrice} />}
      {less > 0 && <LessDisplay less={less} formatPrice={formatPrice} />}

      <button
        className="bg-warna1 font-bold text-white w-full p-2 mt-2 rounded-md"
        onClick={handlePay}
      >
        Bayar
      </button>

      {debt > 0 && change > 0 && (
        <button
          className="bg-warna3 font-bold text-white w-full p-2 rounded-md mt-2"
          onClick={handlePayAndPayDebt}
        >
          Bayar dan Bayar Hutang
        </button>
      )}

      <ConfirmationDialog
        show={showConfirmation}
        onClose={handleCloseConfirmation}
        onConfirm={confirmPayment}
      />

      <PayAndDebtConfirmationDialog
        show={showPayAndPayDebtConfirmation}
        onClose={() => setShowPayAndPayDebtConfirmation(false)}
        onConfirm={confirmPayAndPayDebt}
        formatPrice={formatPrice}
        change={change}
      />
    </div>
  );
};

export default PaymentPage;
