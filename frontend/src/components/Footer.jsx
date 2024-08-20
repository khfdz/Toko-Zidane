import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const handleTransaksiClick = () => {
    navigate('/transaksi');
  };

  return (
    <footer className="bg-gray1  p-4 text-black fixed bottom-0 left-0 w-full md:static">
      <div className="flex justify-center">
        <button 
          className="bg-black text-white p-4 w-full" 
          onClick={handleTransaksiClick}
        >
          Transaksi
        </button>
      </div>
    </footer>
  );
};

export default Footer;
