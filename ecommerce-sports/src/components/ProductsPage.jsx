import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [cartMessage, setCartMessage] = useState("");
    const [loading, setLoading] = useState(true);

    // Fetch products from API on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/products');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const addToCart = async (product) => {
        try {
            // Use _id for MongoDB ObjectId or id for legacy support
            const productId = product._id || product.id;

            const response = await fetch('http://localhost:3000/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({
                    id: productId,
                    name: product.name,
                    price: product.price,
                    category: product.category,
                    image: product.image,
                    quantity: 1
                }),
            });

            if (response.ok) {
                setCartMessage(`${product.name} added to cart!`);
                setTimeout(() => setCartMessage(""), 2000);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            setCartMessage("Failed to add to cart");
            setTimeout(() => setCartMessage(""), 2000);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar activePage="shop" />
            {/* Page Header */}
            <section className="bg-gradient-to-r from-yellow-400 to-yellow-500 py-16">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-5xl font-extrabold text-white mb-4">Our Products</h1>
                    <p className="text-white/90 text-lg">
                        Discover the best sports gear for your active lifestyle
                    </p>
                </div>
            </section>

            {/* Toast Message */}
            {cartMessage && (
                <div className="fixed top-20 right-6 bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-down">
                    {cartMessage}
                </div>
            )}

            {/* Products Grid */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
                        <p className="mt-4 text-gray-500">Loading products...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No products available. Please check if the server is running.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div
                                key={product._id || product.id}
                                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
                            >
                                <div className="relative overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-extrabold text-yellow-500">
                                            ₹{product.price}
                                        </span>
                                        <button
                                            onClick={() => addToCart(product)}
                                            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-yellow-500 transition text-sm"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <Footer />
        </div>
    );
};

export default ProductsPage;
