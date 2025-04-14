import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CartContext } from '../context/CartContext';
import axios from 'axios';
import './Product.css';
import './Panel.css';

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useContext(CartContext);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const BASE_URL = 
    window.location.hostname === 'localhost' 
      ? 'http://localhost:5000' 
      : `http://${window.location.hostname}:5000`; 

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Не удалось загрузить данные продукта.');
      }
    };

    fetchProduct();
  }, [id]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!product) {
    return <div className="loading"> </div>;
  }

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setNotification({ message: 'Item added to cart', type: 'success' });
    setTimeout(() => setNotification(null), 5000);
  };

  return (

    <>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
    {notification && (
      <div className={`notification ${notification.type}`}>
        <p>{notification.message}</p>
        <button className="close-notification" onClick={() => setNotification(null)}>×</button>
      </div>
    )}
    <div className="top-panel">
      <h1 onClick={() => navigate(-1)} className="panel-title">Anika</h1>
      <div className="top-panel-actions">
        <button onClick={() => navigate('/cart')} className="cart-button">Cart</button>
        <button onClick={() => navigate('/admin')} className="admin-button">Admin Panel</button>
      </div>
    </div>
    <div className="product-page">
      {/* <button className="back-button" onClick={() => navigate(-1)}>
        Назад
      </button> */}
      <div className="product-container">
        <div className="product-image-container">
          <img
            src={`${BASE_URL}${product.imageUrl}`}
            alt={product.name}
            className="product-page-image"
            onClick={openModal}
          />
        </div>
        <div className="product-info">
        <h1 className="product-title">{product.name}</h1>
          <p className="product-page-description">{product.description}</p>
          <p className="product-page-price">{Number(product.price).toFixed(2)}<span className="currency-symbol">₴</span></p>
          <button onClick={() => handleAddToCart(product)} className="product-buy-button">Add to cart</button>
        </div>
      </div>
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={`${BASE_URL}${product.imageUrl}`}
              alt={product.name}
              className="modal-image"
            />
            <button className="modal-close-button" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}

    </div>
    </motion.div>
    </>
  );
};

export default Product;