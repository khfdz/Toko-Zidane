import { useState } from 'react';
import NavbarTransaksi from '../components/NavbarTransaksi';
import Kalkulator from '../components/Kalkulator';
import Product from '../components/Product';
import SlideUp from '../components/SlideUp'; 
import Tag from '../components/Tag';  // Import Tag component

const Transaksi = () => {
  const [view, setView] = useState('product');

  const handleViewChange = (view) => {
    setView(view);
  };

  return (
    <div className="relative">
      {/* Bagian bg-warna1 dengan posisi fixed */}
      <div className='bg-white  h-[200px] fixed top-0 left-0 right-0 z-30'>
        <NavbarTransaksi />
        <Tag /> {/* Include Tag component */}
        <div className='fixed top-16 mt-2 left-4 right-4 w-auto flex bg-warna3 rounded-md h-12 bg-opacity-50 items-center justify-center font-bold text-black'>
          <button className='w-[150px] p-2 mx-2' onClick={() => handleViewChange('manual')}>
            Manual
          </button>
          <button className='w-[150px] p-2 mx-2 rounded-md bg-warna3' onClick={() => handleViewChange('product')}>
            Produk
          </button>
          <button className='w-[150px] p-2 mx-2' onClick={() => handleViewChange('kalkulator')}>
            Kalkulator
          </button>
        </div>
      </div>

      {/* Tambahkan padding-top untuk menghindari tumpang tindih dengan elemen yang tetap */}
      <div className="pt-[200px]">
        
        {view === 'kalkulator' && <Kalkulator />}
        {view === 'product' && <Product />}
      </div>
      
      <footer className="bg-warna2 text-black fixed bottom-0 left-0 w-full md:static z-20">
        <SlideUp /> {/* Include SlideUp */}
        <div className="flex justify-center pl-4 pb-4 pr-4">
          <button className="bg-black text-white p-4 w-full">Total = Rp.0</button>
        </div>
      </footer>
    </div>
  );
};

export default Transaksi;
