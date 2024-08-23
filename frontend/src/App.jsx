// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Transaksi from './pages/Transaksi';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/transaksi" element={<Transaksi />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
