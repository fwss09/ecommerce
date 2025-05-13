// TopPanel.js
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const TopPanel = ({ isAuthenticated }) => {
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  return (
    <div className="top-panel">
      <h1 className="panel-title" onClick={() => navigate('/')}>Anika</h1>
      <div className="top-panel-actions">
        <button onClick={() => navigate('/cart')} className="cart-button" style={{ position: 'relative' }}>
          <img src="/icons/shopping-bag.svg" alt="Кошик" className="icon" />
          {cart.length > 0 && (
            <span className="cart-count-badge">{cart.reduce((acc, item) => acc + item.quantity, 0)}</span>
          )}
        </button>
        {isAuthenticated ? (
          <button onClick={() => navigate('/profile')} className="profile-button">
            <img src="/icons/user.svg" alt="Профіль" className="icon" />
          </button>
        ) : (
          <button onClick={() => navigate('/profile')} className="login-button">
            <img src="/icons/user.svg" alt="Увійти" className="icon" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TopPanel;