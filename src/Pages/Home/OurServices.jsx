import React from "react";
import { FaShippingFast, FaGlobeAsia, FaWarehouse, FaMoneyBillWave, FaHandshake, FaUndoAlt } from "react-icons/fa";

const services = [
  {
    icon: <FaShippingFast />,
    title: "Express & Standard",
    description: "Lightning-fast delivery within 24–72 hours across major cities. Dhaka express options available for same-day 4-6 hour delivery.",
    color: "text-yellow-400"
  },
  {
    icon: <FaGlobeAsia />,
    title: "Nationwide Coverage",
    description: "We reach every corner of the country. Home delivery to all 64 districts within 48–72 hours guaranteed.",
    color: "text-blue-400"
  },
  {
    icon: <FaWarehouse />,
    title: "Fulfillment Solutions",
    description: "End-to-end business support including inventory management, secure warehousing, packaging, and order processing.",
    color: "text-purple-400"
  },
  {
    icon: <FaMoneyBillWave />,
    title: "Cash on Delivery",
    description: "100% secure cash collection service anywhere in Bangladesh. We ensure your funds are handled with maximum safety.",
    color: "text-green-400"
  },
  {
    icon: <FaHandshake />,
    title: "Corporate Logistics",
    description: "Tailored contracts for large-scale businesses requiring dedicated fleets, priority support, and bulk management.",
    color: "text-orange-400"
  },
  {
    icon: <FaUndoAlt />,
    title: "Easy Returns",
    description: "Hassle-free reverse logistics. We manage returns and exchanges from customers back to merchants smoothly.",
    color: "text-red-400"
  },
];

const OurServices = () => {
  return (
    <section className="bg-slate-900 py-20 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-teal-400 font-bold tracking-widest uppercase text-xs mb-2 block">
            What We Do
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
            Comprehensive Logistics <span className="text-teal-500">Solutions</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
            From personal parcels to enterprise supply chains, we provide the infrastructure you need to move goods faster, safer, and smarter.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-2xl hover:bg-slate-800 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-teal-900/20"
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-slate-900 flex items-center justify-center text-3xl mb-6 shadow-inner ${service.color} group-hover:scale-110 transition-transform duration-300`}>
                {service.icon}
              </div>

              {/* Text */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-teal-400 transition-colors">
                {service.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300">
                {service.description}
              </p>

              {/* Decorative corner glow */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-teal-500/10 to-transparent rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default OurServices;