import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Header() {

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

  return (
    <>
        <header className="header">
          <div className="logo">
            <h3>E<span>COM</span></h3>
          </div>
          <ul>
            <Link className='link-tag' to={'/'}><li>HOME</li></Link>
            <Link className='link-tag' to={'/cart'}><li>CART</li></Link>
            <Link className='link-tag' to={'/add-product'}><li>ADD PRODUCT</li></Link>
            {
              (!email) ? (<Link className='link-tag' to={'/login'}><li>LOGIN</li></Link>) :
              (<Link className='link-tag' onClick={logout}><li>LOGOUT</li></Link>)
            }
          </ul>
        </header>
    </>
  )
}

export default Header