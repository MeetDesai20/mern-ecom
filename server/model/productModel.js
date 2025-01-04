const mongoose = require("mongoose");

const productModel = mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    image: String
})

const product = mongoose.model("product", productModel);

module.exports = product;