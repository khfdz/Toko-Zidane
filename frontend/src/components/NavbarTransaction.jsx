// Navbar component
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from './Sidebar';
import IconPesanan from '../../public/icons/pesanan.png';
import { fetchAllProducts } from '../redux/slices/productSlice'; // Import fetchAllProducts
import { getAllSaveCartsThunk } from '../redux/slices/cartSaveSlice';
import { setView } from '../redux/slices/viewSlice'; // Import setView

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // State untuk input pencarian

  const dispatch = useDispatch(); // Inisialisasi dispatch
  const saveCarts = useSelector((state) => state.cartSave.saveCarts || []);

  useEffect(() => {
    dispatch(getAllSaveCartsThunk())
      .then((response) => {
        console.log('Hasil dari getAllSaveCartsThunk:', response);
      });
  }, [dispatch]);

  // Fungsi untuk membuka dan menutup sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fungsi untuk handle perubahan pada input pencarian
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query); // Update state pencarian

    // Dispatch fetchAllProducts dengan query pencarian
    dispatch(fetchAllProducts({ searchQuery: query, tagQuery: [] })); // Jika Anda ingin menggunakan tagQuery, tambahkan tagQuery di sini

    // Trigger perubahan view
    dispatch(setView('product')); // Ubah view menjadi 'product'
  };

  return (
    <>
      <nav className="bg-blue1 p-4 fixed top-0 left-0 right-0">
        <div className="container mx-auto flex justify-between items-center">
          <div className="md:hidden ">
            <button onClick={toggleSidebar} className="focus:outline-none">
              <svg className="w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path className='text-warna3' strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
          
          {/* Input pencarian produk */}
          <input
            placeholder='Cari Produk'
            className='text-md w-full rounded-md h-8 ml-4 mr-4 text-center bg-warna3 px-2 placeholder-warna1 text-black text-md flex items-center justify-center'
            value={searchQuery} // Menghubungkan dengan state pencarian
            onChange={handleSearchChange} // Handle perubahan input
          />

          {/* Ikon pesanan */}
          <div className="relative inline-block">
            <img src={IconPesanan} alt="Pesanan" className="w-8 h-8 object-cover" />
            <span className="absolute top-0 right-0 left-6 transform -translate-x-1/2 -translate-y-1/2 bg-warna3 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
              {saveCarts.saveCartCount || 0} {/* Menggunakan saveCarts.length untuk menghitung jumlah cart yang tersimpan */}
            </span>
          </div>

          {/* Navigation links */}
          <ul className="hidden md:flex space-x-6">
            <li><a href="#home" className="hover:text-pink1">Home</a></li>
            <li><a href="#about" className="hover:text-pink1">About</a></li>
            <li><a href="#services" className="hover:text-pink1">Services</a></li>
            <li><a href="#contact" className="hover:text-pink1">Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Render Sidebar jika terbuka */}
      {isSidebarOpen && <Sidebar toggleSidebar={toggleSidebar} />}
    </>
  );
};

export default Navbar;
