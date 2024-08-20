import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Transaksi from './pages/Transaksi';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/transaksi" element={<Transaksi />} />
          </Routes>
        </div>
        
      </div>
    </Router>
  );
}

export default App;
