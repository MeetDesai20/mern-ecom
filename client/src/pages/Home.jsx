import React from 'react'
import Header from '../components/Header'
import ProductList from '../components/ProductList'
import Footer from '../components/Footer'

function Home() {
  return (
    <>
      <section className='home'>
        <div className="d-flex">
          <Header/>
          <ProductList/>
        </div>
      </section>

      <Footer/>
    </>
  )
}

export default Home