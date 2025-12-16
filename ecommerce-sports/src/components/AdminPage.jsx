import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState("products");
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [newProduct, setNewProduct] = useState({
        name: "",
        price: "",
        category: "",
        image: "",
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const navigate = useNavigate();

    // Get token from storage
    const getToken = () => {
        return localStorage.getItem('token') || sessionStorage.getItem('token');
    };

    // Fetch products from API on component mount
    useEffect(() => {
        fetchProducts();
    }, []);

    // Fetch orders when orders tab is active
    useEffect(() => {
        if (activeTab === "orders") {
            fetchOrders();
        }
    }, [activeTab]);

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

    const fetchOrders = async () => {
        setOrdersLoading(true);
        try {
            const token = getToken();
            const response = await fetch('http://localhost:3000/api/orders/admin/all', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setOrders(data.orders);
            } else {
                setMessage(data.message || "Failed to fetch orders");
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setMessage("Failed to fetch orders. Is the server running?");
        } finally {
            setOrdersLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
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

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const token = getToken();
            const response = await fetch(`http://localhost:3000/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await response.json();
            if (data.success) {
                setOrders(orders.map(order =>
                    order._id === orderId ? data.order : order
                ));
                setMessage(`Order status updated to ${newStatus}`);
                setTimeout(() => setMessage(""), 3000);
            } else {
                setMessage(data.message || "Failed to update order status");
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            setMessage("Error updating order status");
            setTimeout(() => setMessage(""), 3000);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Delivered":
                return "bg-green-500";
            case "Shipped":
                return "bg-blue-500";
            case "Processing":
                return "bg-yellow-500";
            case "Cancelled":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
                    <p className="text-gray-400 mt-2">Manage your products and orders</p>
                </div>
            </section>

            {/* Tabs */}
            <section className="max-w-7xl mx-auto px-6 pt-8">
                <div className="flex gap-4 border-b border-gray-300">
                    <button
                        onClick={() => setActiveTab("products")}
                        className={`px-6 py-3 font-semibold text-lg transition-all ${activeTab === "products"
                                ? "text-yellow-500 border-b-4 border-yellow-500"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        <i className="ri-box-3-line mr-2"></i>
                        Products
                    </button>
                    <button
                        onClick={() => setActiveTab("orders")}
                        className={`px-6 py-3 font-semibold text-lg transition-all ${activeTab === "orders"
                                ? "text-yellow-500 border-b-4 border-yellow-500"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        <i className="ri-file-list-3-line mr-2"></i>
                        Orders
                        {orders.length > 0 && (
                            <span className="ml-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full">
                                {orders.length}
                            </span>
                        )}
                    </button>
                </div>
            </section>

            {/* Toast Message */}
            {message && (
                <div className="fixed top-20 right-6 bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-down">
                    {message}
                </div>
            )}

            {/* Products Tab Content */}
            {activeTab === "products" && (
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
            )}

            {/* Orders Tab Content */}
            {activeTab === "orders" && (
                <section className="max-w-7xl mx-auto px-6 py-12">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-extrabold text-gray-900">
                            Customer <span className="text-yellow-500">Orders</span>
                            <span className="text-lg font-normal text-gray-500 ml-2">
                                ({orders.length})
                            </span>
                        </h2>
                        <button
                            onClick={fetchOrders}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition flex items-center gap-2"
                        >
                            <i className="ri-refresh-line"></i>
                            Refresh
                        </button>
                    </div>

                    {ordersLoading ? (
                        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
                            <p className="mt-4 text-gray-500">Loading orders...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                            <i className="ri-file-list-3-line text-6xl text-gray-300 mb-4"></i>
                            <p className="text-gray-500 text-lg">No orders yet</p>
                            <p className="text-gray-400 mt-2">Orders from customers will appear here</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <div
                                    key={order._id}
                                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                                >
                                    {/* Order Header */}
                                    <div className="bg-gray-50 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b">
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Order ID: <span className="font-mono text-gray-700">{order._id}</span>
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Placed: {formatDate(order.createdAt)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span
                                                className={`${getStatusColor(order.status)} text-white px-4 py-1 rounded-full text-sm font-semibold`}
                                            >
                                                {order.status}
                                            </span>
                                            <span className="text-xl font-extrabold text-yellow-500">
                                                ₹{order.totalAmount?.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Customer Info */}
                                    <div className="px-6 py-4 bg-blue-50 border-b">
                                        <div className="flex flex-wrap items-center gap-6">
                                            <div className="flex items-center gap-2">
                                                <i className="ri-user-line text-blue-500"></i>
                                                <span className="font-semibold text-gray-800">
                                                    {order.user?.name || 'Unknown User'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <i className="ri-mail-line text-blue-500"></i>
                                                <span className="text-gray-600">
                                                    {order.user?.email || 'No email'}
                                                </span>
                                            </div>
                                            {order.shippingAddress && (
                                                <div className="flex items-center gap-2">
                                                    <i className="ri-map-pin-line text-blue-500"></i>
                                                    <span className="text-gray-600">
                                                        {order.shippingAddress.city || 'No address'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="p-6">
                                        <h4 className="font-semibold text-gray-700 mb-4">Order Items:</h4>
                                        <div className="space-y-3">
                                            {order.items?.map((item, index) => (
                                                <div key={index} className="flex items-center gap-4">
                                                    <img
                                                        src={item.image || 'https://via.placeholder.com/60'}
                                                        alt={item.name}
                                                        className="w-14 h-14 object-cover rounded-lg"
                                                    />
                                                    <div className="flex-1">
                                                        <h5 className="font-semibold text-gray-900">
                                                            {item.name}
                                                        </h5>
                                                        <p className="text-sm text-gray-500">
                                                            Qty: {item.quantity} × ₹{item.price}
                                                        </p>
                                                    </div>
                                                    <span className="font-bold text-gray-900">
                                                        ₹{(item.price * item.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Order Actions */}
                                    <div className="px-6 py-4 bg-gray-50 border-t flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-medium text-gray-600">Update Status:</span>
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => updateOrderStatus(order._id, 'Processing')}
                                                className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition"
                                                disabled={order.status === 'Processing'}
                                            >
                                                Process
                                            </button>
                                            <button
                                                onClick={() => updateOrderStatus(order._id, 'Shipped')}
                                                className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition"
                                                disabled={order.status === 'Shipped'}
                                            >
                                                Ship
                                            </button>
                                            <button
                                                onClick={() => updateOrderStatus(order._id, 'Delivered')}
                                                className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition"
                                                disabled={order.status === 'Delivered'}
                                            >
                                                Deliver
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            <Footer />
        </div>
    );
};

export default AdminPage;
