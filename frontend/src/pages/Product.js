import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Product.css';

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/products/${id}`);
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
    return <div className="loading">Загрузка...</div>;
  }

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="product-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        Назад
      </button>
      <h1 className="product-title">{product.name}</h1>
      <img
        src={`${BASE_URL}${product.imageUrl}`}
        alt={product.name}
        className="product-page-image"
        onClick={openModal}
      />
      <p className="product-page-description">{product.description}</p>
      <p className="product-page-price">{product.price} UAH</p>
      <button className="product-buy-button">Купить</button>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={`${BASE_URL}${product.imageUrl}`}
              alt={product.name}
              className="modal-image"
            />
            <button className="modal-close-button" onClick={closeModal}>
              Закрыть
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Product;