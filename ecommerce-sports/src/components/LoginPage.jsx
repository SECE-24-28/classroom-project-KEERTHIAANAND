import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:3000/api";

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (isLogin) {
                // Login request
                const response = await axios.post(`${API_URL}/auth/login`, {
                    email,
                    password
                });

                if (response.data.success) {
                    // Store token and user info
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("isLoggedIn", "true");
                    localStorage.setItem("role", response.data.user.role);
                    localStorage.setItem("userName", response.data.user.name);
                    localStorage.setItem("userEmail", response.data.user.email);
                    localStorage.setItem("userId", response.data.user.id);

                    // Redirect based on role
                    if (response.data.user.role === "admin") {
                        navigate("/admin");
                    } else {
                        navigate("/");
                    }
                }
            } else {
                // Register request
                if (!name) {
                    setError("Please enter your name");
                    setLoading(false);
                    return;
                }

                const response = await axios.post(`${API_URL}/auth/register`, {
                    name,
                    email,
                    password
                });

                if (response.data.success) {
                    // Store token and user info
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("isLoggedIn", "true");
                    localStorage.setItem("role", response.data.user.role);
                    localStorage.setItem("userName", response.data.user.name);
                    localStorage.setItem("userEmail", response.data.user.email);
                    localStorage.setItem("userId", response.data.user.id);

                    navigate("/");
                }
            }
        } catch (err) {
            console.error("Auth error:", err);
            setError(
                err.response?.data?.message ||
                "An error occurred. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Simple Navbar */}
            <nav className="w-full bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="text-2xl font-extrabold">
                        <span className="text-yellow-500">Sport</span>
                        <span className="text-black">Zone</span>
                    </Link>
                </div>
            </nav>

            {/* Login Form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                    {/* Tabs */}
                    <div className="flex mb-8">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-3 text-center font-bold transition ${isLogin
                                ? "text-yellow-500 border-b-2 border-yellow-500"
                                : "text-gray-400 border-b-2 border-transparent hover:text-gray-600"
                                }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-3 text-center font-bold transition ${!isLogin
                                ? "text-yellow-500 border-b-2 border-yellow-500"
                                : "text-gray-400 border-b-2 border-transparent hover:text-gray-600"
                                }`}
                        >
                            Register
                        </button>
                    </div>

                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                        {isLogin ? "Welcome Back!" : "Create Account"}
                    </h1>
                    <p className="text-gray-500 mb-8">
                        {isLogin ? "Login to access your account" : "Sign up to start shopping"}
                    </p>

                    {error && (
                        <div className="bg-red-100 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                                    placeholder="John Doe"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                            {!isLogin && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Password must be at least 6 characters
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-lg font-bold text-lg transition ${loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-yellow-500 hover:bg-yellow-600"
                                } text-white`}
                        >
                            {loading
                                ? "Please wait..."
                                : isLogin
                                    ? "Login"
                                    : "Create Account"}
                        </button>
                    </form>

                    {/* Demo credentials hint */}
                    {isLogin && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500 text-center">
                                New user? Click "Register" to create an account!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
