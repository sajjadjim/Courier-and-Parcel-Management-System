import React from 'react';
import { Link } from 'react-router'; // Ensure react-router-dom is used
import { FaLock, FaHome, FaShieldAlt } from 'react-icons/fa';

const Forbidden = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 font-sans relative overflow-hidden">
            
            {/* Background Decoration (Optional) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
            </div>

            {/* Main Card */}
            <div className="relative z-10 max-w-lg w-full bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 md:p-12 text-center transition-all hover:shadow-xl">
                
                {/* Icon Container */}
                <div className="relative w-28 h-28 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <div className="absolute inset-0 border-4 border-white rounded-full shadow-sm"></div>
                    <FaLock className="text-5xl text-red-500" />
                    
                    {/* Floating Shield Badge */}
                    <div className="absolute -bottom-2 -right-2 bg-slate-800 text-white p-2 rounded-full border-4 border-white shadow-md">
                        <FaShieldAlt className="text-sm" />
                    </div>
                </div>

                {/* Text Content */}
                <h1 className="text-6xl font-black text-slate-800 mb-2 tracking-tighter">403</h1>
                <h2 className="text-2xl font-bold text-slate-600 mb-4 uppercase tracking-widest">Access Denied</h2>
                
                <p className="text-slate-500 mb-8 leading-relaxed">
                    Oops! You don't have the necessary permissions to view this page. 
                    If you believe this is an error, please contact your administrator.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link 
                        to="/" 
                        className="btn bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-8 shadow-lg shadow-slate-200 border-none flex items-center justify-center gap-2 transition-transform active:scale-95"
                    >
                        <FaHome /> Return Home
                    </Link>
                    
                    <button 
                        onClick={() => window.history.back()} 
                        className="btn bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl px-8 shadow-sm transition-transform active:scale-95"
                    >
                        Go Back
                    </button>
                </div>
            </div>

            {/* Footer / Meta */}
            <p className="relative z-10 mt-8 text-slate-400 text-sm font-medium">
                Security Checkpoint • ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
        </div>
    );
};

export default Forbidden;