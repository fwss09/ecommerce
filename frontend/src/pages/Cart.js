import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CartContext } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const BASE_URL = 'http://localhost:5000';

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0); 

  return (
    <>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
    <div className="top-panel">
      <h1 onClick={() => navigate(-1)} className="panel-title">Anika</h1>
      <div className="top-panel-actions">
        <button onClick={() => navigate('/cart')} className="cart-button">Cart</button>
        <button onClick={() => navigate('/admin')} className="admin-button">Admin Panel</button>
      </div>
    </div>
    <div className="cart-container">
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={`${BASE_URL}${item.imageUrl}`} alt={item.name} className="cart-item-image" />
              <h3>{item.name}</h3>
              <p>Price: {Number(item.price).toFixed(2)}₴</p>
              <p>Quantity: {item.quantity}</p>
              <button onClick={() => removeFromCart(item.id)}>Remove</button>
            </div>
          ))}
          <div className="cart-total">
            <h2>Total: {total.toFixed(2)}₴</h2>
          </div>
          <button onClick={clearCart}>Clear Cart</button>
        </div>
      )}
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
    </>
  );
};

export default Cart;