import axios from 'axios';
import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard';
import { FaBars } from "react-icons/fa";
import { Link } from 'react-router-dom';
import styled from "styled-components";

function ProductList() {

  const [products, setProducts] = useState([]);
  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const [email, setEmail] = useState();
  
  useEffect(()=>{
    setEmail(localStorage.getItem('email'));
  },[])

  function logout() {
    if(window.confirm('Do you want to log out?')) {
      localStorage.clear();
      window.location.reload();
    }
  }

  useEffect(()=>{
    axios.get('http://localhost:7000/get-all-products')
    .then(function (response) {
      // handle success
      console.log(response);
      setProducts(response.data.data)
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
  },[])
  
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
    
  return (
    <>
        
        <section className="product-list">
          <div className="product-list-head">
            <header className="responsive-header d-flex" style={{position:"relative"}}>
              <div className="logo" style={{height:"20px",width:"fit-content"}}>
                <h3 style={{marginTop:"-25px"}}>E<span>COM</span></h3>
              </div>

              <NavManu isToggleOpen={isToggleOpen}>
                <li>
                  <Link to={"/"} className="nav-menu-list">
                    HOME
                  </Link>
                </li>
                <li>
                  <Link to={"/cart"} className="nav-menu-list">
                    CART
                  </Link>
                </li>
                <li>
                  <Link to={"/add-product"} className="nav-menu-list">
                    ADD PRODUCT
                  </Link>
                </li>
                {
                  !email ? (
                    <li>
                      <Link to={"/login"} className="nav-menu-list">
                        LOGIN
                      </Link>
                    </li>
                  ) :
                          (
                            <li>
                              <Link onClick={logout} className="nav-menu-list">
                                LOGOUT
                              </Link>
                            </li>
                          )
                }
              </NavManu>
                <FaBars className="menuToggleBtn" style={{position:"absolute",right:30,top:20}} onClick={handleToggleOpen} />
              </header>
            <h3>PRODUCTS LIST</h3>
           </div>   
          <div className="container d-grid" style={{padding:"20px 0px"}}>
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p>No products available</p>
            )}
          </div>
        </section>
    </>
  )
}

export default ProductList