import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserProfile, logout } from '../redux/slices/authSlice';
import Cookies from 'js-cookie';

const Sidebar = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userProfile = useSelector((state) => state.auth.profile);
  const status = useSelector((state) => state.auth.status);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        await dispatch(fetchUserProfile()).unwrap();
      } catch (error) {
        console.error('Failed to fetch user profile', error);
      }
    };

    fetchProfile();
  }, [dispatch]);

  useEffect(() => {
    console.log('Sidebar userProfile:', userProfile);
  }, [userProfile]);

  const handleLogout = () => {
    Cookies.remove('authToken'); // Menghapus token dari cookies
    dispatch(logout()); // Menghapus data user dari state
    navigate('/login'); // Navigasi ke halaman login
    toggleSidebar(); // Menutup sidebar
  };

  const handleNavigation = (path) => {
    navigate(path);
    toggleSidebar();
  };

  if (status === 'loading') return <div>Loading...</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-start z-10">
      <div className="bg-white w-64 h-full shadow-lg p-4">
        <button onClick={toggleSidebar} className="focus:outline-none mb-4">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <ul className="space-y-4">
          <p>Email: {userProfile?.email || 'N/A'}</p>
          <p>Phone: {userProfile?.phone || 'N/A'}</p>
          <button 
            onClick={handleLogout} 
            className="bg-warna1 text-white px-4 py-2"
          >
            Logout
          </button>
          <li>
            <button 
              onClick={() => handleNavigation('/')} 
              className="w-full text-left px-4 py-2 hover:bg-blue1 hover:text-white"
            >
              Home
            </button>
          </li>
          <li>
            <button 
              onClick={() => handleNavigation('/login')} 
              className="w-full text-left px-4 py-2 hover:bg-blue1 hover:text-white"
            >
              Login
            </button>
          </li>
          <li>
            <button 
              onClick={() => handleNavigation('/services')} 
              className="w-full text-left px-4 py-2 hover:bg-blue1 hover:text-white"
            >
              Services
            </button>
          </li>
          <li>
            <button 
              onClick={() => handleNavigation('/contact')} 
              className="w-full text-left px-4 py-2 hover:bg-blue1 hover:text-white"
            >
              Contact
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
};

export default Sidebar;
