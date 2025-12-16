require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
}

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

app.get('/products', async (req, res) => {
    try {
        const Product = require('./models/Product');
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
});

app.get('/products/:id', async (req, res) => {
    try {
        const Product = require('./models/Product');
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
});

app.post('/products', async (req, res) => {
    try {
        const Product = require('./models/Product');
        const product = await Product.create({
            name: req.body.name,
            price: parseFloat(req.body.price),
            category: req.body.category,
            image: req.body.image || undefined,
            description: req.body.description
        });
        res.status(201).json({ message: 'Product added successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
});

app.delete('/products/:id', async (req, res) => {
    try {
        const Product = require('./models/Product');
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
});

// Legacy cart routes - Simple CartItem model
app.get('/cart', async (req, res) => {
    try {
        const CartItem = require('./models/Cart');
        const items = await CartItem.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart', error: error.message });
    }
});

app.post('/cart', async (req, res) => {
    try {
        const CartItem = require('./models/Cart');
        const { id, name, price, category, image, quantity } = req.body;

        // Check if item already exists
        let item = await CartItem.findOne({ productId: id.toString() });

        if (item) {
            item.quantity += (quantity || 1);
            await item.save();
        } else {
            item = await CartItem.create({
                productId: id.toString(),
                name,
                price,
                category,
                image,
                quantity: quantity || 1
            });
        }

        const allItems = await CartItem.find();
        res.status(201).json({ message: 'Item added to cart', cart: allItems });
    } catch (error) {
        res.status(500).json({ message: 'Error adding to cart', error: error.message });
    }
});

app.put('/cart/:id', async (req, res) => {
    try {
        const CartItem = require('./models/Cart');
        const { quantity } = req.body;

        const item = await CartItem.findOne({ productId: req.params.id });
        if (!item) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        if (quantity <= 0) {
            await CartItem.deleteOne({ productId: req.params.id });
        } else {
            item.quantity = quantity;
            await item.save();
        }

        const allItems = await CartItem.find();
        res.json({ message: 'Cart updated successfully', cart: allItems });
    } catch (error) {
        res.status(500).json({ message: 'Error updating cart', error: error.message });
    }
});

app.delete('/cart/:id', async (req, res) => {
    try {
        const CartItem = require('./models/Cart');
        await CartItem.deleteOne({ productId: req.params.id });

        const allItems = await CartItem.find();
        res.json({ message: 'Item removed from cart', cart: allItems });
    } catch (error) {
        res.status(500).json({ message: 'Error removing from cart', error: error.message });
    }
});

app.delete('/cart', async (req, res) => {
    try {
        const CartItem = require('./models/Cart');
        await CartItem.deleteMany({});
        res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error clearing cart', error: error.message });
    }
});

app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Start the server
        app.listen(PORT, () => {
            console.log('\nAvailable endpoints:');
            console.log('  Health Check: GET /health');
            console.log('');
            console.log('  API Routes (new):');
            console.log('    Products: GET/POST    /api/products');
            console.log('    Products: GET/PUT/DEL /api/products/:id');
            console.log('    Cart:     GET/POST    /api/cart');
            console.log('    Cart:     PUT/DEL     /api/cart/:productId');
            console.log('    Auth:     POST        /api/auth/register');
            console.log('    Auth:     POST        /api/auth/login');
            console.log('    Auth:     GET         /api/auth/me (protected)');
            console.log('');
            console.log('  Legacy Routes (backward compatible):');
            console.log('    Products: GET/POST    /products');
            console.log('    Products: GET/DEL     /products/:id');
            console.log('    Cart:     GET/POST    /cart');
            console.log('    Cart:     PUT/DEL     /cart/:id');
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
