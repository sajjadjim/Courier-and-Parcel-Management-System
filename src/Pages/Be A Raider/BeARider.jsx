import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router'; // Ensure using 'react-router-dom'
import riderImg from '../../assets/riderimage.jpg'; 
import { FaClock, FaWallet, FaMapMarkedAlt, FaArrowRight, FaCheckCircle } from 'react-icons/fa';

const BeARider = () => {
    document.title = "Be A Rider | PickOnGo";
    // Animation variants for staggered reveal
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
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    return (
        <div className="bg-white min-h-screen font-sans">
            
            {/* ================= HERO SECTION ================= */}
            <section className="relative overflow-hidden bg-slate-900 text-white pt-20 pb-24 md:pt-32 md:pb-32 px-6">
                
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#CAEB66] rounded-full mix-blend-multiply filter blur-3xl opacity-10 translate-y-1/2 -translate-x-1/2"></div>

                <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12 relative z-10">
                    
                    {/* Hero Text */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="md:w-1/2 text-center md:text-left"
                    >
                        <div className="inline-block px-4 py-1 mb-6 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                            <span className="text-[#CAEB66] font-semibold text-sm tracking-wide uppercase">Now Hiring</span>
                        </div>
                        
                        <h1 className="text-4xl 2xl:text-6xl font-extrabold mb-6 leading-tight">
                            Drive Your Way to <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CAEB66] to-green-400">Financial Freedom</span>
                        </h1>
                        
                        <p className="text-slate-300 mb-8 text-md md:text-xl leading-relaxed max-w-lg mx-auto md:mx-0">
                            Join the fastest-growing logistics network. Set your own hours, keep 100% of your tips, and get paid weekly.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <Link to='/riderForm'>
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="2xl:px-8 2xl:py-4 px-4 py-2 cursor-pointer bg-[#CAEB66] text-slate-900 text-lg font-bold rounded-full shadow-[0_0_20px_rgba(202,235,102,0.4)] hover:shadow-[0_0_30px_rgba(202,235,102,0.6)] transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                                >
                                    Apply Now <FaArrowRight />
                                </motion.button>
                            </Link>
                            <button className="2xl:px-8 2xl:py-4 px-4 py-2 cursor-pointer bg-transparent border border-slate-600 text-white hover:bg-white/10 text-lg font-semibold rounded-full transition-all w-full sm:w-auto">
                                Learn More
                            </button>
                        </div>
                    </motion.div>

                    {/* Hero Image */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="md:w-1/2 relative"
                    >
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="relative z-10"
                        >
                            <img 
                                src={riderImg} 
                                alt="Rider" 
                                className="w-full max-w-[350px] 2xl:max-w-[500px] mx-auto rounded-3xl shadow-2xl border-4 border-white/10"
                            />
                            
                            {/* Floating Stats Card */}
                            <div className="absolute -bottom-6 -left-6 md:left-0 bg-white p-4 rounded-xl shadow-xl flex items-center gap-4 animate-bounce-slow hidden sm:flex">
                                <div className="bg-green-100 p-3 rounded-full text-green-600">
                                    <FaWallet size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">Avg. Weekly Earning</p>
                                    <p className="2xl:text-xl  text-md font-bold text-slate-900">$500+</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ================= BENEFITS SECTION ================= */}
            <section className="py-20 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Why Ride With Us?</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">We offer the best benefits in the industry so you can focus on the road.</p>
                    </div>

                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        {[
                            {
                                title: "Flexible Schedule",
                                desc: "Be your own boss. Work mornings, evenings, or weekends—it's entirely up to you.",
                                icon: <FaClock />,
                                color: "text-blue-500",
                                bg: "bg-blue-50"
                            },
                            {
                                title: "Instant Payments",
                                desc: "No waiting for payday. Cash out your earnings instantly whenever you need.",
                                icon: <FaWallet />,
                                color: "text-green-500",
                                bg: "bg-green-50"
                            },
                            {
                                title: "Local Deliveries",
                                desc: "Smart routing keeps you in your preferred zones so you drive less and earn more.",
                                icon: <FaMapMarkedAlt />,
                                color: "text-purple-500",
                                bg: "bg-purple-50"
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                variants={itemVariants}
                                whileHover={{ y: -10 }}
                                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100"
                            >
                                <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-xl flex items-center justify-center text-3xl mb-6`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
                                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ================= HOW IT WORKS SECTION ================= */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto bg-slate-900 rounded-3xl p-8 md:p-16 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full filter blur-3xl opacity-20"></div>
                    
                    <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Simple Steps to Start Earning</h2>
                            <div className="space-y-6">
                                {[
                                    "Complete the online application form",
                                    "Upload your driving license & documents",
                                    "Get verified within 24 hours",
                                    "Download the app and start riding"
                                ].map((step, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <FaCheckCircle className="text-[#CAEB66] text-xl flex-shrink-0" />
                                        <p className="text-lg text-slate-200">{step}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-10">
                                <Link to='/riderForm' className="inline-block px-8 py-3 bg-white text-slate-900 font-bold rounded-full hover:bg-gray-100 transition-colors">
                                    Start Application
                                </Link>
                            </div>
                        </div>
                        <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10">
                             <div className="text-center">
                                <p className="text-[#CAEB66] font-bold tracking-widest uppercase text-sm mb-2">Requirements</p>
                                <h3 className="text-2xl font-bold mb-6">What you need</h3>
                             </div>
                             <ul className="space-y-4 text-slate-300 text-sm">
                                <li className="flex justify-between border-b border-white/10 pb-2">
                                    <span>Age</span>
                                    <span className="text-white font-medium">18+ Years</span>
                                </li>
                                <li className="flex justify-between border-b border-white/10 pb-2">
                                    <span>Vehicle</span>
                                    <span className="text-white font-medium">Bike / Bicycle / Scooter</span>
                                </li>
                                <li className="flex justify-between border-b border-white/10 pb-2">
                                    <span>Smartphone</span>
                                    <span className="text-white font-medium">Android or iOS</span>
                                </li>
                                <li className="flex justify-between border-b border-white/10 pb-2">
                                    <span>ID</span>
                                    <span className="text-white font-medium">Valid Government ID</span>
                                </li>
                             </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BeARider;