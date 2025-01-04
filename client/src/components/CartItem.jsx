import axios from 'axios';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

function CartItem({ productId, quantity, onQuantityChange, onRemoveItem, onUpdateTotal }) {
  const [noOfItem, setNoOfItem] = useState(quantity);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [price, setPrice] = useState(null); // Store the product price here

  useEffect(() => {
    // Fetch product details from the server
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:7000/get-product/${productId}`);
        const productData = response.data.data;

        console.log("Product data:", productData); // Debugging log

        const productPrice = isNaN(parseFloat(productData.price)) ? 0 : parseFloat(productData.price); // Ensure price is a valid number
        setPrice(productPrice); // Set the price in state

        setProduct(productData);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details.");
      }
    };

    fetchProduct();
  }, [productId]);

  const handleQuantityChange = (newQuantity) => {
    const quantityDifference = newQuantity - noOfItem;

    setNoOfItem(newQuantity);

    // Notify parent about the price change based on quantity difference
    if (onUpdateTotal) {
      onUpdateTotal(productId, quantityDifference * price); // Positive or negative change
    }

    // Notify parent about quantity change
    if (onQuantityChange) {
      onQuantityChange(productId, newQuantity);
    }
  };

  const increase = () => handleQuantityChange(noOfItem + 1);

  const decrease = () => {
    if (noOfItem > 1) {
      handleQuantityChange(noOfItem - 1);
    }
  };

  const removeCartItem = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(`http://localhost:7000/delete-item/${productId}`);
      console.log('Item removed:', response.data);

      // Notify parent to remove the item
      if (onRemoveItem) {
        onRemoveItem(productId);
      }
    } catch (err) {
      console.error('Error removing item from cart:', err);
      setError("Failed to remove item.");
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!product || price === null) { // Ensure product and price are loaded before rendering
    return <div>Loading...</div>;
  }

  return (
    <div className="product-card cart-item">
      <div className="product-image">
        <img src={product.image} alt={product.title || "Product"} />
      </div>
      <div className="product-content">
        <h3>{product.title || "Unknown Product"}</h3>
        <h4>₹{(price * noOfItem).toFixed(2)}</h4> {/* Use price state for total price calculation */}
        <p style={{ height: '35px', overflow: 'hidden' }}>
          {product.description || "No description available"}
        </p>
      </div>
      <div className="d-flex">
        <button className="decrease-item" onClick={decrease}>-</button>
        <input
          className="no-of-item"
          value={noOfItem}
          type="number"
          readOnly
        />
        <button className="increase-item" onClick={increase}>+</button>
      </div>
      <button className="add-to-cart" onClick={removeCartItem}>
        REMOVE FROM CART
      </button>
    </div>
  );
}

CartItem.propTypes = {
  productId: PropTypes.string.isRequired,
  quantity: PropTypes.number,
  onQuantityChange: PropTypes.func,
  onRemoveItem: PropTypes.func,
  onUpdateTotal: PropTypes.func.isRequired, // Function to update total price in parent
};

CartItem.defaultProps = {
  quantity: 1,
  onQuantityChange: null,
  onRemoveItem: null,
};

export default CartItem;
