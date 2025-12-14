import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";

const AdminPage = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        name: "",
        price: "",
        category: "",
        image: "",
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch products from API on component mount
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:3000/products');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            setMessage("Failed to fetch products. Is the server running?");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/login");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newProduct.name || !newProduct.price || !newProduct.category) {
            setMessage("Please fill in all required fields");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({
                    name: newProduct.name,
                    price: parseFloat(newProduct.price),
                    category: newProduct.category,
                    image: newProduct.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80'
                }),
            });

            if (response.ok) {
                const result = await response.json();
                setProducts([...products, result.product]);
                setNewProduct({
                    name: "",
                    price: "",
                    category: "",
                    image: "",
                });
                setMessage("Product added successfully!");
                setTimeout(() => setMessage(""), 3000);
            } else {
                setMessage("Failed to add product");
            }
        } catch (error) {
            console.error('Error adding product:', error);
            setMessage("Error adding product. Is the server running?");
            setTimeout(() => setMessage(""), 3000);
        }
    };

    const deleteProduct = async (productId) => {
        try {
            const response = await fetch(`http://localhost:3000/products/${productId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Support both _id and id for filtering
                setProducts(products.filter((p) => (p._id || p.id) !== productId));
                setMessage("Product deleted successfully!");
                setTimeout(() => setMessage(""), 3000);
            } else {
                setMessage("Failed to delete product");
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            setMessage("Error deleting product");
            setTimeout(() => setMessage(""), 3000);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Admin Navbar */}
            <nav className="w-full bg-black shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="text-2xl font-extrabold">
                        <span className="text-yellow-500">Sport</span>
                        <span className="text-white">Zone</span>
                        <span className="text-yellow-500 text-sm ml-2">Admin</span>
                    </Link>

                    <ul className="hidden md:flex items-center gap-10 text-gray-300 font-medium">
                        <li>
                            <Link to="/" className="cursor-pointer hover:text-yellow-500 transition">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/products" className="cursor-pointer hover:text-yellow-500 transition">
                                Shop
                            </Link>
                        </li>
                    </ul>

                    <button
                        onClick={handleLogout}
                        className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* Page Header */}
            <section className="bg-gradient-to-r from-gray-900 to-black py-12">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-4xl font-extrabold text-white">
                        Admin <span className="text-yellow-500">Dashboard</span>
                    </h1>
                    <p className="text-gray-400 mt-2">Manage your products and inventory</p>
                </div>
            </section>

            {/* Toast Message */}
            {message && (
                <div className="fixed top-20 right-6 bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-down">
                    {message}
                </div>
            )}

            <section className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Add Product Form */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
                            Add New <span className="text-yellow-500">Product</span>
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                                    placeholder="Pro Running Shoes"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Price ($) *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={newProduct.price}
                                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                                    placeholder="99.99"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Category *
                                </label>
                                <select
                                    value={newProduct.category}
                                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                                >
                                    <option value="">Select Category</option>
                                    <option value="Footwear">Footwear</option>
                                    <option value="Apparel">Apparel</option>
                                    <option value="Equipment">Equipment</option>
                                    <option value="Accessories">Accessories</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Image URL (optional)
                                </label>
                                <input
                                    type="url"
                                    value={newProduct.image}
                                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-yellow-500 text-white py-4 rounded-lg font-bold text-lg hover:bg-yellow-600 transition"
                            >
                                Add Product
                            </button>
                        </form>
                    </div>

                    {/* Products List */}
                    <div>
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
                            Added <span className="text-yellow-500">Products</span>
                            <span className="text-lg font-normal text-gray-500 ml-2">
                                ({products.length})
                            </span>
                        </h2>

                        {loading ? (
                            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
                                <p className="mt-4 text-gray-500">Loading products...</p>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                                <i className="ri-box-3-line text-6xl text-gray-300 mb-4"></i>
                                <p className="text-gray-500">No products added yet</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                                {products.map((product) => (
                                    <div
                                        key={product._id || product.id}
                                        className="bg-white rounded-xl shadow-lg p-4 flex items-center gap-4"
                                    >
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900">{product.name}</h4>
                                            <p className="text-sm text-gray-500">{product.category}</p>
                                        </div>
                                        <span className="font-extrabold text-yellow-500">
                                            ${product.price}
                                        </span>
                                        <button
                                            onClick={() => deleteProduct(product._id || product.id)}
                                            className="text-red-500 hover:text-red-700 transition p-2"
                                        >
                                            <i className="ri-delete-bin-line text-xl"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default AdminPage;
