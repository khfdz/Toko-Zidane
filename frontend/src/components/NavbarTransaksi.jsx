import React, { useState } from 'react';
import Sidebar from './Sidebar';

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <nav className="bg-blue1 text-white p-4 text-black">
        <div className="container mx-auto flex justify-between items-center text-black">
          <div className="md:hidden text-black">
            <button onClick={toggleSidebar} className="focus:outline-none">
              <svg className="w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
          <input placeholder='Search' className='w-full h-10 ml-4 mr-4  text-center bg-gray-300 px-2 placeholder-black'/>
          <button className='bg-black text-white h-10 '>BTN1</button>
          <ul className="hidden md:flex space-x-6">
            <li><a href="#home" className="hover:text-pink1">Home</a></li>
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
