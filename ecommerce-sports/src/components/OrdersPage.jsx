import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        setOrders(savedOrders.reverse());
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case "Delivered":
                return "bg-green-500";
            case "Shipped":
                return "bg-blue-500";
            case "Processing":
                return "bg-yellow-500";
            default:
                return "bg-gray-500";
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar activePage="orders" />

            {/* Page Header */}
            <section className="bg-gradient-to-r from-yellow-400 to-yellow-500 py-12">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-4xl font-extrabold text-white">My Orders</h1>
                </div>
            </section>

            {/* Orders Content */}
            <section className="max-w-7xl mx-auto px-6 py-12">
                {orders.length === 0 ? (
                    <div className="text-center py-20">
                        <i className="ri-file-list-3-line text-8xl text-gray-300 mb-6"></i>
                        <h2 className="text-2xl font-bold text-gray-700 mb-4">No orders yet</h2>
                        <p className="text-gray-500 mb-6">Start shopping to see your orders here!</p>
                        <Link
                            to="/products"
                            className="bg-yellow-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white rounded-xl shadow-lg overflow-hidden"
                            >
                                {/* Order Header */}
                                <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-b">
                                    <div>
                                        <p className="text-sm text-gray-500">Order #{order.id}</p>
                                        <p className="text-sm text-gray-500">Placed on {order.date}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span
                                            className={`${getStatusColor(order.status)} text-white px-4 py-1 rounded-full text-sm font-semibold`}
                                        >
                                            {order.status}
                                        </span>
                                        <span className="text-xl font-extrabold text-yellow-500">
                                            ₹{order.total.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex items-center gap-4">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900">
                                                        {item.name}
                                                    </h4>
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
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <Footer />
        </div>
    );
};

export default OrdersPage;
