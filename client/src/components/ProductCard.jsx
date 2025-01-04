import axios from 'axios';
import React, { useEffect, useState } from 'react';

function ProductCard({ product }) {
  const [email, setEmail] = useState();
  const [amount, setAmount] = useState('');

  useEffect(() => {
    setEmail(localStorage.getItem('email'));
  }, []);

  function addToCart() {
    if (email) {
      axios.post('http://localhost:7000/add-cart', {
        productId: product._id,
        email: email,
      })
        .then((response) => {
          console.log(response);
          alert('Product added to cart!');
        })
        .catch((error) => {
          console.error(error);
          alert('Failed to add product to cart.');
        });
    } else {
      alert('Please login to add product to cart!');
    }
  }

  async function razorPayHandler() {
    setAmount(product.price);
    // console.log(amount);

    try {
      const response = await axios.post('http://localhost:7000/api/payment/create-order', {
          amount: amount * 100, // Convert to smallest currency unit
      });

      const options = {
          key: process.env.rzp_test_ohX64rHrPjOalL, // Enter the Key ID generated from the Dashboard
          amount: response.data.amount,
          currency: response.data.currency,
          name: 'Your Company Name',
          description: 'Test Transaction',
          order_id: response.data.id,
          handler: function (response) {
              alert(`Payment successful: ${response.razorpay_payment_id}`);
          },
          prefill: {
              name: 'Your Name',
              email: 'your_email@example.com',
              contact: '9999999999',
          },
          notes: {
              address: 'note value',
          },
          theme: {
              color: '#F37254',
          },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
        console.error('Error creating order:', error);
    }
  }

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt="Product" />
      </div>
      <div className="product-content">
        <h3>{product.title}</h3>
        <h4>₹{product.price}</h4>
        <p style={{ height: "35px" }}>{product.description}</p>
      </div>
      <button className="add-to-cart" onClick={addToCart}>ADD TO CART</button>
      <button className="App-link buy" onClick={razorPayHandler}>
        BUY
      </button>
    </div>
  );
}

export default ProductCard;
