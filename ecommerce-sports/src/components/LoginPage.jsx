import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Demo credentials
    const demoUsers = {
        "admin@gmail.com": { password: "admin123", role: "admin", name: "Admin User" },
        "user@gmail.com": { password: "user123", role: "user", name: "John Doe" },
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (isLogin) {
            const user = demoUsers[email];
            if (user && user.password === password) {
                sessionStorage.setItem("isLoggedIn", "true");
                sessionStorage.setItem("role", user.role);
                sessionStorage.setItem("userName", user.name);
                sessionStorage.setItem("userEmail", email);

                if (user.role === "admin") {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            } else {
                setError("Invalid email or password");
            }
        } else {
            if (email && password && name) {
                sessionStorage.setItem("isLoggedIn", "true");
                sessionStorage.setItem("role", "user");
                sessionStorage.setItem("userName", name);
                sessionStorage.setItem("userEmail", email);
                navigate("/");
            } else {
                setError("Please fill in all fields");
            }
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
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-yellow-500 text-white py-4 rounded-lg font-bold text-lg hover:bg-yellow-600 transition"
                        >
                            {isLogin ? "Login" : "Create Account"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
