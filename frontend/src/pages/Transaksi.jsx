import React, { useState } from 'react';
import NavbarTransaksi from '../components/NavbarTransaksi';
import Kalkulator from '../components/Kalkulator';
import Product from '../components/Product';
import SlideUp from '../components/SlideUp'; // Import SlideUp

const Transaksi = () => {
  const [view, setView] = useState('product');

  const handleViewChange = (view) => {
    setView(view);
  };

  return (
    <div className="">
      <NavbarTransaksi />
      <div className='flex bg-gray-300 ml-10 mr-10 items-center justify-center'>
        <button className='bg-black w-[120px] text-white p-4 mr-4 ml-4 mt-2 mb-2' onClick={() => handleViewChange('manual')}>
          Manual
        </button>
        <button className='bg-black w-[120px] text-white p-4 mr-4' onClick={() => handleViewChange('product')}>
          Produk
        </button>
        <button className='bg-black w-[120px] text-white p-4 mr-4' onClick={() => handleViewChange('kalkulator')}>
          Kalkulator
        </button>
      </div>
      
      {view === 'kalkulator' && <Kalkulator />}
      {view === 'product' && <Product />}
      
      <footer className="bg-gray1 p-4 text-black fixed bottom-0 left-0 w-full md:static">
        <SlideUp /> {/* Include SlideUp */}
        <div className="flex justify-center">
          <button className="bg-black text-white p-4 w-full">Total = Rp.0</button>
        </div>
      </footer>
    </div>
  );
};

export default Transaksi;
