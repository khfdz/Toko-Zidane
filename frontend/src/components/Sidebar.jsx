const Sidebar = ({ toggleSidebar }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-start z-10">
      <div className="bg-white w-64 h-full shadow-lg p-4">
        <button onClick={toggleSidebar} className="focus:outline-none mb-4">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <ul className="space-y-4">
          <li><button className="w-full text-left px-4 py-2 hover:bg-blue1 hover:text-white">Home</button></li>
          <li><button className="w-full text-left px-4 py-2 hover:bg-blue1 hover:text-white">About</button></li>
          <li><button className="w-full text-left px-4 py-2 hover:bg-blue1 hover:text-white">Services</button></li>
          <li><button className="w-full text-left px-4 py-2 hover:bg-blue1 hover:text-white">Contact</button></li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
