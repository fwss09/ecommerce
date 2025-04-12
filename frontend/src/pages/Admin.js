import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import './Admin.css';
import './fonts.css'
import './Messages.css'

const Admin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
  
        if (payload.exp < currentTime) {
          localStorage.removeItem('admin_token');
          setIsAdmin(false);
          setError('Сессия истекла. Пожалуйста, войдите снова.');
        } else if (payload.role === 'ADMIN') {
          setIsAdmin(true);
        } else {
          setError('Доступ запрещён. Вы не админ.');
        }
      } catch (e) {
        console.error('Ошибка при разборе токена:', e);
      }
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/auth/login', {
        email,
        password,
      });

      const { access_token } = response.data;
      const payload = JSON.parse(atob(access_token.split('.')[1]));

      if (payload.role === 'ADMIN') {
        setIsAdmin(true);
        localStorage.setItem('admin_token', access_token);
      } else {
        setError('Доступ запрещён. Вы не администратор.');
      }
    } catch (err) {
      console.error('Ошибка при логине:', err);
      setError('Неверный логин или пароль.');
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setError('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    if (image) {
      formData.append('file', image);
    }

    try {
      const response = await axios.post('http://localhost:5000/products', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setNotification({ message: 'Товар успешно добавлен!', type: 'success' });
      setTimeout(() => setNotification(null), 5000); 
      setName('');
      setDescription('');
      setPrice('');
      setImage(null);
      setShowModal(false);
    } catch (err) {
      console.error('Ошибка при добавлении товара:', err);
      setNotification({ message: 'Не удалось добавить товар. Попробуйте ещё раз', type: 'error' });
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/products');
      setProducts(response.data);
      setShowProductsModal(true);
    } catch (err) {
      console.error('Ошибка при получении товаров:', err);
      setError('Не удалось загрузить товары.');
    }
  };






  if (isAdmin) {
    const handleDeleteProduct = async (productId) => {
      try {
        await axios.delete(`http://localhost:5000/products/${productId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
          },
        });
        setProducts(products.filter(product => product.id !== productId));
        setNotification({ message: 'Товар успешно удалён!', type: 'success' });
        setTimeout(() => setNotification(null), 5000);
      } catch (err) {
        console.error('Ошибка при удалении товара:', err);
        setNotification({ message: 'Не удалось удалить товар. Попробуйте еще раз.', type: 'error' });
        setTimeout(() => setNotification(null), 5000); 
      }
    };
    return (
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
      <div className="admin-panel">
        <button className="home-button" onClick={() => navigate('/')}>
          Вернуться на главную
        </button>
        <h1 className="admin-title">Админ-панель</h1>
        <p className="admin-welcome">Добро пожаловать, администратор</p>
        <button className="def-btn" onClick={() => setShowModal(true)}>
          Добавить товар
        </button>
        <button className="def-btn" onClick={fetchProducts}>
          Посмотреть товары
        </button>
        {showModal && (
          <div className={`modal-overlay ${showModal ? 'active' : ''}`}>
            <div className="modal-content">
              <h2>Новый товар</h2>
              <form onSubmit={handleProductSubmit} className="product-form">
                <input
                  type="text"
                  placeholder="Название товара"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <textarea
                  placeholder="Описание товара"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Цена"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                />
                <div className="modal-buttons">
                  <button type="submit" className="submit-button">Добавить</button>
                  <button 
                    type="button" 
                    className="cancel-button" 
                    onClick={() => setShowModal(false)}
                  >
                    Отмена
                  </button>
                </div>
              </form>
              {/* {successMessage && <p className="success">{successMessage}</p>}
              {error && <p className="error">{error}</p>} */}
            </div>
          </div>
        )}
        {showProductsModal && (
          <div className="modal-overlay" onClick={() => setShowProductsModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Список товаров</h2>
              <ul className="product-list">
                {products.map((product) => (
                  <li key={product.id} className="product-item">
                    {product.name} - {product.price} UAH
                      <button 
                        className="delete-button" 
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Удалить
                    </button>
                  </li>
                ))}
              </ul>
              <button className="modal-close-button" onClick={() => setShowProductsModal(false)}>
                Закрыть
              </button>
            </div>
          </div>
        )}
      </div>
      </motion.div>
    );
  }









  
  return (
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className='form-admin'>
      <h1>Admin</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Enter</button>
      </form>
      {error && <p className='error-form'>{error}</p>}
    </div>
    </motion.div>
  );
};

export default Admin;