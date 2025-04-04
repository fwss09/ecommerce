import React from 'react';
import useStore from '../stores/useStore';

const ProductCard: React.FC<{ product: any }> = ({ product }) => {
  const addProduct = useStore((state) => state.addProduct);

  return (
    <div>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>{product.price}</p>
      <button onClick={() => addProduct(product)}>Добавить в корзину</button>
    </div>
  );
};

export default ProductCard;