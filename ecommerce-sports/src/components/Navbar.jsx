import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = ({ activePage = "home" }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const [userRole, setUserRole] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check login state on mount and when localStorage changes
        const checkAuth = () => {
            const token = localStorage.getItem("token");
            const loggedIn = localStorage.getItem("isLoggedIn") === "true";
            const name = localStorage.getItem("userName");
            const role = localStorage.getItem("role");

            setIsLoggedIn(loggedIn && !!token);
            setUserName(name || "");
            setUserRole(role || "");
        };

        checkAuth();

        // Listen for storage changes (e.g., logout in another tab)
        window.addEventListener("storage", checkAuth);
        return () => window.removeEventListener("storage", checkAuth);
    }, []);

    const handleLogout = () => {
        // Clear all auth data
        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("role");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userId");

        setIsLoggedIn(false);
        setUserName("");
        setUserRole("");
        setShowDropdown(false);

        navigate("/login");
    };

    return (
        <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link to="/" className="text-2xl font-extrabold">
                    <span className="text-yellow-500">Sport</span>
                    <span className="text-black">Zone</span>
                </Link>

                <ul className="hidden md:flex items-center gap-10 text-gray-700 font-medium">
                    <li>
                        <Link
                            to="/"
                            className={`cursor-pointer transition ${activePage === "home" ? "text-yellow-500 font-bold" : "hover:text-yellow-500"}`}
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/products"
                            className={`cursor-pointer transition ${activePage === "shop" ? "text-yellow-500 font-bold" : "hover:text-yellow-500"}`}
                        >
                            Shop
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/cart"
                            className={`cursor-pointer transition ${activePage === "cart" ? "text-yellow-500 font-bold" : "hover:text-yellow-500"}`}
                        >
                            Cart
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/orders"
                            className={`cursor-pointer transition ${activePage === "orders" ? "text-yellow-500 font-bold" : "hover:text-yellow-500"}`}
                        >
                            Orders
                        </Link>
                    </li>
                    {isLoggedIn && userRole === "admin" && (
                        <li>
                            <Link
                                to="/admin"
                                className={`cursor-pointer transition ${activePage === "admin" ? "text-yellow-500 font-bold" : "hover:text-yellow-500"}`}
                            >
                                Admin
                            </Link>
                        </li>
                    )}
                </ul>

                <div className="flex items-center gap-6 text-gray-700 text-xl">
                    <i className="ri-search-line cursor-pointer hover:text-yellow-500 transition"></i>

                    {isLoggedIn ? (
                        <div className="relative">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center gap-2 cursor-pointer hover:text-yellow-500 transition"
                            >
                                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                    {userName.charAt(0).toUpperCase()}
                                </div>
                                <span className="hidden sm:block text-sm font-medium">
                                    {userName.split(" ")[0]}
                                </span>
                                <i className={`ri-arrow-down-s-line text-sm transition ${showDropdown ? "rotate-180" : ""}`}></i>
                            </button>

                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                                    <div className="px-4 py-2 border-b">
                                        <p className="text-sm font-semibold text-gray-900">{userName}</p>
                                        <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                                    </div>
                                    <Link
                                        to="/orders"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        My Orders
                                    </Link>
                                    {userRole === "admin" && (
                                        <Link
                                            to="/admin"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login">
                            <i className="ri-user-3-line cursor-pointer hover:text-yellow-500 transition"></i>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
