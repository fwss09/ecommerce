import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Product from './pages/Product';
import Cart from './pages/Cart';

const App = () => {
  return (
    <Router>
      <div>
        {/* <nav>
          <Link to="/">Home</Link> | <Link to="/admin">Admin</Link>
        </nav> */}

        {/* routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/products/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;