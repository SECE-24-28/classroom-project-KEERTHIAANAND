import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-white py-7">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="text-2xl font-extrabold inline-block mb-4">
              <span className="text-yellow-500">Sport</span>
              <span className="text-white">Zone</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium sports equipment and accessories. Elevate your game with quality and style.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-400 text-sm">
              <Link to="/" className="hover:text-yellow-500 transition">Home</Link>
              <Link to="/products" className="hover:text-yellow-500 transition">Shop</Link>
              <Link to="/cart" className="hover:text-yellow-500 transition">Cart</Link>
              <Link to="/orders" className="hover:text-yellow-500 transition">Orders</Link>
              <Link to="/login" className="hover:text-yellow-500 transition">Login</Link>
            </div>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-white font-bold mb-4">Get in Touch</h4>
            <p className="text-gray-400 text-sm mb-3">
              <i className="ri-mail-line text-yellow-500 mr-2"></i>
              support@sportzone.com
            </p>
            <p className="text-gray-400 text-sm mb-4">
              <i className="ri-phone-line text-yellow-500 mr-2"></i>
              +91 63747 85775
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-yellow-500 hover:text-white transition">
                <i className="ri-facebook-fill"></i>
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-yellow-500 hover:text-white transition">
                <i className="ri-twitter-x-fill"></i>
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-yellow-500 hover:text-white transition">
                <i className="ri-instagram-fill"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-7 pt-3 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} <span className="text-yellow-500">SportZone</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
