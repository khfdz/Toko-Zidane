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

  // Fungsi untuk mengambil inisial dari nama
  const getInitials = (name) => {
    if (!name) return 'AN'; // Default jika tidak ada nama
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.slice(0, 2).toUpperCase(); // Ambil dua huruf pertama
  };

  if (status === 'loading') return <div></div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-start z-50">
      <div className="bg-white w-64 h-full shadow-lg p-4">
        <button onClick={toggleSidebar} className="focus:outline-none mb-4">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="flex items-center space-x-4 mb-6">
          {userProfile?.avatar ? (
            <img
              src={userProfile.avatar}
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-gray-300"
            />
          ) : (
            <div
              className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-300 text-white font-bold text-lg border-2 border-gray-300"
            >
              {getInitials(userProfile?.name || 'Anonymous')}
            </div>
          )}
          <div>
            <p className="font-semibold text-lg">{userProfile?.name || 'N/A'}</p>
            <p className="text-gray-600">{userProfile?.phone || 'No phone number'}</p>
          </div>
        </div>

        <ul className="space-y-4">
          <li>
            <button
              onClick={() => handleNavigation('/')}
              className="w-full text-left px-4 py-2 hover:bg-blue-500 hover:text-white"
            >
              Home
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation('/login')}
              className="w-full text-left px-4 py-2 hover:bg-blue-500 hover:text-white"
            >
              Login
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation('/services')}
              className="w-full text-left px-4 py-2 hover:bg-blue-500 hover:text-white"
            >
              Kelola Produk
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation('/services')}
              className="w-full text-left px-4 py-2 hover:bg-blue-500 hover:text-white"
            >
              Daftar Hutang
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation('/contact')}
              className="w-full text-left px-4 py-2 hover:bg-blue-500 hover:text-white"
            >
              Daftar Pembeli
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation('/contact')}
              className="w-full text-left px-4 py-2 hover:bg-blue-500 hover:text-white"
            >
              Catatan Pembelian
            </button>
          </li>
          <button
            onClick={handleLogout}
            className="bg-warna3 text-gray-800 font-semibold px-4 py-2 mt-4 w-full"
          >
            Logout
          </button>
        </ul>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
};

export default Sidebar;
