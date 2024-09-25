import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getLatestDebtAndOrderById } from '../redux/api/debtPaymentApiService'; // Update this import
import ReceiptView from '../components/ReceiptView';

const TemporaryInvoiceAndDebt = () => {
  const location = useLocation();
  const { customerName, customerId } = location.state || {};
  const [latestOrder, setLatestOrder] = useState(null);
  const [latestDebtPayment, setLatestDebtPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        const data = await getLatestDebtAndOrderById(customerId);
        setLatestOrder(data.latestOrder);
        setLatestDebtPayment(data.latestDebtPayment);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchLatestData();
    }
  }, [customerId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleWhatsApp = () => {
    console.log('Kirim ke WhatsApp');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleViewReceipt = () => {
    setShowReceipt(!showReceipt);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return 'Rp. ' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg">
      <h2 className="text-xl font-bold text-center mb-4">Bukti Pembayaran dan Cicil Hutang</h2>

      <div className="mb-4">
        <strong>Customer Name:</strong> {customerName}
      </div>

      {latestOrder && (
        <div className="bg-warna2 mb-4 p-4 rounded-lg">
          <div className="text-center bg-warna3 p-2">
            {formatDate(latestOrder.paymentDate)} - {formatTime(latestOrder.paymentDate)} WIB
          </div>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border-b border-gray-800 p-2 text-left">Detail</th>
                <th className="border-b border-gray-800 p-2 text-right">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b border-gray-400 p-2"><strong>No Struk:</strong></td>
                <td className="border-b border-gray-400 p-2 text-right">{latestOrder.order_id}</td>
              </tr>
              <tr>
                <td className="border-b border-gray-400 p-2"><strong>Bayar:</strong></td>
                <td className="border-b border-gray-400 p-2 text-right">{formatPrice(latestOrder.paymentAmount)}</td>
              </tr>
              <tr>
                <td className="border-b border-gray-400 p-2"><strong>Kembalian:</strong></td>
                <td className="border-b border-gray-400 p-2 text-right">{formatPrice(latestOrder.change)}</td>
              </tr>
              <tr>
                <td className="border-b border-gray-400 p-2"><strong>Kurang:</strong></td>
                <td className="border-b border-gray-400 p-2 text-right">{formatPrice(latestOrder.debt)}</td>
              </tr>
              <tr>
                <td className="border-b border-gray-400 p-2"><strong>Total Belanja:</strong></td>
                <td className="border-b border-gray-400 p-2 text-right">{formatPrice(latestOrder.cart.totalPrice)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

{latestDebtPayment && (
  <div className="bg-warna2 mb-4 p-4 rounded-lg">
    <div className="text-center bg-warna3 p-2">
      {formatDate(latestDebtPayment.paymentDate)} - {formatTime(latestDebtPayment.paymentDate)} WIB
    </div>
    <table className="min-w-full border-collapse border border-gray-300">
      <thead>
        <tr>
          <th className="border-b border-gray-800 p-2 text-left">Detail</th>
          <th className="border-b border-gray-800 p-2 text-right">Jumlah</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border-b border-gray-400 p-2"><strong>No Cicilan:</strong></td>
          <td className="border-b border-gray-400 p-2 text-right">{latestDebtPayment.payDebt_id}</td>
        </tr>
        <tr>
          <td className="border-b border-gray-400 p-2"><strong>No Struk:</strong></td>
          <td className="border-b border-gray-400 p-2 text-right">{latestDebtPayment.orders[0].order_id}</td>
        </tr>
        <tr>
          <td className="border-b border-gray-400 p-2"><strong>Cicil Hutang:</strong></td>
          <td className="border-b border-gray-400 p-2 text-right">{formatPrice(latestDebtPayment.amount)}</td>
        </tr>
        <tr>
          <td className="border-b border-gray-400 p-2"><strong>Sisa Hutang:</strong></td>
          <td className="border-b border-gray-400 p-2 text-right">{formatPrice(latestDebtPayment.orders[0].debt)}</td>
        </tr>
      </tbody>
    </table>
  </div>
)}

      {/* Tombol-tombol */}
      <div className="mt-6 flex justify-center space-x-4">
        <button
          onClick={handleWhatsApp}
          className="bg-warna2 text-black px-4 py-2 rounded-md hover:bg-green-600"
        >
          Kirim ke WA
        </button>
        <button
          onClick={handlePrint}
          className="bg-warna3 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Cetak Print
        </button>
        <button
          onClick={handleViewReceipt}
          className="bg-warna1 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          {showReceipt ? 'Tutup Nota' : 'Lihat Nota'}
        </button>
      </div>

      {showReceipt && <ReceiptView latestOrder={latestOrder} />}
    </div>
  );
};

export default TemporaryInvoiceAndDebt;
