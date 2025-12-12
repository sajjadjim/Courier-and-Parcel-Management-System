import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { Carousel } from 'react-responsive-carousel';
import { FaArrowRight, FaSearch, FaBoxOpen, FaTruck, FaShieldAlt } from 'react-icons/fa';



const banners = [
  {
    id: 1,
    image: 'https://magnetoitsolutions.com/wp-content/uploads/2020/09/Best-eCommerce-Shipping-Product-Delivery-Solutions.jpg',
    title: "Fastest Delivery Network",
    subtitle: "We ensure your parcel reaches its destination safely and on time, every time.",
    icon: <FaTruck />,
    color: "bg-blue-600"
  },
  {
    id: 2,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyKfTj3_MjRGcaD_YN9HydaH8Pki-WCmPgEg&s',
    title: "Secure & Reliable Shipping",
    subtitle: "Real-time tracking and insurance coverage for all your valuable shipments.",
    icon: <FaShieldAlt />,
    color: "bg-green-600"
  },
  {
    id: 3,
    image: 'https://img.freepik.com/premium-vector/global-logistics-video-concept-banner-showcasing-diverse-transportation-modes_1263357-12007.jpg',
    title: "Global Logistics Solutions",
    subtitle: "Connecting businesses and customers across 64 districts with ease.",
    icon: <FaBoxOpen />,
    color: "bg-orange-500"
  }
];

const BannerCarousel = () => {


  return (
    <div className="relative w-full h-[600px] md:h-[700px] font-sans">
      
      {/* 1. THE CAROUSEL */}
      <Carousel 
        autoPlay 
        infiniteLoop 
        showThumbs={false} 
        showStatus={false}
        interval={5000}
        stopOnHover={false}
        className="h-full md:mt-20 rounded-2xl overflow-hidden shadow-lg"
      >
        {banners.map((item) => (
          <div key={item.id} className="relative h-[600px] md:h-[700px] w-full">
            {/* Background Image */}
            <img 
              src={item.image} 
              alt={item.title} 
              className="h-full w-full object-cover" 
            />
            
            {/* Dark Gradient Overlay (Crucial for text readability) */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/60 to-transparent flex items-center">
              
              {/* Text Content */}
              <div className="max-w-7xl mx-auto px-6 w-full text-left pt-20">
                <div className="max-w-2xl space-y-6 animate-fadeIn">
                    
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-sm font-medium">
                        {item.icon}
                        <span>Premier Courier Service</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
                      {item.title.split(" ")[0]} <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
                        {item.title.split(" ").slice(1).join(" ")}
                      </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg md:text-xl text-slate-200 leading-relaxed max-w-lg">
                      {item.subtitle}
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-4 pt-4">
                        <button className={`${item.color} hover:brightness-110 cursor-pointer text-white px-8 py-3.5 rounded-full font-bold shadow-lg transition-all flex items-center gap-2`}>
                            Get Started <FaArrowRight />
                        </button>
                        <button className="bg-white cursor-pointer text-slate-900 px-8 py-3.5 rounded-full font-bold shadow-lg hover:bg-gray-100 transition-all">
                            View Pricing
                        </button>
                    </div>
                </div>
              </div>

            </div>
          </div>
        ))}
      </Carousel>

      {/* 2. FLOATING TRACKING BOX (Professional Logistics Feature) */}
   

    </div>
  );
};

export default BannerCarousel;