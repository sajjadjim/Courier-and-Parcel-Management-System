import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaHandHoldingUsd, FaStore, FaChartLine } from 'react-icons/fa';
// Make sure to adjust this path based on your project structure
import location from '../../../../public/location-merchant.png'; 

const BeMerchant = () => {
    return (
        <section className="py-12 px-4 md:px-8 font-sans">
            
            {/* Main Container with Rich Gradient */}
            <div className="bg-gradient-to-br from-[#022c31] to-[#044e54] rounded-[2.5rem] overflow-hidden relative shadow-2xl">

                {/* Decorative Background Glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#CAEB66] rounded-full blur-[120px] opacity-10 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500 rounded-full blur-[100px] opacity-10 translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between p-8 md:p-20 gap-12 relative z-10">

                    {/* Left Content (Text) */}
                    <div className="lg:w-1/2 text-center lg:text-left space-y-8">
                        
                        {/* Badge */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-[#CAEB66] text-xs font-bold uppercase tracking-widest backdrop-blur-md"
                        >
                            <FaStore /> Business Solutions
                        </motion.div>

                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-4xl 2xl:text-6xl font-extrabold text-white leading-tight"
                        >
                            Scale Your Business, <br />
                            <span className="text-[#CAEB66]">Simplify Delivery.</span>
                        </motion.h1>

                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0"
                        >
                            Merchant satisfaction is our priority. We offer the lowest delivery charges, 100% product safety, and timely delivery to every corner of Bangladesh.
                        </motion.p>

                        {/* Buttons */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2"
                        >
                            <button className="2xl:px-8 2xl:py-4 px-4 py-2  bg-[#CAEB66] text-[#022c31] text-lg font-bold rounded-full shadow-[0_0_20px_rgba(202,235,102,0.3)] hover:shadow-[0_0_30px_rgba(202,235,102,0.5)] hover:bg-white transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer">
                                Become a Merchant <FaArrowRight />
                            </button>
                            <button className="2xl:px-8 2xl:py-4 px-4 py-2 bg-transparent border border-white/30 text-white text-lg font-bold rounded-full hover:bg-white/10 hover:border-white transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer">
                                <FaHandHoldingUsd className="text-[#CAEB66]" /> Earn With Us
                            </button>
                        </motion.div>
                    </div>

                    {/* Right Content (Image) */}
                    <motion.div 
                        className="lg:w-1/2 relative"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Abstract Glass Shape Behind */}
                        <div className="absolute inset-0 bg-white/5 transform rotate-3 rounded-[3rem] backdrop-blur-sm border border-white/10 -z-10 scale-95"></div>

                        <img
                            src={location}
                            alt="Merchant Location Coverage"
                            className="w-full max-w-md mx-auto rounded-[2rem] shadow-2xl border-4 border-white/10 relative z-10"
                        />

                        {/* Floating Stats Card 1 */}
                        <motion.div 
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="absolute -bottom-6 -left-4 md:left-4 bg-white p-4 rounded-xl shadow-xl flex items-center gap-4 z-20"
                        >
                            <div className="bg-green-100 p-3 rounded-full text-green-600">
                                <FaChartLine size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Growth</p>
                                <p className="text-lg font-bold text-slate-900">3x Faster</p>
                            </div>
                        </motion.div>

                        {/* Floating Stats Card 2 */}
                        <motion.div 
                            animate={{ y: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                            className="absolute -top-6 -right-4 md:right-0 bg-slate-800 p-4 rounded-xl shadow-xl flex items-center gap-4 z-20 border border-slate-700"
                        >
                            <div className="bg-blue-500/20 p-3 rounded-full text-blue-400">
                                <FaStore size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Partners</p>
                                <p className="text-lg font-bold text-white">5000+</p>
                            </div>
                        </motion.div>

                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default BeMerchant;