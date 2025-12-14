import { Link } from "react-router-dom";

const Navbar = ({ activePage = "home" }) => {
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
                </ul>

                <div className="flex items-center gap-6 text-gray-700 text-xl">
                    <i className="ri-search-line cursor-pointer hover:text-yellow-500 transition"></i>
                    <Link to="/login">
                        <i className="ri-user-3-line cursor-pointer hover:text-yellow-500 transition"></i>
                    </Link>
                    {/* <Link to="/cart">
                        <i className="ri-shopping-bag-line cursor-pointer hover:text-yellow-500 transition"></i>
                    </Link> */}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
