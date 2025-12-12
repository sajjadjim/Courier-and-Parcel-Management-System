import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { FaArrowRight, FaSearch, FaBoxOpen, FaTruck, FaShieldAlt } from 'react-icons/fa';
const TracParcel = () => {

  const [trackId, setTrackId] = useState('');
  const navigate = useNavigate();

  const handleTrack = (e) => {
    e.preventDefault();
    if(trackId) {
        navigate(`/dashboard/track-package?id=${trackId}`);
    }
  };

    return (
        <div>
               <div className="  left-0 right-0 z-20 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-100 transform -translate-y-1/2 md:-translate-y-24">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FaSearch className="text-blue-600" /> Track Your Shipment
            </h3>
            
            <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <input 
                        type="text" 
                        placeholder="Enter Tracking ID (e.g. PCL-2025-XYZ)"
                        className="w-full pl-4 pr-4 py-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-gray-700 font-mono text-sm bg-gray-50"
                        value={trackId}
                        onChange={(e) => setTrackId(e.target.value)}
                    />
                </div>
                <button 
                    type="submit"
                    className="bg-slate-900 cursor-pointer text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg flex justify-center items-center gap-2"
                >
                    Track Now
                </button>
            </form>

            <div className="mt-4 flex gap-6 text-xs text-gray-400 font-medium">
                <span>Popular:</span>
                <span className="hover:text-blue-600 cursor-pointer underline">Document Delivery</span>
                <span className="hover:text-blue-600 cursor-pointer underline">E-commerce</span>
                <span className="hover:text-blue-600 cursor-pointer underline">Same Day</span>
            </div>
        </div>
      </div>
        </div>
    );
};

export default TracParcel;