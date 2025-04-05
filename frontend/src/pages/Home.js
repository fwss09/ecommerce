import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    
    fetchProducts();
  }, []);
  
  const goToProductPage = (id) => {
    navigate(`/products/${id}`);
  };

  const goToAdmin = () => {
    navigate('/admin');
  };

  return (
    
    <div className="home-container">
      <h1>Products</h1>
      <button onClick={goToAdmin} className='admin-button'>Admin Panel</button>
      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id} onClick={() => goToProductPage(product.id)}>
            {product.imageUrl && <img src={product.imageUrl} alt={product.name} draggable="false" className="product-image" />}
            <div className="product-details">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-price">{product.price} UAH</p>
              <button className="product-buy-button">Купить</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;