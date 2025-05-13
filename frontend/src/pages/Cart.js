import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CartContext } from '../context/CartContext';
import axios from 'axios';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1);
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    shippingAddress: '',
  });
  const navigate = useNavigate();

  const BASE_URL = 
    window.location.hostname === 'localhost' 
      ? 'http://localhost:5000' 
      : `http://${window.location.hostname}:5000`; 

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0); 

  useEffect(() => {
    const storedUserData = localStorage.getItem('user_data');
    if (storedUserData) {
      setIsAuthenticated(true);
      const user = JSON.parse(storedUserData);
      setFormData((prev) => ({
        ...prev,
        email: user.email || '',
        fullName: user.name || '',
        phoneNumber: user.phone || '',
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
  
    if (cart.length === 0) {
      setError('Корзина пуста.');
      return;
    }
  
    const orderData = {
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      shippingAddress: formData.shippingAddress,
      items: cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    };
  
    try {
      const token = localStorage.getItem('token');
      let response;
  
      if (token) {
        response = await axios.post(`${BASE_URL}/orders`, orderData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        response = await axios.post(`${BASE_URL}/orders/guest`, orderData);
      }
      setNotification({ message: 'Замовлення створене!', type: 'success' });
      setTimeout(() => setNotification(null), 5000);

      // setSuccess('Заказ успешно создан!');
      clearCart();
      setFormData({ fullName: '', phoneNumber: '', email: '', shippingAddress: '' });
      setTimeout(() => navigate(token ? '/profile' : '/'), 1000);
    } catch (err) {
      console.error('Ошибка при создании заказа:', err);
      setError('Не удалось создать заказ. Попробуйте снова.');
    }
  };

  const handleContinue = () => {
    if (cart.length === 0) {
      setError('Корзина пуста.');
      return;
    }
    setError('');
    setStep(2);
  };
  
  const handleBack = () => {
    setStep(1);
    setError('');
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
        <h1 className="panel-title" onClick={() => navigate('/')}>Anika</h1>
        <div className="top-panel-actions">
          <button onClick={() => navigate('/cart')} className="cart-button">
            <img src="/icons/shopping-bag.svg" alt="Кошик" className="icon" />
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
        <div className="cart-container">
          <h1>Ваш кошик</h1>
          <AnimatePresence mode="wait">
            {step === 1 && (
                <>
                {cart.length === 0 ? (
                  <p>Ваш кошик порожній.</p>
                ) : (
                  <div>
                    {cart.map((item) => (
                      <div key={item.id} className="cart-item">
                        <img
                          src={`${BASE_URL}${item.imageUrl}`}
                          alt={item.name}
                          className="cart-item-image"
                        />
                        <h3>{item.name}</h3>
                        <p>Ціна: {Number(item.price).toFixed(2)}₴</p>
                        <p>Кількість: {item.quantity}</p>
                        <button onClick={() => removeFromCart(item.id)}>Видалити</button>
                      </div>
                    ))}
                    <div className="cart-total">
                      <h2>До сплати: {total.toFixed(2)}₴</h2>
                    </div>
                    <div className="cart-actions">
                      <button onClick={handleContinue}>Продовжити</button>
                      <button onClick={() => {
                        clearCart();
                        window.location.reload();
                    }}>
                      Очистити
                    </button>
                    </div>
                  </div>
                )}
                {error && <p className="error-message">{error}</p>}
                </>
            )}
            {step === 2 && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -90 }}
                transition={{ duration: 0.3 }}
                className="checkout-wrapper"
              >
                <form onSubmit={handleCheckout} className="checkout-form">
                  <h2>Оформлення замовлення</h2>
                  {!isAuthenticated && (
                    <p className="guest-notice">
                      Гостьові замовлення не відображаються у профілі. Увійдіть, щоб відстежувати замовлення.
                    </p>
                  )}
                  <input
                    type="text"
                    name="fullName"
                    placeholder="ПІБ"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Номер телефону"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    name="shippingAddress"
                    placeholder="Адреса доставки"
                    value={formData.shippingAddress}
                    onChange={handleInputChange}
                    required
                  />
                  {error && <p className="error-message">{error}</p>}
                  {success && <p className="success-message">{success}</p>}
                  <div className="form-actions">
                    <button type="button" onClick={handleBack}>Назад</button>
                    <button type="submit">Оформити замовлення</button>
                  </div>
                </form>
                {/* Новый блок для итогов заказа */}
                <div className="order-summary">
                  <h2>Ваше замовлення:</h2>
                  <ul>
                    {cart.map((item) => (
                      <li key={item.id}>
                        <div className="info-row">
                          <span className="label">{item.name} — {item.quantity} шт.</span>
                          <span className="value">{(item.price * item.quantity).toFixed(2)}₴</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="summary-total">
                    <span className="total-label">Итого:</span>
                    <span className="total-value">{total.toFixed(2)}₴</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};

export default Cart;