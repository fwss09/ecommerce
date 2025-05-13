import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Register.css';
import './Panel.css';

const Register = () => {
  const [formData, setFormData] = useState({ email: '', password: '', name: '', phone: '' });
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const hostn =
  window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'http://192.168.0.100:5000';

  useEffect(() => {
      const token = localStorage.getItem('token');
      console.log('Token on /register:', token); // Отладка
      if (token) {
        navigate('/profile');
      }
    }, [navigate]);
    

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password.length < 5) {
      setNotification({ message: 'Пароль повинен містити щонайменше 5 символів', type: 'error' });
      setTimeout(() => setNotification(null), 5000);
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      setNotification({ message: 'Паролі не співпадають', type: 'error' });
      setTimeout(() => setNotification(null), 5000);
      return;
    }

    try {
      const response = await fetch(`${hostn}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log('Register response:', data); // Отладка
      if (data.token) {
        localStorage.setItem('token', data.token);
        navigate('/profile');
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleNameChange = (e) => {
    const value = e.target.value;

    const cleaned = value.replace(/[0-9]/g, '');
    setFormData({ ...formData, name: cleaned });
  };

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '');
    let result = '+38 ';
    if (digits.length > 2) {
      result += digits.slice(2, 3); // 0
    }
    if (digits.length > 3) {
      result += digits.slice(3, 5); // XX
    }
    if (digits.length > 5) {
      result += '-' + digits.slice(5, 8); // XXX
    }
    if (digits.length > 8) {
      result += '-' + digits.slice(8, 10); // XX
    }
    if (digits.length > 10) {
      result += '-' + digits.slice(10, 12); // XX
    }
    return result;
  };
  
  const handlePhoneChange = (e) => {
    const input = e.target.value;
    const formatted = formatPhone(input);
    setFormData({ ...formData, phone: formatted });
  };
  
  const handlePhoneFocus = () => {
    if (!formData.phone.startsWith('+38 0')) {
      setFormData({ ...formData, phone: '+38 0' });
    }
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
      {/* <div className="top-panel-actions">
        <button onClick={() => navigate('/cart')} className="cart-button">
          Cart
        </button>
        {isAuthenticated ? (
          <button
            onClick={() => navigate('/profile')}
            className="profile-button"
          >
            Профиль
          </button>
        ) : (
          <button
            onClick={() => navigate('/profile')}
            className="login-button"
          >
            Войти
          </button>
        )}
      </div> */}
    </div>
    <form onSubmit={handleSubmit} className="register-form">
    <h1>Реєстрація</h1>
    <div>
    <input
      type="text"
      value={formData.name}
      onChange={handleNameChange}
      placeholder="Ім'я*"
      required
    />
    </div>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Пошта*"
        required
      />
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        placeholder="Пароль*"
        required
      />
      <input
        type="password"
        value={formData.confirmPassword}
        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        placeholder="Повторіть пароль*"
        required
      />
      <input
        type="text"
        value={formData.phone}
        onChange={handlePhoneChange}
        onFocus={handlePhoneFocus}
        placeholder="Телефон*"
        required
        maxLength={18}
      />
      <button type="submit">Створити акаунт</button>
    </form>
    </motion.div>
    </>
  );
};

export default Register;