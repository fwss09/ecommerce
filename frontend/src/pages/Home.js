import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TopPanel from './TopPanel'; 
import './Home.css';
import './Panel.css';
import './Footer.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState('default');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const hostn =
  window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'http://192.168.0.100:5000';
  
  useEffect(() => {
    const storedUserData = localStorage.getItem('user_data');
    setIsAuthenticated(!!storedUserData);

    const fetchProducts = async () => {
      try {
        const params = sortOrder !== 'default' ? { sort: sortOrder } : {};
        const response = await axios.get(`${hostn}/products`, { params });
  
        const updatedProducts = response.data.map(product => ({
          ...product,
          imageUrl: product.imageUrl?.replace('http://localhost:5000', hostn)
        }));
  
        setProducts(updatedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
  
    fetchProducts();

  }, [sortOrder, hostn]);

  const goToProductPage = (id) => {
    navigate(`/products/${id}`);
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

    <TopPanel isAuthenticated={isAuthenticated} />
    <div className="home-container">
      <h1 style={{userSelect: "none"}}>Товари</h1>
      <div className="sort-container">
        <label htmlFor="sort">Сортування:</label>
        <select
          id="sort"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="sort-select"
        >
          <option value="default">За замовчуванням</option>
          <option value="asc">Від дешевих до дорогих</option>
          <option value="desc">Від дорогих до дешевих</option>
          <option value="newest">За новизною</option>
        </select>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id} onClick={() => goToProductPage(product.id)}>
            {product.imageUrl && <img src={product.imageUrl} alt={product.name} draggable="false" className="product-image" />}
            <div className="product-details">
              <h3 className="product-name">{product.name}</h3>
              <p
                className={`product-availability ${
                  product.inStock ? 'in-stock' : 'out-of-stock'
                }`}
              >
                {product.inStock ? 'В наявності' : 'Немає в наявності'}
              </p>
              <p className="product-description">{product.description}</p>
              <p className="product-price">{Number(product.price).toFixed(2)}<span className="home-currency-symbol">₴</span></p>
              {/* <button className="product-buy-button">Buy</button> */}
            </div>
          </div>
        ))}
      </div>
    </div>
    </motion.div>
    <footer className="footer">
      <p>© 2025 Anika E-Commerce. All rights reserved.</p>
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