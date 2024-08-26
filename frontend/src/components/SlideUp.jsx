import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCartForCurrentUserThunk } from '../redux/slices/cartSlice';

const SlideUp = () => {
  const [isVisible, setIsVisible] = useState(false);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.carts.currentCart || { items: [] });

  useEffect(() => {
    dispatch(fetchCartForCurrentUserThunk());
  }, [dispatch]);

  useEffect(() => {
    console.log('Cart:', cart); // Log akan dipanggil setiap kali state `cart` berubah
  }, [cart]);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const formatPrice = (price) => {
    return `Rp. ${price.toLocaleString('id-ID')}`;
  };

  const cartItems = cart.items || [];
  const note = cart.note || '';
  const discount = cart.discount || 0;
  const additionalText = cart.additionalText || '';
  const additionalPrice = cart.additionalPrice || 0;
  const subTotal = cart.subTotal || 0;
  const totalProduct = cart.totalProduct || 0;
  const totalQuantity = cart.totalQuantity || 0;
  const totalPrice = cart.totalPrice || 0;

  return (
    <div>
      <div className="flex items-center justify-center">
        <button
          className="bg-black text-white p-2 items-center flex justify-center"
          onClick={toggleVisibility}
        >
          Slide Up
        </button>
      </div>

      <div
        className={`fixed bottom-0 left-0 w-full h-full bg-gray-300 p-4 transition-transform duration-500 ease-in-out ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Pembeli: {cart.customerName || 'Unknown'}</h2>
          <button
            className="text-red-500"
            onClick={toggleVisibility}
          >
            Close
          </button>
        </div>

        <ul>
          {cartItems.map((item) => (
            <li key={item._id} className="mb-2 flex justify-between">
              {/* Bagian nama produk */}
              <div className="w-1/3">
                <span>{item.product.name}</span>
                <br />
                <span>{item.product.quantity} x {formatPrice(item.product.price)}</span>
              </div>
              
              {/* Bagian quantity dan price */}
              <div className="w-1/3 text-center">
                
              </div>
              
              {/* Bagian totalPriceProduct */}
              <div className="w-1/3 text-right">
                <span>{formatPrice(item.product.totalPriceProduct)}</span>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4">
          <div>Note: {note}</div>
          <div>Discount: {formatPrice(discount)}</div>
          <div>Additional Text: {additionalText}</div>
          <div>Additional Price: {formatPrice(additionalPrice)}</div>
          <div>Total Product: {totalProduct}</div>
          <div>Total Quantity: {totalQuantity}</div>
          <div>Subtotal: {formatPrice(subTotal)}</div>
          <div>Total Price: {formatPrice(totalPrice)}</div>
        </div>

        <div className="fixed bottom-4 left-4 right-4 flex justify-between items-center">
          <div className="flex-grow text-center">
            <button className="bg-black text-white p-2 w-full max-w-md">
              Total Price: {formatPrice(totalPrice)}
            </button>
          </div>
          <button className="bg-blue-500 w-[100px] text-white p-2 ml-4">
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlideUp;
