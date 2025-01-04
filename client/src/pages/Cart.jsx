import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartItem from '../components/CartItem';
import axios from 'axios';
import styled from "styled-components";
import { FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Cart() {
  const [cartData, setCartData] = useState([]);
  const [email, setEmail] = useState(null);
  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0); // Track total price
  const [totalItems, setTotalItems] = useState(0); // Track total items
  const [amount, setAmount] = useState('');

  // Fetch user email on component mount
  useEffect(() => {
    setEmail(localStorage.getItem('email'));
  }, []);

  // Fetch cart and product data from the server
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const cartResponse = await axios.get('http://localhost:7000/get-cart-items');
        const cartItems = cartResponse.data.data;

        // Fetch product details for each cart item
        const productDetailsPromises = cartItems.map(item =>
          axios.get(`http://localhost:7000/get-product/${item.productId}`).then(response => ({
            ...item,
            productDetails: response.data.data, // Attach product details
            price: parseFloat(response.data.data.price) || 0, // Ensure price is a number
          }))
        );

        const updatedCartData = await Promise.all(productDetailsPromises);
        setCartData(updatedCartData);

        // Calculate initial total price and total items
        const initialTotalPrice = updatedCartData.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const initialTotalItems = updatedCartData.reduce((acc, item) => acc + item.quantity, 0);

        setTotalPrice(initialTotalPrice);
        setTotalItems(initialTotalItems);
      } catch (error) {
        console.error("Error fetching cart or product data:", error);
      }
    };

    fetchCartData();
  }, []);

  const updateCartData = (productId, updatedQuantity) => {
    setCartData(prevCartData =>
      prevCartData.map(item =>
        item.productId === productId ? { ...item, quantity: updatedQuantity } : item
      )
    );

    // Update total price and items after quantity change
    const updatedCartData = cartData.map(item =>
      item.productId === productId ? { ...item, quantity: updatedQuantity } : item
    );

    const updatedTotalPrice = updatedCartData.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const updatedTotalItems = updatedCartData.reduce((acc, item) => acc + item.quantity, 0);

    setTotalPrice(updatedTotalPrice);
    setTotalItems(updatedTotalItems);
  };

  const handleItemRemoval = (productId) => {
    const filteredCartData = cartData.filter(item => item.productId !== productId);
    setCartData(filteredCartData);

    // Recalculate totals after removal
    const updatedTotalPrice = filteredCartData.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const updatedTotalItems = filteredCartData.reduce((acc, item) => acc + item.quantity, 0);

    setTotalPrice(updatedTotalPrice);
    setTotalItems(updatedTotalItems);
  };

  const logout = () => {
    if (window.confirm('Do you want to log out?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const StyledHeader = styled.header`
    background-color: #B1F0F7;
    width: 100%;
    padding: 10px 12px 8px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .nav_logo {
      padding: 0 12px;
      .nav-logo-link {
        text-decoration: none;
        font-size: 24px;
        color: #fab005;
        font-weight: bold;
      }
    }
    .menuToggleBtn {
      display: none;
      color: white;
      font-size: 24px;
      position: absolute;
      right: 20px;
      top: 15px;
      cursor: pointer;
    }

    @media screen and (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
      .menuToggleBtn {
        display: block;
      }
    }
  `;

  const NavManu = styled.ul`
    list-style: none;
    display: flex;

    li {
      &:hover {
        cursor: pointer;
        background: #44a8f4;
        border-radius: 4px;
      }
    }
    .nav-menu-list {
      text-decoration: none;
      color: black;
      display: block;
      padding: 10px 30px;
    }
    @media screen and (max-width: 768px) {
      display: ${(props) => (props.isToggleOpen ? "block" : "none")};
      flex-direction: column;
      align-items: center;
      width: 100%;
      margin-top: 5px;
    }
  `;

  const handleToggleOpen = () => {
    setIsToggleOpen(!isToggleOpen);
  };

  async function razorPayHandler() {
    setAmount(totalPrice.toFixed(2));
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
    <>
      <section className='home'>
        <div className="d-flex">
          <Header />
          <section className="product-list">
            <div className="product-list-head">
              <header className="responsive-header d-flex" style={{ position: "relative" }}>
                <div className="logo" style={{ height: "20px", width: "fit-content" }}>
                  <h3 style={{ marginTop: "-25px" }}>E<span>COM</span></h3>
                </div>

                <NavManu isToggleOpen={isToggleOpen}>
                  <li>
                    <Link to={"/"} className="nav-menu-list">HOME</Link>
                  </li>
                  <li>
                    <Link to={"/cart"} className="nav-menu-list">CART</Link>
                  </li>
                  <li>
                    <Link to={"/add-product"} className="nav-menu-list">ADD PRODUCT</Link>
                  </li>
                  {!email ? (
                    <li>
                      <Link to={"/login"} className="nav-menu-list">LOGIN</Link>
                    </li>
                  ) : (
                    <li>
                      <Link onClick={logout} className="nav-menu-list">LOGOUT</Link>
                    </li>
                  )}
                </NavManu>
                <FaBars className="menuToggleBtn" style={{ position: "absolute", right: 30, top: 20 }} onClick={handleToggleOpen} />
              </header>
              <h3>CART</h3>
            </div>
            <div className="buy-cart-product d-flex">
              <h4>Total Items: {totalItems}</h4>
              <h4>Total Price: ₹{totalPrice.toFixed(2)}</h4>
              <button className='buy-button' onClick={razorPayHandler}>PLACE ORDER</button>
            </div>
            <div className="container">
              {cartData.length > 0 ? (
                <div className="d-grid">
                  {cartData.map((item) => (
                    <CartItem
                      key={item.productId}
                      productId={item.productId}
                      quantity={item.quantity}
                      productDetails={item.productDetails}
                      onQuantityChange={updateCartData}
                      onRemoveItem={handleItemRemoval}
                    />
                  ))}
                </div>
              ) : (
                <h4>No data found!</h4>
              )}
            </div>
          </section>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Cart;
