import { useState } from 'react';
import Sidebar from './Sidebar';

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <nav className="bg-blue1  p-4 text-black ">
        <div className="container mx-auto flex justify-between items-center text-black">
          <div className="md:hidden">
            <button onClick={toggleSidebar} className="focus:outline-none ">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
          <div className="text-xl font-bold">BrandName</div>
          <ul className="hidden md:flex space-x-6">
            <li><a href="#home" className="hover:text-pink1">Home</a></li>
            <li><a href="#login" className="hover:text-pink1">Login</a></li>
            <li><a href="#about" className="hover:text-pink1">About</a></li>
            <li><a href="#services" className="hover:text-pink1">Services</a></li>
            <li><a href="#contact" className="hover:text-pink1">Contact</a></li>
          </ul>
        </div>
      </nav>
      
      {isSidebarOpen && <Sidebar toggleSidebar={toggleSidebar} />}
    </>
  );
};

export default Navbar;
