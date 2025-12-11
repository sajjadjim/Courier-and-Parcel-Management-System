import React from 'react';
import {  FaBoxOpen, FaWarehouse } from "react-icons/fa"; 
// Note: FaHandHoldingBox might need 'react-icons/fa6' or check specific icon availability
import { FaTruckFast, FaHandHoldingHeart } from "react-icons/fa6"; // Alternates

const services = [
  {
    icon: <FaTruckFast />,
    label: "Ecommerce Delivery",
    desc: "Fast, reliable logistics tailored for online businesses and shops."
  },
  {
    icon: <FaHandHoldingHeart />,
    label: "Pick and Drop",
    desc: "Door-to-door service that collects and delivers with care."
  },
  {
    icon: <FaBoxOpen />,
    label: "Safe Packaging",
    desc: "Premium packaging solutions to ensure your items arrive intact."
  },
  {
    icon: <FaWarehouse />,
    label: "Warehousing",
    desc: "Secure storage facilities with 24/7 monitoring for your goods."
  },
];

const ServiceGrid = () => {
  return (
    <section className="py-16 px-4 bg-white font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-12">
            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Our Expertise</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2">
                Logistics Solutions for You
            </h2>
            <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
                We provide an end-to-end delivery experience, ensuring your parcels are handled with the utmost professionalism.
            </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, idx) => (
                <div 
                    key={idx} 
                    className="group bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-in-out cursor-default"
                >
                    {/* Icon Container */}
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-3xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                        {service.icon}
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                        {service.label}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        {service.desc}
                    </p>
                </div>
            ))}
        </div>

      </div>
    </section>
  );
};

export default ServiceGrid;