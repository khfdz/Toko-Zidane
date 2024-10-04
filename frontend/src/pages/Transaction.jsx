// Transaksi component
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCartForCurrentUserThunk } from '../redux/slices/cartSlice';
import { setView } from '../redux/slices/viewSlice'; // Import setView

import NavbarTransaction from '../components/NavbarTransaction';
import Manual from '../components/Manual';
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
<div className="bg-white h-[134px] fixed top-0 left-0 right-0 z-10">
  <NavbarTransaction />
  <div className="fixed top-16 mt-2 left-4 right-4 w-auto flex bg-warna2 rounded-md h-12 items-center justify-center font-semibold text-white">
    <button 
      className={`w-[150px] h-8 p-2 mx-2 flex items-center justify-center text-center text-gray-800 rounded-md ${
        view === 'manual' ? 'bg-warna3 text-white' : 'hover:bg-warna3'
      }`}
      onClick={() => handleViewChange('manual')}
    >
      Manual
    </button>
    <button 
      className={` w-[150px] h-8 p-2 mx-2 flex items-center justify-center text-center text-gray-800 rounded-md ${
        view === 'product' ? 'bg-warna3 text-white' : 'hover:bg-warna3'
      }`}
      onClick={() => handleViewChange('product')}
    >
      Produk
    </button>
    <button 
      className={`w-[150px] h-8 p-2 mx-2 flex items-center justify-center text-center text-gray-800 rounded-md ${
        view === 'kalkulator' ? 'bg-warna3 text-white' : 'hover:bg-warna3'
      }`}
      onClick={() => handleViewChange('kalkulator')}
    >
      Kalkulator
    </button>
  </div>
</div>



      <div className="pt-[200px]">
        {view === 'manual' && <Manual formatPrice={formatPrice} />}
        {view === 'kalkulator' && <Kalkulator />}
         {view === 'product' && <Product formatPrice={formatPrice} />}
      </div>

      <SlideUp isVisible={isSlideUpVisible} onToggle={toggleSlideUp} />
      
      <footer className="bg-warna2 text-black fixed bottom-0 left-0 w-full h-[90px] flex flex-col items-center justify-between border-t border-gray-300">
  <div className="flex flex-row text-white font-semibold justify-center space-x-4 mt-[1px]">
    <span className="bg-warna1 rounded-md p-1 w-[120px] text-center -mt-1">Jenis: {totalProduct} item</span>
    <span className="bg-warna1 rounded-md p-1 w-[120px] text-center -mt-1">Total: {totalQuantity} item</span>
  </div>
  <button
    className=" bg-warna3 font-bold text-white p-3 w-[350px] h-[50px] rounded-md flex items-center justify-center shadow-lg relative top-2" // Atur posisi dengan 'relative' dan 'top'
    onClick={toggleSlideUp}
  >
    <p className="text-center text-md text-white ">Perkiraan: {formatPrice(cart.totalPrice)}</p>
  </button>
</footer>




    </div>
  );
};

export default Transaksi;
