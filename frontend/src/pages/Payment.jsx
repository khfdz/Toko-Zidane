import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCartForCurrentUserThunk } from '../redux/slices/cartSlice';
import { fetchTotalDebtByCustomerId, createNewOrder, payDebtByCustomerId } from '../redux/slices/orderSlice';

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
  const [manualDebtPayment, setManualDebtPayment] = useState('');
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

  // const calculateChangeAndDebt = (paymentValue) => {
  //   const changeAmount = paymentValue - totalPrice;
  //   setChange(changeAmount >= 0 ? changeAmount : 0);
  //   setDebt(changeAmount < 0 ? Math.abs(changeAmount) : debt);
  // };

  const calculateChangeAndDebt = (paymentValue) => {
    const changeAmount = paymentValue - totalPrice;
    setChange(changeAmount >= 0 ? changeAmount : 0);
    setDebt(changeAmount < 0 ? Math.abs(changeAmount) : debt);
    setLess(changeAmount < 0 ? Math.abs(changeAmount) : 0); // Hitung kekurangan
  };

  const handlePaymentChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
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

      // Navigasi ke halaman TemporaryInvoice dan kirim data customer
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
      
      const debtPayment = manualDebtPayment ? Number(manualDebtPayment) : change;
      
      await dispatch(payDebtByCustomerId({
        customerId: customer.id,
        paymentAmount: debtPayment
      }));
      
      alert('Pembayaran dan pembayaran hutang berhasil!');

      // Navigasi ke halaman TemporaryInvoice dan kirim data customer
      navigate('/temporary-invoice', {
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

  const handleManualDebtPaymentChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setManualDebtPayment(value);
  };

  const formatPrice = (price) => {
    return `Rp. ${price.toLocaleString('id-ID')}`;
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <button className="absolute top-4 right-4 text-white font-semibold bg-warna3 p-2 rounded-md" onClick={handleToTransactionPage}>
        Kembali
      </button>
      <h1 className="text-2xl font-bold mb-6 text-center">Pembayaran</h1>
  
      <CustomerInfo customerName={customerName} customerId={customer?.id || 'ID Tidak Ditemukan'} />
      <DebtInfo debt={debt} formatPrice={formatPrice} />
      <TotalPrice totalPrice={totalPrice} formatPrice={formatPrice} />
      <PaymentInput formatPrice={formatPrice} payment={payment} onChange={handlePaymentChange} />
      <QuickPayments
        suggestedPayments={suggestedPayments}
        onQuickPayment={handleQuickPayment}
        formatPrice={formatPrice}
        totalPrice={totalPrice} // Ensure this is passed
      />
  
      <ChangeDisplay change={change} formatPrice={formatPrice} />
      <LessDisplay less={debt} formatPrice={formatPrice} />
  
      <button
        className="bg-blue-500 text-white w-full p-2 rounded-md"
        onClick={handlePay}
      >
        Bayar
      </button>
  
      {debt > 0 && change > 0 && (
        <button
          className="bg-yellow-500 text-white w-full p-2 rounded-md mt-2"
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
        manualDebtPayment={manualDebtPayment}
        onManualDebtPaymentChange={handleManualDebtPaymentChange}
        formatPrice={formatPrice}
        change={change}
      />
    </div>
  );
};

export default PaymentPage;
