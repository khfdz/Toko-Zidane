// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Transaction from './pages/Transaction';
import Login from './pages/Login';
import Payment from './pages/Payment';
import TemporaryInvoice from './pages/TemporaryInvoice';
import TemporaryInvoiceAndDebt from './pages/TemporaryInvoiceAndDebt';
import CartSave from './pages/CartSave'; // Import page CartSave

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/transaksi" element={<Transaction />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/temporary-invoice" element={<TemporaryInvoice />} />
            <Route path="/temporary-invoice-and-debt" element={<TemporaryInvoiceAndDebt />} />
            <Route path="/cartsave" element={<CartSave />} /> {/* Route baru untuk CartSave */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
