const mongoose = require("mongoose");

const orderModel = mongoose.Schema({
    items: [
        { 
          productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
          quantity: { type: Number, required: true, min: 1 }
        }
      ],
      totalAmount: Number,
      userDetails: {
        name: String,
        email: String
      },
      status: { 
        type: String, 
        default: 'Pending', 
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
      },
      createdAt: Date
    },  
)

const order = mongoose.model("order", orderModel);

module.exports = order;