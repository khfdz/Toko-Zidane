import NavbarTransaksi from '../components/NavbarTransaksi';
import Kalkulator from '../components/Kalkulator';

const Transaksi = () => {
  return (
    <div className="">
        <NavbarTransaksi />
        <div className='flex bg-gray-300 ml-10 mr-10 items-center justify-center'>
            <button className='bg-black w-[120px] text-white p-4 mr-2'>Manual</button>
            <button className='bg-black w-[120px] text-white p-4 mr-2'>Produk</button>
            <button className='bg-black w-[120px] text-white p-4 mr-2'>Kalkulator</button>
        </div>
        <Kalkulator />
           
        <footer className="bg-gray1  p-4 text-black fixed bottom-0 left-0 w-full md:static">

          <div className='flex justify-center'>
    <button className='bg-black text-white p-4 h-[10px]  flex items-center justify-center'>
        Slide Up
    </button>
    </div>


      <div className="flex justify-center">
        <button className="bg-black text-white p-4 w-full" >
          Total = Rp.0
        </button>
      </div>
    </footer>
    </div>
  );
};

export default Transaksi;
