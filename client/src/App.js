import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import AddProduct from './pages/AddProduct';
import Cart from './pages/Cart';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/add-product" element={<AddProduct/>} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
      </Routes>
    </>
  );
}

export default App;
