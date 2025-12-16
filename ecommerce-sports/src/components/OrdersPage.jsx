import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        try {
            const token = getToken();
            if (!token) {
                setOrders(JSON.parse(localStorage.getItem("orders") || "[]").reverse());
                setLoading(false);
                return;
            }
            const response = await fetch('http://localhost:3000/api/orders/my-orders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setOrders(data.success ? data.orders : JSON.parse(localStorage.getItem("orders") || "[]").reverse());
        } catch {
            setOrders(JSON.parse(localStorage.getItem("orders") || "[]").reverse());
        } finally {
            setLoading(false);
        }
    };

    const statusConfig = {
        Pending: { icon: "ri-time-line", color: "text-orange-500", bg: "bg-orange-100" },
        Processing: { icon: "ri-settings-3-line", color: "text-blue-500", bg: "bg-blue-100" },
        Shipped: { icon: "ri-truck-line", color: "text-purple-500", bg: "bg-purple-100" },
        Delivered: { icon: "ri-checkbox-circle-line", color: "text-green-500", bg: "bg-green-100" },
        Cancelled: { icon: "ri-close-circle-line", color: "text-red-500", bg: "bg-red-100" }
    };

    const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];

    const activeOrder = orders.find(o => (o._id || o.id) === selectedOrder) || orders[0];

    // Get first item name for display
    const getOrderTitle = (order) => {
        if (!order.items?.length) return 'Order';
        const firstName = order.items[0].name;
        if (order.items.length > 1) {
            return `${firstName} +${order.items.length - 1} more`;
        }
        return firstName;
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar activePage="orders" />

            {/* Page Header */}
            <section className="bg-gradient-to-r from-yellow-400 to-yellow-500 py-16">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-5xl font-extrabold text-white mb-4">My Orders</h1>
                    <p className="text-white/90 text-lg">
                        Track and manage your purchases
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
                        <p className="mt-4 text-gray-500">Loading orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20">
                        <i className="ri-inbox-line text-6xl text-gray-300 mb-4"></i>
                        <p className="text-gray-500 text-lg mb-4">No orders yet</p>
                        <Link
                            to="/products"
                            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-yellow-500 transition"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-5 gap-8">
                        {/* Orders List - Left */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-lg p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold text-gray-900">
                                        All Orders <span className="text-gray-400 font-normal">({orders.length})</span>
                                    </h2>
                                    <button
                                        onClick={fetchOrders}
                                        className="text-sm text-gray-500 hover:text-yellow-500 transition"
                                    >
                                        <i className="ri-refresh-line"></i>
                                    </button>
                                </div>
                                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                                    {orders.map((order) => {
                                        const config = statusConfig[order.status] || statusConfig.Pending;
                                        const isActive = (order._id || order.id) === (activeOrder?._id || activeOrder?.id);

                                        return (
                                            <div
                                                key={order._id || order.id}
                                                onClick={() => setSelectedOrder(order._id || order.id)}
                                                className={`p-4 rounded-lg cursor-pointer transition-all ${isActive
                                                        ? 'bg-yellow-50 border-2 border-yellow-400'
                                                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {/* Product Image */}
                                                    <img
                                                        src={order.items?.[0]?.image || 'https://via.placeholder.com/48'}
                                                        alt=""
                                                        className="w-12 h-12 rounded-lg object-cover"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-gray-900 truncate">
                                                            {getOrderTitle(order)}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {order.createdAt ? formatDate(order.createdAt) : order.date}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-extrabold text-yellow-500">
                                                            ₹{(order.totalAmount || order.total)?.toFixed(0)}
                                                        </p>
                                                        <div className={`mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${config.bg}`}>
                                                            <i className={`${config.icon} ${config.color} text-xs`}></i>
                                                            <span className={`${config.color} font-medium`}>{order.status}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Order Details - Right */}
                        <div className="lg:col-span-3">
                            {activeOrder && (
                                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                    {/* Header */}
                                    <div className="p-6 border-b">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-xl font-extrabold text-gray-900">
                                                    {getOrderTitle(activeOrder)}
                                                </p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Ordered on {activeOrder.createdAt ? formatDate(activeOrder.createdAt) : activeOrder.date}
                                                </p>
                                            </div>
                                            <div className={`px-4 py-2 rounded-lg ${statusConfig[activeOrder.status]?.bg} flex items-center gap-2`}>
                                                <i className={`${statusConfig[activeOrder.status]?.icon} ${statusConfig[activeOrder.status]?.color}`}></i>
                                                <span className={`text-sm font-semibold ${statusConfig[activeOrder.status]?.color}`}>
                                                    {activeOrder.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress Timeline */}
                                    {activeOrder.status !== 'Cancelled' && (
                                        <div className="px-6 py-6 bg-gray-50">
                                            <div className="flex items-center justify-between">
                                                {steps.map((step, i) => {
                                                    const current = steps.indexOf(activeOrder.status);
                                                    const done = i <= current;
                                                    const active = i === current;

                                                    return (
                                                        <div key={step} className="flex items-center flex-1">
                                                            <div className="flex flex-col items-center">
                                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${done
                                                                        ? 'bg-yellow-500 text-white'
                                                                        : 'bg-gray-200 text-gray-400'
                                                                    } ${active ? 'ring-4 ring-yellow-200' : ''}`}>
                                                                    {done && i < current ? '✓' : i + 1}
                                                                </div>
                                                                <p className={`text-xs mt-2 ${done ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                                                                    {step}
                                                                </p>
                                                            </div>
                                                            {i < 3 && (
                                                                <div className={`flex-1 h-1 mx-2 rounded ${i < current ? 'bg-yellow-500' : 'bg-gray-200'}`}></div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Items */}
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                                            Order Items ({activeOrder.items?.length})
                                        </h3>
                                        <div className="space-y-4">
                                            {activeOrder.items?.map((item, i) => (
                                                <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                                    <img
                                                        src={item.image || 'https://via.placeholder.com/64'}
                                                        alt=""
                                                        className="w-16 h-16 rounded-lg object-cover"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="font-bold text-gray-900">{item.name}</p>
                                                        <p className="text-sm text-gray-500">
                                                            Qty: {item.quantity} × ₹{item.price}
                                                        </p>
                                                    </div>
                                                    <p className="text-lg font-extrabold text-yellow-500">
                                                        ₹{(item.price * item.quantity).toFixed(0)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Footer - New Theme */}
                                    <div className="p-6 bg-gradient-to-r from-yellow-400 to-yellow-500">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-white/80">Total Amount</p>
                                                <p className="text-3xl font-extrabold text-white">
                                                    ₹{(activeOrder.totalAmount || activeOrder.total)?.toFixed(0)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-white/80">Payment Method</p>
                                                <p className="text-white font-semibold flex items-center gap-2 justify-end">
                                                    <i className="ri-money-rupee-circle-line"></i>
                                                    Cash on Delivery
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </section>

            <Footer />
        </div>
    );
};

export default OrdersPage;
