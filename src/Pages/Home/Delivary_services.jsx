import React from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkedAlt, FaShieldAlt, FaHeadset } from "react-icons/fa";

const features = [
  {
    id: 1,
    icon: <FaMapMarkedAlt />,
    title: "Live Parcel Tracking",
    description: "Stay updated in real-time. From pick-up to delivery, monitor your shipment’s journey instantly for complete peace of mind.",
    color: "bg-blue-50 text-blue-600"
  },
  {
    id: 2,
    icon: <FaShieldAlt />,
    title: "100% Safe Delivery",
    description: "Your parcels are handled with the utmost care. Our reliable process guarantees safe, insured, and damage-free delivery every time.",
    color: "bg-green-50 text-green-600"
  },
  {
    id: 3,
    icon: <FaHeadset />,
    title: "24/7 Expert Support",
    description: "Our dedicated support team is available around the clock to assist you with any questions, updates, or concerns.",
    color: "bg-purple-50 text-purple-600"
  }
];

const FeaturesSection = () => {
  
  // Animation Variants for Staggered Effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section className="py-20 px-4 bg-white font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-blue-600 font-bold tracking-wider uppercase text-sm"
            >
              Why Choose Us
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2 mb-4"
            >
              Reliable Logistics Solutions
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-500 text-lg"
            >
              We provide an end-to-end delivery experience, ensuring your parcels are handled with the utmost professionalism.
            </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature) => (
            <motion.div 
              key={feature.id}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-2xl shadow-lg shadow-gray-100 border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 ${feature.color}`}>
                {feature.icon}
              </div>

              {/* Text */}
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-500 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default FeaturesSection;