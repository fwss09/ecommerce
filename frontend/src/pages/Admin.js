import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';

const Admin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
  
        if (payload.exp < currentTime) {
          // Токен истёк
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

    // Создаем форму данных для отправки
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    if (image) {
      formData.append('file', image);
    }

    try {
      // Отправка POST-запроса для добавления товара
      const response = await axios.post('http://localhost:5000/products', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccessMessage('Товар успешно добавлен!');
      setName('');
      setDescription('');
      setPrice('');
      setImage(null);
      setShowModal(false);
    } catch (err) {
      console.error('Ошибка при добавлении товара:', err);
      setError('Не удалось добавить товар. Попробуйте еще раз.');
    }
  };

  if (isAdmin) {
    return (
      <div className="admin-panel">
        <h1 className="admin-title">Админ-панель</h1>
        <p className="admin-welcome">Добро пожаловать, администратор</p>
        <button className="add-button" onClick={() => setShowModal(true)}>
          Добавить товар
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
              {successMessage && <p className="success">{successMessage}</p>}
              {error && <p className="error">{error}</p>}
            </div>
          </div>
        )}
      </div>
    );
  }
  return (
    <div className='form-admin'>
      <h1>Вход в админку</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Почта"
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
        <button type="submit">Войти</button>
      </form>
      {error && <p className='error-form'>{error}</p>}
    </div>
  );
};

export default Admin;
