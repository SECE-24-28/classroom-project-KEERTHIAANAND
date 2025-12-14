import Navbar from "./Navbar";

const HeroSection = () => {
    const stats = [
        { value: '20K+', label: 'Customers' },
        { value: '40+', label: 'Categories' },
        { value: '50+', label: 'Brands' },
        { value: '10K+', label: 'Products' },
    ];

    return (
        <div className="bg-gray-100">
            {/* Navbar */}
            <Navbar activePage="home" />

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
                {/* Left Content */}
                <div>
                    <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
                        Perfect gear for <br />
                        your <span className="text-yellow-500">sporting journey</span>
                    </h1>

                    <p className="text-gray-600 mt-5 text-lg leading-relaxed">
                        From beginners to professionals, we bring you high-quality sports
                        apparel and fitness products designed to enhance your performance.
                    </p>

                    <a href="/products">
                        <button className="mt-6 bg-black text-white px-6 py-3 text-lg rounded hover:bg-yellow-500 transition">
                            Explore Collection
                        </button>
                    </a>
                </div>

                {/* Right Content - Image */}
                <div className="relative">
                    <img
                        src="https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=600&q=80"
                        className="rounded-xl shadow-lg w-full object-cover"
                        alt="sports yoga"
                    />
                </div>
            </section>

            {/* Stats Section */}
            <section className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center mt-10 px-6 pb-16">
                {stats.map((stat, index) => (
                    <div key={index} className="group cursor-pointer">
                        <h2 className="text-3xl font-extrabold group-hover:text-yellow-500 transition">{stat.value}</h2>
                        <p className="text-gray-600">{stat.label}</p>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default HeroSection;
