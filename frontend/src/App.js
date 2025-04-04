import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin'; 

const App = () => {
  return (
    <Router>
      <div>
        {/* <nav>
          <Link to="/">Home</Link> | <Link to="/admin">Admin</Link>
        </nav> */}

        {/* Маршруты */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;