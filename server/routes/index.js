var express = require('express');
var router = express.Router();
var product = require('../model/productModel');
const multer = require('multer');
const cart = require('../model/cartModel');
const path = require('path');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');

router.use(bodyParser.json());
router.use(cors());

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directory to store uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const fileTypes = /jpeg|jpg|png/; // Allowed file types
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error('Only images (jpeg, jpg, png) are allowed!'));
    }
  },
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Register a new user
router.post('/register', async (req, res) => {
  bcrypt.hash(req.body.password, 10, async function(err, hash) {
    if (err) {
      res.status(500).send({ msg: "Error in password encryption!!!" });
    } else {
      const data = new user({
        name: req.body.name,
        email: req.body.email,
        password: hash
      });
      await data.save();
      res.status(200).send({ data, msg: "Data added successfully" });
    }
  });
});

// User login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ msg: "Please enter all fields!" });
  }
  const data = await user.findOne({ email });
  if (!data) {
    return res.status(401).send({ msg: "Invalid credentials!" });
  }
  const match = await bcrypt.compare(password, data.password);
  if (!match) {
    return res.status(401).send({ msg: "Invalid credentials!" });
  }
  res.status(200).send({ msg: "Login successful!" });
});

// Add Product with Image Upload
router.post('/add-product', upload.single('image'), async (req, res) => {
  try {
    const { title, description, price } = req.body;

    // Check if the image was uploaded
    if (!req.file) {
      return res.status(400).send({ msg: 'Image upload failed!' });
    }

    // Log the incoming data for debugging
    console.log('Request Body:', req.body);
    console.log('Uploaded File:', req.file);

    // Create a new product instance
    const data = new product({
      title,
      description,
      price,
      image: req.file.path, // Save the file path to the database
    });

    // Save the product to the database
    await data.save();

    res.status(200).send({
      data,
      msg: 'Product added successfully!',
    });
  } catch (err) {
    console.error('Error adding product:', err); // Log the error for debugging
    res.status(500).send({
      msg: 'Error adding product!',
      error: err.message,
    });
  }
});

// Get all products
router.get('/get-all-products', async (req, res) => {
  const data = await product.find();
  res.status(200).send({ data, msg: "Data fetched successfully!" });
});

// Get product by ID
router.get('/get-product/:productId', async (req, res) => {
  const productId = req.params.productId;
  const data = await product.findById(productId);
  res.status(200).send({ data, msg: "Product fetched successfully!" });
});

// Add product to cart
router.post('/add-cart', async (req, res) => {
  const data = new cart({
    productId: req.body.productId,
    email: req.body.email,
    quantity: 1
  });
  await data.save();
  res.status(200).send({ msg: "Product added to cart successfully!" });
});

// Get all cart items
router.get('/get-cart-items', async (req, res) => {
  const data = await cart.find();
  res.status(200).send({ data, msg: "Cart fetched successfully!" });
});

// Delete cart item by productId
router.delete('/delete-item/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deletedItem = await cart.findOneAndDelete({ productId: id });  // Use productId field directly
    if (!deletedItem) {
      return res.status(404).send({ msg: "Cart item not found!" });
    }
    res.status(200).send({ msg: "Cart item deleted successfully!" });
  } catch (err) {
    res.status(500).send({ msg: "Error deleting cart item!", error: err.message });
  }
});

// Serve static files from the "uploads" directory
router.use('/uploads', express.static('uploads'));

module.exports = router;
