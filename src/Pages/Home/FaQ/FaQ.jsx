import React, { useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaMinus, FaQuestionCircle } from 'react-icons/fa';

const faqData = [
  {
    question: "How do I track my parcel?",
    answer: "You can track your parcel in real-time by entering your unique Tracking ID (e.g., PCL-2025-XYZ) in the 'Track Package' section on our homepage or dashboard."
  },
  {
    question: "What are the delivery charges?",
    answer: "Delivery charges depend on the weight of the parcel and the destination zone. Standard city delivery starts at 60 BDT. You can use our 'Send Parcel' calculator to get an exact estimate."
  },
  {
    question: "How do I become a rider?",
    answer: "It's simple! Go to the 'Be A Rider' page, fill out the application form with your NID and vehicle details. Once verified, you can start earning immediately."
  },
  {
    question: "Is there insurance for valuable items?",
    answer: "Yes, we offer insurance coverage for premium shipments. Please declare the value of your item during booking to opt-in for our secure handling package."
  },
  {
    question: "Can I change the delivery address after booking?",
    answer: "You can request an address change via our support team if the rider hasn't picked up the parcel yet. Once in transit, address changes may incur a small rerouting fee."
  }
];

const AccordionItem = ({ item, isOpen, onClick }) => {
  return (
    <div className={`border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? 'bg-white shadow-md ring-1 ring-blue-100' : 'bg-white hover:bg-gray-50'}`}>
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
      >
        <span className={`font-semibold text-lg transition-colors ${isOpen ? 'text-blue-600' : 'text-slate-700'}`}>
          {item.question}
        </span>
        <span className={`p-2 rounded-full transition-colors ${isOpen ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
          {isOpen ? <FaMinus size={12} /> : <FaPlus size={12} />}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-5 pb-5 text-slate-500 text-sm leading-relaxed border-t border-gray-100 pt-3">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FaQ = () => {
  const [activeIndex, setActiveIndex] = useState(0); // Set 0 to have the first one open by default

  const toggleIndex = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="bg-slate-50 py-16 px-4 font-sans">
      <motion.div 
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">
            Support Center
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Have questions about your delivery? Find answers to the most common queries below or contact our support team.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <AccordionItem
              key={index}
              item={item}
              isOpen={activeIndex === index}
              onClick={() => toggleIndex(index)}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <p className="text-slate-500 mb-4 text-sm">Still have questions?</p>
          <Link 
            to='/FaQ' 
            className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 text-white font-bold rounded-full shadow-lg hover:bg-slate-800 hover:-translate-y-1 transition-all duration-300"
          >
            <FaQuestionCircle /> Visit Help Center
          </Link>
        </div>

      </motion.div>
    </section>
  );
};

export default FaQ;