import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import TopPanel from './TopPanel'; 
import './Profile.css';
import './Panel.css';

const Profile = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate();
  const hostn =
    window.location.hostname === 'localhost'
      ? 'http://localhost:5000'
      : 'http://192.168.0.100:5000';


  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    } catch (e) {
      return true;
    }
  };

  useEffect(() => {
    const storedUserData = localStorage.getItem('user_data');
    const token = localStorage.getItem('token');
  
    if (storedUserData && token && !isTokenExpired(token)) {
      setUserData(JSON.parse(storedUserData));
    } else {
      localStorage.removeItem('user_data');
      localStorage.removeItem('token');
    }
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Токен отсутствует');
          return;
        }
  
        const response = await axios.get(`${hostn}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const sortedOrders = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
  
        setOrders(sortedOrders);
        if (sortedOrders.length > 0) {
          setExpandedOrder(sortedOrders[0].id);
        }
      } catch (err) {
        console.error('Ошибка при загрузке заказов:', err);
      }
    };
  
    if (userData) {
      fetchOrders();
    }
  }, [userData]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(`${hostn}/auth/login`, {
        email,
        password,
      });

      const { user, access_token } = response.data;
      setUserData(user);


      localStorage.removeItem('user_data');
      localStorage.removeItem('token');

      localStorage.setItem('user_data', JSON.stringify(user));
      localStorage.setItem('token', access_token);
      window.location.reload();
      setOrders([]);
    } catch (err) {
      console.error('Ошибка при входе:', err);
      setError('Неверный логин или пароль.');
    }
  };

  const handleLogout = () => {
    setUserData(null);
    setEmail('');
    setPassword('');
    setOrders([]);
    
    localStorage.removeItem('user_data');
    localStorage.removeItem('token');

    window.location.reload();
  };

  const formatOrderId = (id) => {
    return `${id.slice(0, 6)}...${id.slice(-4)}`;
  };

  const toggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
    <TopPanel isAuthenticated={userData} />
      <div className="profile-container">
        {!userData ? (
          <div className="login-container">
            <form onSubmit={handleLogin} className="login-form">
              <h1>Профіль</h1>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Увійти</button>
              {error && <p className="error-message">{error}</p>}
            </form>
            <p onClick={() => navigate('/register')} className="msg-create-acc">Досі не з нами? <span className="span-create-account">Створити акаунт</span></p>
            {/* <a className="admin-panel-link" href="/admin">Admin Panel</a> */}
          </div>
        ) : (
          <div className="user-info">
            <h1>Вітаємо, {userData.name}!</h1>
            <div className="info-row">
              <span className="label">Пошта</span>
              <span className="value">{userData.email}</span>
            </div>
            <div className="info-row">
              <span className="label">Телефон</span>
              <span className="value">{userData.phone}</span>
            </div>
            <button onClick={handleLogout} className="action-button">Вийти</button>

            {orders.length > 0 ? (
              <div className="orders-list">
                <h2>Ваші замовлення:</h2>
                <ul>
                  {orders.map((order) => (
                    <li key={order.id}>
                      <div
                        className="order-header"
                        onClick={() => toggleOrder(order.id)}
                      >
                        <div className="info-row">
                          <span className="label order-label">Замовлення №</span>
                          <span className="value">{formatOrderId(order.id)}</span>
                          <span className={`arrow ${expandedOrder === order.id ? 'up' : 'down'}`}>
                            ▼
                          </span>
                        </div>
                      </div>
                      {expandedOrder === order.id && (
                        <div className="order-details">
                          <div className="info-row">
                            <span className="label">Дата</span>
                            <span className="value">{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="info-row">
                            <span className="label">Загальна вартість</span>
                            <span className="value">{order.totalPrice.toFixed(2)}₴</span>
                          </div>
                          <div className="info-row">
                            <span className="label">Статус</span>
                            <span className={`value status-${order.status.toLowerCase()}`}>
                              {order.status}
                            </span>
                          </div>
                          {order.items?.length > 0 && (
                            <div className="order-items">
                              <div className="info-row">
                                <span className="label">Товари</span>
                                <span className="value"></span>
                              </div>
                              <ul>
                                {order.items.map((item, index) => (
                                  <li key={index}>
                                    <div className="info-row">
                                      <span className="label"></span>
                                      <span className="value">
                                        {item.product?.name} — {item.quantity} шт. × {item.product?.price}₴
                                      </span>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="no-orders">У вас немає замовлень.</p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Profile;