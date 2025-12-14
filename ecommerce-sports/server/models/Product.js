const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative']
    },
    category: {
        type: String,
        required: [true, 'Product category is required'],
        enum: {
            values: ['Footwear', 'Apparel', 'Equipment', 'Accessories'],
            message: 'Category must be Footwear, Apparel, Equipment, or Accessories'
        }
    },
    image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80'
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    stock: {
        type: Number,
        default: 100,
        min: [0, 'Stock cannot be negative']
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

productSchema.index({ name: 'text', category: 1 });

productSchema.virtual('formattedPrice').get(function () {
    return `₹${this.price.toFixed(2)}`;
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
