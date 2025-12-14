import HeroSection from "./HeroSection";
import Footer from "./Footer";

const HomePage = () => {
    // Sample top 3 products data
    const topProducts = [
        {
            id: 1,
            name: "Pro Running Shoes",
            price: 129.99,
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80",
        },
        {
            id: 2,
            name: "Sports Training Kit",
            price: 89.99,
            image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=400&q=80",
        },
        {
            id: 3,
            name: "Premium Yoga Mat",
            price: 49.99,
            image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=400&q=80",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <HeroSection />

            {/* Top 3 Products Section */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-gray-900">
                        Top <span className="text-yellow-500">Products</span>
                    </h2>
                    <p className="text-gray-600 mt-3 text-lg">
                        Check out our best-selling sports gear
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {topProducts.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
                        >
                            <div className="relative overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {product.name}
                                </h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-extrabold text-yellow-500">
                                        ₹{product.price}
                                    </span>
                                    <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default HomePage;
