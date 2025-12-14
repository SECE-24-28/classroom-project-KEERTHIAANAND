const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    productId: String,
    name: String,
    price: Number,
    category: String,
    image: String,
    quantity: { type: Number, default: 1 }
}, {
    versionKey: false
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;
