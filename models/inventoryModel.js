const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  productCategory: {
    type: String, 
    required: true, 
  },
  productName: {
    type: String,
    required: true,
  },
  productDescription: {
    type: String,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  productImage: {
    type: String,
    required: true,
  },
  productQuantity: {
    type: Number,
    required: true,
  },
  stocksLeft: {
    type: Number,
    required: true,
  },
  stocksOut: {
    type: Number,
    required: false,
  }, 
}, {timestamps: true} );

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
