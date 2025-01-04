import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { FaBars } from "react-icons/fa";
import styled from "styled-components";

function Register() {

    const [name,setName] = useState();
    const [email,setEmail] = useState();
    const [password,setPassword] = useState();
    const navigate = useNavigate();
    const [isToggleOpen, setIsToggleOpen] = useState(false);
    const [remail, setREmail] = useState();
      
      useEffect(()=>{
        setREmail(localStorage.getItem('email'));
      },[])
    
      function logout() {
        if(window.confirm('Do you want to log out?')) {
          localStorage.clear();
          window.location.reload();
        }
      }

    function register(e) {
        e.preventDefault();
        axios.post('http://localhost:7000/register', {
            name: name,
            email: email,
            password: password
        })
        .then(function (response) {
            console.log(response);
            localStorage.setItem('email', email);
            navigate('/login');
        })
        .catch(function (error) {
            console.log(error);
        });
    }

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
            <section className='home'>
                <div className="d-flex">
                    <Header />
                    <div style={{width:"100%"}}>
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
                                !remail ? (
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
                        <div className="product-list-head">
                            <h3>REGISTER</h3>
                        </div>
                        <form className="login-form">
                            <div className="input-group">
                                <label htmlFor="name">NAME :</label>
                                <input type="text" onChange={(e)=>{setName(e.target.value)}} name="name" id="name" required/>
                            </div>
                            <div className="input-group">
                                <label htmlFor="email">EMAIL :</label>
                                <input type="email" onChange={(e)=>{setEmail(e.target.value)}} name="email" id="email" required/>
                            </div>
                            <div className="input-group">
                                <label htmlFor="password">PASSWORD :</label>
                                <input type="password" onChange={(e)=>{setPassword(e.target.value)}} name="password" id="password" required/>
                            </div>
                            <button type="submit" className="login-btn" onClick={register}>REGISTER</button>
                            <Link className='link-tag' to={'/login'}>Alredy have an account? Click here</Link>
                        </form>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    )
}

export default Register