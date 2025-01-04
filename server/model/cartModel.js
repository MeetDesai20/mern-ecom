const mongoose = require("mongoose");

const cartModel = mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    email: String,
    quantity: { type: Number, default: 1, min: 1 },
})

const cart = mongoose.model("cart", cartModel);

module.exports = cart;