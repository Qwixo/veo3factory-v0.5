import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { SuccessPage } from './components/checkout/SuccessPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black">
        <Routes>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
