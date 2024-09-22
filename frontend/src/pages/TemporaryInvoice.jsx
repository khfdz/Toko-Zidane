import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getLatestOrderByCustomerId } from '../redux/api/orderApiService'; // Pastikan path import sesuai
import ReceiptView from '../components/ReceiptView'; // Import komponen ReceiptView

const TemporaryInvoice = () => {
  const location = useLocation();
  const { customerName, customerId } = location.state || {};
  const [latestOrder, setLatestOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false); // State untuk menampilkan ReceiptView

  useEffect(() => {
    const fetchLatestOrder = async () => {
      try {
        const order = await getLatestOrderByCustomerId(customerId);
        setLatestOrder(order);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchLatestOrder();
    }
  }, [customerId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleWhatsApp = () => {
    // Tambahkan logika untuk mengirim nota ke WhatsApp
    console.log('Kirim ke WhatsApp');
  };

  const handlePrint = () => {
    // Logika untuk cetak nota
    window.print();
  };

  const handleViewReceipt = () => {
    setShowReceipt(!showReceipt); // Toggle tampilan ReceiptView
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-center mb-4">Temporary Invoice</h2>

      <div className="mb-4">
        <strong>Customer Name:</strong> {customerName}
      </div>

      {latestOrder && (
        <div>
          <h3 className="font-semibold mb-2">Latest Order Details:</h3>
          <div className="border border-gray-300 rounded-md p-4">
            <p><strong>Order ID:</strong> {latestOrder.order_id}</p>
            <p><strong>Payment Amount:</strong> {latestOrder.paymentAmount.toLocaleString()}</p>
            <p><strong>Change:</strong> {latestOrder.change.toLocaleString()}</p>
            <p><strong>Total Price:</strong> {latestOrder.cart.totalPrice.toLocaleString()}</p>
            <p><strong>Date:</strong> {new Date(latestOrder.paymentDate).toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Tombol-tombol */}
      <div className="mt-6 flex justify-center space-x-4">
        <button
          onClick={handleWhatsApp}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Kirim ke WA
        </button>
        <button
          onClick={handlePrint}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Cetak Print
        </button>
        <button
          onClick={handleViewReceipt}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          {showReceipt ? 'Tutup Nota' : 'Lihat Nota'}
        </button>
      </div>

      {/* Tampilkan ReceiptView jika showReceipt true */}
      {showReceipt && <ReceiptView latestOrder={latestOrder} />}
    </div>
  );
};

export default TemporaryInvoice;
