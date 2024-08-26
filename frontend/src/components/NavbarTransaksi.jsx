import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Sidebar from './Sidebar';
import IconPesanan from '../../public/icons/pesanan.png';
import { fetchAllProducts } from '../redux/slices/productSlice'; // Import fetchAllProducts

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // State untuk input pencarian
  const dispatch = useDispatch(); // Inisialisasi dispatch

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
          <img src={IconPesanan} alt="Pesanan" className="w-8 h-8 object-cover" />

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
