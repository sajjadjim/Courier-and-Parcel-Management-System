import React, { useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaMinus, FaSearch, FaArrowLeft } from 'react-icons/fa';

const faqData = [
    {
        category: "General & Tracking",
        questions: [
            {
                q: "How do I track my parcel?",
                a: "You can track your parcel in real-time by entering your unique Tracking ID (e.g., PCL-2025-XYZ) on our homepage or in the dashboard tracking section."
            },
            {
                q: "What areas do you cover?",
                a: "We currently cover all 64 districts in Bangladesh. We offer express delivery in Dhaka, Chittagong, and Sylhet, with standard delivery nationwide."
            },
            {
                q: "What items are prohibited from shipping?",
                a: "We do not ship illegal items, perishables without proper packaging, flammable materials, currency, or jewelry. Please check our Terms & Conditions for the full list."
            }
        ]
    },
    {
        category: "For Merchants",
        questions: [
            {
                q: "How quickly do I get my COD payments?",
                a: "We process Cash on Delivery (COD) payments twice a week. Funds are transferred directly to your registered bank account or mobile wallet."
            },
            {
                q: "Do you offer pick-up services?",
                a: "Yes! We offer doorstep pick-up for merchants. Simply place a pick-up request via the dashboard before 4 PM for same-day collection."
            },
            {
                q: "What happens if a customer returns a product?",
                a: "We handle reverse logistics seamlessly. If a customer returns a product, it will be delivered back to your warehouse within 3-5 business days."
            }
        ]
    },
    {
        category: "For Riders",
        questions: [
            {
                q: "How do I apply to be a rider?",
                a: "Navigate to the 'Be A Rider' page, fill out the application form, and upload your NID and Driving License. Our team will verify your documents within 24 hours."
            },
            {
                q: "When do riders get paid?",
                a: "Riders receive their payouts weekly. Performance bonuses and tips are calculated and added to the weekly payout."
            }
        ]
    }
];

const AccordionItem = ({ question, answer, isOpen, onClick }) => {
    return (
        <div className={`border border-gray-200   rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? 'bg-white shadow-md ring-1 ring-blue-100' : 'bg-white hover:bg-gray-50'}`}>
            <button
                onClick={onClick}
                className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
            >
                <span className={`font-semibold text-base md:text-lg transition-colors ${isOpen ? 'text-blue-600' : 'text-slate-700'}`}>
                    {question}
                </span>
                <span className={`p-2 rounded-full transition-colors flex-shrink-0 ml-4 ${isOpen ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
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
                        <div className="px-5 pb-5 text-slate-500 text-sm md:text-base leading-relaxed border-t border-gray-100 pt-3">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const AllFaQ = () => {
    const [openIndex, setOpenIndex] = useState(null); // format: "categoryIndex-questionIndex"
    const [searchTerm, setSearchTerm] = useState("");

    const handleToggle = (idx) => {
        setOpenIndex(openIndex === idx ? null : idx);
    };

    // Filter logic
    const filteredData = faqData.map(cat => ({
        ...cat,
        questions: cat.questions.filter(q => 
            q.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
            q.a.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(cat => cat.questions.length > 0);

    return (
        <div className="bg-slate-50 md:mt-20 min-h-screen py-10 font-sans">
            <div className="max-w-4xl mx-auto px-4">
                
                {/* Header Section */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">
                        Help Center
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                        Find answers to common questions about shipping, tracking, payments, and account management.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-xl mx-auto mb-12">
                    <input 
                        type="text" 
                        placeholder="Search for answers (e.g., payment, tracking)..." 
                        className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>

                {/* FAQ List */}
                <div className="space-y-8">
                    {filteredData.length > 0 ? (
                        filteredData.map((category, catIndex) => (
                            <div key={catIndex}>
                                <h3 className="text-xl font-bold text-slate-800 mb-4 px-2 border-l-4 border-[#CAEB66] pl-3">
                                    {category.category}
                                </h3>
                                <div className="space-y-3">
                                    {category.questions.map((item, qIndex) => {
                                        const uniqueKey = `${catIndex}-${qIndex}`;
                                        return (
                                            <AccordionItem
                                                key={uniqueKey}
                                                question={item.q}
                                                answer={item.a}
                                                isOpen={openIndex === uniqueKey}
                                                onClick={() => handleToggle(uniqueKey)}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            No results found for "{searchTerm}".
                        </div>
                    )}
                </div>

                {/* Bottom Action */}
                <div className="grid items-center justify-center mt-12">
                    <Link 
                        to='/' 
                        className="btn bg-[#CAEB66] hover:bg-[#bce055] text-black border-none rounded-full px-8 flex items-center gap-2 shadow-lg"
                    >
                        <FaArrowLeft /> Back Home
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default AllFaQ;