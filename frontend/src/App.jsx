// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Transaction from './pages/Transaction';
import Login from './pages/Login';
import Payment from './pages/Payment';
import Testing from './pages/Testing';

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
            <Route path="/testing" element={<Testing />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
