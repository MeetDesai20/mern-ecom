import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import styled from "styled-components";

function AddProduct() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    setEmail(localStorage.getItem("email"));
  }, []);

  function logout() {
    if (window.confirm("Do you want to log out?")) {
      localStorage.clear();
      window.location.reload();
    }
  }

  async function addProduct(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", image);

    try {
      const response = await axios.post("http://localhost:7000/add-product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert(response.data.msg);
    } catch (error) {
      console.error("Error adding product:", error);
      alert(error.response?.data?.msg || "Something went wrong!");
    }
  }

  const StyledHeader = styled.header`
    background-color: #b1f0f7;
    width: 100%;
    padding: 10px 12px 8px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
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
  `;

  const handleToggleOpen = () => {
    setIsToggleOpen(!isToggleOpen);
  };

  return (
    <>
      <section className="home">
        <div className="d-flex">
          <Header />
          <section className="product-list">
            <header className="responsive-header d-flex" style={{ position: "relative" }}>
              <div className="logo" style={{ height: "20px", width: "fit-content" }}>
                <h3 style={{ marginTop: "-20px", marginLeft: "20px" }}>
                  E<span>COM</span>
                </h3>
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
                {!email ? (
                  <li>
                    <Link to={"/login"} className="nav-menu-list">
                      LOGIN
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link onClick={logout} className="nav-menu-list">
                      LOGOUT
                    </Link>
                  </li>
                )}
              </NavManu>
              <FaBars
                className="menuToggleBtn"
                style={{ position: "absolute", right: 30, top: 20 }}
                onClick={handleToggleOpen}
              />
            </header>
            <div className="product-list-head">
              <h3>ADD PRODUCT</h3>
            </div>
            <div className="container">
              <form className="add-product" onSubmit={addProduct}>
                <div className="input-group">
                  <label htmlFor="title">TITLE :</label>
                  <br />
                  <input
                    type="text"
                    onChange={(e) => setTitle(e.target.value)}
                    name="title"
                    id="title"
                    placeholder="Enter product title"
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="description">DESCRIPTION :</label>
                  <br />
                  <input
                    type="text"
                    onChange={(e) => setDescription(e.target.value)}
                    name="description"
                    id="description"
                    placeholder="Enter description"
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="price">PRICE (in ₹) :</label>
                  <br />
                  <input
                    type="number"
                    onChange={(e) => setPrice(e.target.value)}
                    name="price"
                    id="price"
                    placeholder="Enter price"
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="image">IMAGE :</label>
                  <br />
                  <input
                    className="input-file"
                    onChange={(e) => setImage(e.target.files[0])}
                    type="file"
                    name="image"
                    id="image"
                    accept="image/*"
                    required
                  />
                </div>
                <button className="add-product-btn" type="submit">
                  ADD PRODUCT
                </button>
              </form>
            </div>
          </section>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default AddProduct;
