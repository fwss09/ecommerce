import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Register from './pages/Register';
import './progressbar.css';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const BASE_URL = 
window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : `http://${window.location.hostname}:5000`; 

  const ScrollHandler = () => {
    const location = useLocation();
  
    useEffect(() => {
      NProgress.start();

      requestAnimationFrame(() => {
        NProgress.done();
      });
    }, [location]);
  
    return null;
  };

const App = () => {
  return (
    <Router>
      <div>
        {/* <nav>
          <Link to="/">Home</Link> | <Link to="/admin">Admin</Link>
        </nav> */}

        {/* routes */}
        <ScrollHandler />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/products/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;