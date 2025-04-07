import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Home.css';
import './Panel.css';
import './Footer.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    
    fetchProducts();
  }, []);
  
  const goToProductPage = (id) => {
    navigate(`/products/${id}`);
  };

  const goToAdmin = () => {
    navigate('/admin');
  };

  return (
    <>
    <div className="page-container">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >

    <div className="top-panel">
      <h1 className="panel-title">My E-Commerce</h1>
      <button onClick={goToAdmin} className="admin-button">Admin Panel</button>
    </div>
    <div className="home-container">
      <h1 style={{userSelect: "none"}}>Products</h1>
      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id} onClick={() => goToProductPage(product.id)}>
            {product.imageUrl && <img src={product.imageUrl} alt={product.name} draggable="false" className="product-image" />}
            <div className="product-details">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-price">{Number(product.price).toFixed(2)}₴</p>
              {/* <button className="product-buy-button">Купить</button> */}
            </div>
          </div>
        ))}
      </div>
    </div>
    </motion.div>
    <footer className="footer">
      <p>© 2025 My E-Commerce. All rights reserved.</p>
      <div className="footer-links">
        <a href="/about">About Us</a>
        <a href="/contact">Contact</a>
        <a href="/privacy">Privacy Policy</a>
      </div>
    </footer>
    </div>
    </>
  );
};

export default Home;