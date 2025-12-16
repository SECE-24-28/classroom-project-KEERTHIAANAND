import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const CartPage = () => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch cart from API on component mount
    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await fetch('http://localhost:3000/cart');
            const data = await response.json();
            setCart(data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId, change) => {
        // Support both productId, product, and id fields
        const item = cart.find(item => (item.productId || item.product || item.id) === productId);
        if (!item) return;

        const newQuantity = item.quantity + change;

        try {
            const response = await fetch(`http://localhost:3000/cart/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({ quantity: newQuantity }),
            });

            if (response.ok) {
                const result = await response.json();
                setCart(result.cart);
            }
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    };

    const removeItem = async (productId) => {
        try {
            const response = await fetch(`http://localhost:3000/cart/${productId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const result = await response.json();
                setCart(result.cart);
            }
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 100 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const handleCheckout = async () => {
        // Check if user is logged in (check both storages)
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const isLoggedIn = sessionStorage.getItem("isLoggedIn");

        if (!token && isLoggedIn !== "true") {
            navigate("/login");
            return;
        }

        try {
            // Prepare order items
            const orderItems = cart.map(item => ({
                productId: item.productId || item.product || item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            }));

            // Place order via API
            const response = await fetch('http://localhost:3000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    items: orderItems,
                    totalAmount: total,
                    shippingAddress: {
                        fullName: 'Customer',
                        address: 'Default Address',
                        city: 'City',
                        postalCode: '000000',
                        phone: '0000000000'
                    },
                    paymentMethod: 'Cash on Delivery'
                })
            });

            const data = await response.json();

            if (data.success) {
                // Also save to localStorage for OrdersPage (backward compatibility)
                const orders = JSON.parse(localStorage.getItem("orders") || "[]");
                const newOrder = {
                    id: data.order._id,
                    items: cart,
                    total: total,
                    date: new Date().toLocaleDateString(),
                    status: "Pending",
                };
                orders.push(newOrder);
                localStorage.setItem("orders", JSON.stringify(orders));

                // Clear cart via API
                await fetch('http://localhost:3000/cart', {
                    method: 'DELETE',
                });
                setCart([]);
                navigate("/orders");
            } else {
                alert(data.message || 'Failed to place order');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Error placing order. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar activePage="cart" />

            {/* Page Header */}
            <section className="bg-gradient-to-r from-yellow-400 to-yellow-500 py-12">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-4xl font-extrabold text-white">Shopping Cart</h1>
                </div>
            </section>

            {/* Cart Content */}
            <section className="max-w-7xl mx-auto px-6 py-12">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
                        <p className="mt-4 text-gray-500">Loading cart...</p>
                    </div>
                ) : cart.length === 0 ? (
                    <div className="text-center py-20">
                        <i className="ri-shopping-cart-line text-8xl text-gray-300 mb-6"></i>
                        <h2 className="text-2xl font-bold text-gray-700 mb-4">Your cart is empty</h2>
                        <p className="text-gray-500 mb-6">Add some products to get started!</p>
                        <Link
                            to="/products"
                            className="bg-yellow-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((item) => (
                                <div
                                    key={item.productId || item.product || item.id}
                                    className="bg-white rounded-xl p-6 shadow-lg flex items-center gap-6"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-24 h-24 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                                        <p className="text-yellow-500 font-extrabold text-xl">
                                            ₹{item.price}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => updateQuantity(item.productId || item.product || item.id, -1)}
                                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-yellow-500 hover:text-white transition"
                                        >
                                            -
                                        </button>
                                        <span className="font-bold text-lg w-8 text-center">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.productId || item.product || item.id, 1)}
                                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-yellow-500 hover:text-white transition"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.productId || item.product || item.id)}
                                        className="text-red-500 hover:text-red-700 transition"
                                    >
                                        <i className="ri-delete-bin-line text-xl"></i>
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white rounded-xl p-6 shadow-lg h-fit">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-4 border-b pb-4 mb-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax (8%)</span>
                                    <span>₹{tax.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between text-xl font-extrabold text-gray-900 mb-6">
                                <span>Total</span>
                                <span className="text-yellow-500">₹{total.toFixed(2)}</span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full bg-yellow-500 text-white py-4 rounded-lg font-bold text-lg hover:bg-yellow-600 transition"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                )}
            </section>

            <Footer />
        </div>
    );
};

export default CartPage;
