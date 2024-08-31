// Transaksi component
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCartForCurrentUserThunk } from '../redux/slices/cartSlice';
import { setView } from '../redux/slices/viewSlice'; // Import setView

import NavbarTransaction from '../components/NavbarTransaction';
import Kalkulator from '../components/Kalkulator';
import Product from '../components/Product';
import SlideUp from '../components/SlideUp';

const Transaksi = () => {
  const view = useSelector((state) => state.view.view); // Ambil view dari Redux store
  const [isSlideUpVisible, setIsSlideUpVisible] = useState(false);

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.carts.currentCart || { items: [], totalPrice: 0 });

  // Destructure additional cart values
  const totalProduct = cart.totalProduct || 0;
  const totalQuantity = cart.totalQuantity || 0;

  useEffect(() => {
    dispatch(fetchCartForCurrentUserThunk());
  }, [dispatch, isSlideUpVisible]);

  const handleViewChange = (view) => {
    dispatch(setView(view)); // Dispatch setView untuk mengubah view di Redux store
  };

  const toggleSlideUp = () => {
    setIsSlideUpVisible(!isSlideUpVisible);
    dispatch(fetchCartForCurrentUserThunk());
  };

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `Rp. ${price.toLocaleString('id-ID')}`;
    }
    return 'Rp. 0';
  };

  return (
    <div className="relative">
      <div className="bg-white h-[140px] fixed top-0 left-0 right-0 z-10">
        <NavbarTransaction />
        <div className="fixed top-16 mt-2 left-4 right-4 w-auto flex bg-warna3 rounded-md h-12 bg-opacity-50 items-center justify-center font-bold text-black">
          <button className="w-[150px] p-2 mx-2" onClick={() => handleViewChange('manual')}>
            Manual
          </button>
          <button className="w-[150px] p-2 mx-2 rounded-md bg-warna3" onClick={() => handleViewChange('product')}>
            Produk
          </button>
          <button className="w-[150px] p-2 mx-2" onClick={() => handleViewChange('kalkulator')}>
            Kalkulator
          </button>
        </div>
      </div>

      <div className="pt-[200px]">
        {view === 'kalkulator' && <Kalkulator />}
        {view === 'product' && <Product />}
      </div>

      <SlideUp isVisible={isSlideUpVisible} onToggle={toggleSlideUp} />
      <footer className="bg-white text-black fixed -bottom-1 left-0 w-full h-[90px] md:static  flex items-center justify-center">
        <div className="relative w-full h-full">
          <div className="absolute top-0 left-0 w-full flex justify-center mt-2 space-x-4">
            <span className="bg-warna3 rounded-md p-1 w-[120px] text-sm">Jenis Produk: {totalProduct}</span>
            <span className="bg-warna3 rounded-md p-1 w-[120px] text-sm">Banyaknya: {totalQuantity}</span>
          </div>
          <div className="absolute bottom-0 left-0 w-full">
            <button
              className="bg-black text-white p-4 w-full rounded-md flex items-center justify-center"
              onClick={toggleSlideUp}
            >
              <p className="text-center">Perkiraan: {formatPrice(cart.totalPrice)}</p>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Transaksi;
