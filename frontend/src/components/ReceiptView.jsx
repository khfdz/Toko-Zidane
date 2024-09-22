import PropTypes from 'prop-types';
import logoTokoZidane from '../../public/images/tokoZidaneBW.png';

const ReceiptView = ({ latestOrder }) => {
  if (!latestOrder || !latestOrder.cart) {
    return <div>No order data available.</div>;
  }

  // Format tanggal
  const createdAt = new Date(latestOrder.createdAt);
  const formattedDate = createdAt.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const formattedTime = createdAt.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const isPaid = latestOrder.cart.isPaid || latestOrder.paymentAmount >= latestOrder.cart.totalPrice;

  return (
    <div className="fixed inset-0 bg-gray-100 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-xs bg-white p-6 border border-gray-300 rounded-lg shadow-md overflow-auto max-h-[80vh] overflow-y-scroll">
        {/* Header dan Logo */}
        <div className="text-center mb-4">
          <img src={logoTokoZidane} alt="Logo Toko Zidane" className="-mt-12 -mb-8 h-[200px] mx-auto" />
          <h3 className="text-lg font-bold">Toko Zidane</h3>
          <p className="text-sm">Kp. Sangkali</p>
          <p className="text-sm">082260423997</p>
        </div>

        {/* Garis Pemisah */}
        <div className="border-t border-gray-400 my-2"></div>
        

        {/* Informasi Order */}
        <div className="mb-2 flex justify-between">
          <strong>No. Struk:</strong>
          <span>{latestOrder.order_id || 'Unknown Order ID'}</span>
        </div>
        <div className="mb-2 flex justify-between">
          <strong>Pembeli:</strong>
          <span>{latestOrder.customer?.name || 'Unknown Customer'}</span>
        </div>
        <div className="mb-2 flex justify-between">
          <strong>Tanggal:</strong>
          <span>{formattedDate}, {formattedTime}</span>
        </div>

        <div className="border-t border-gray-400 my-2"></div>

        {/* Status Pembayaran */}
        <div className="text-center font-bold text-lg mt-4">
          {isPaid ? '##### LUNAS #####' : '##### BELUM LUNAS #####'}
        </div>

        {/* Garis Pemisah */}
        <div className="border-t border-gray-400 my-2"></div>

        

        {/* List Items */}
        <div className="pt-2">
          {latestOrder.cart.items && latestOrder.cart.items.length > 0 ? (
            latestOrder.cart.items.map((item, index) => (
              <div key={item._id || index} className="mb-2 flex justify-between">
                <div>
                  <p><strong>{item.product?.name || 'Product Name Missing'}</strong></p>
                  <p>{item.product?.price?.toLocaleString() || 'Price Missing'} x {item.product?.quantity || 0}</p>
                </div>
                <div className="text-right mt-4">
                  <p>{item.product?.totalPriceProduct?.toLocaleString() || 'Total Price Missing'}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No items in the cart.</p>
          )}
        </div>

        {/* Garis Pemisah */}
        <div className="border-t border-gray-400 my-2"></div>

        {/* Rincian Harga */}
        <div className="mb-2 flex justify-between">
          <strong>Sub Total:</strong>
          <span>{latestOrder.cart.subTotal?.toLocaleString() || '0'}</span>
        </div>
        <div className="mb-2 flex justify-between">
          <strong>Diskon:</strong>
          <span>{latestOrder.cart.discount?.toLocaleString() || '0'}</span>
        </div>

        <div className="border-t border-gray-400 my-2"></div>

        <div className="mb-4 flex justify-between">
          <strong>Total Price:</strong>
          <span>Rp.  {latestOrder.cart.totalPrice?.toLocaleString() || '0'} </span>
        </div>

        <div className="border-t border-gray-400 my-2"></div>

        {/* Payment Details */}
        <div className="mb-2 flex justify-between">
          <strong>Bayar:</strong>
          <span>Rp.  {latestOrder.paymentAmount?.toLocaleString() || '0'}</span>
        </div>
        <div className="mb-4 flex justify-between">
          <strong>Kembalian:</strong>
          <span>Rp. {latestOrder.change?.toLocaleString() || '0'}</span>
        </div>

        {/* Garis Pemisah */}
        <div className="border-t border-gray-400 my-2"></div>
        <p className='text-center'>&#169;khfdz</p>
        <p className='text-center'>www.tokozidane.com</p>

        {/* Tombol Kembali */}
        <div className="mt-6 text-center">
          <a
            href="/transaksi"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
          >
            Kembali ke Halaman Transaksi
          </a>
        </div>
      </div>
    </div>
  );
};

ReceiptView.propTypes = {
  latestOrder: PropTypes.shape({
    customer: PropTypes.shape({
      name: PropTypes.string,
    }),
    order_id: PropTypes.string,
    createdAt: PropTypes.string, // Pastikan ini bertipe string
    cart: PropTypes.shape({
      items: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string,
        product: PropTypes.shape({
          name: PropTypes.string,
          price: PropTypes.number,
          quantity: PropTypes.number,
          totalPriceProduct: PropTypes.number,
        }),
      })),
      totalPrice: PropTypes.number,
      subTotal: PropTypes.number,
      discount: PropTypes.number,
      isPaid: PropTypes.bool,
    }),
    paymentAmount: PropTypes.number,
    change: PropTypes.number,
  }),
};

export default ReceiptView;
