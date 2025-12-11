import React, { useState } from 'react';
import BangladeshMap from './BangladeshMap';
import { useLoaderData } from 'react-router';
import { FaMapMarkedAlt, FaSearch, FaLocationArrow } from 'react-icons/fa';

const Coverage = () => {
    const serviceCenters = useLoaderData();
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [searchText, setSearchText] = useState('');

    // Filter list based on search
    const filteredCenters = serviceCenters.filter(center => 
        center.district.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div className="min-h-screen  bg-gray-50 flex flex-col">
            {/* Header Section */}
            <div className="bg-slate-900 pt-30 text-white py-12 px-6 text-center shadow-md">
                <h1 className="text-4xl font-extrabold mb-2 flex justify-center items-center gap-3">
                    <FaMapMarkedAlt className="text-blue-500" /> Nationwide Coverage
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    We deliver happiness to 64 districts across Bangladesh. Find your nearest service point below.
                </p>
            </div>

            {/* Content Grid */}
            <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[80vh]">
                
                {/* LEFT SIDEBAR: Search & List */}
                <div className="lg:col-span-4 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex flex-col h-full">
                    
                    {/* Search Bar */}
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search your district..."
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                            <FaSearch className="absolute left-3.5 top-3.5 text-gray-400" />
                        </div>
                    </div>

                    {/* District List */}
                    <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                        {filteredCenters.map((center, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedDistrict(center)}
                                className={`w-full text-left p-4 rounded-xl transition-all duration-200 flex items-start justify-between group
                                    ${selectedDistrict?.district === center.district 
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
                                        : "hover:bg-gray-50 text-gray-700"}`}
                            >
                                <div>
                                    <h3 className={`font-bold text-sm mb-1 ${selectedDistrict?.district === center.district ? "text-white" : "text-slate-800"}`}>
                                        {center.district}
                                    </h3>
                                    <p className={`text-xs truncate max-w-[200px] ${selectedDistrict?.district === center.district ? "text-blue-100" : "text-gray-400"}`}>
                                        {center.covered_area.length} areas covered
                                    </p>
                                </div>
                                <FaLocationArrow className={`mt-1 transform group-hover:translate-x-1 transition-transform ${selectedDistrict?.district === center.district ? "text-blue-200" : "text-gray-300"}`} size={12} />
                            </button>
                        ))}
                        
                        {filteredCenters.length === 0 && (
                            <div className="text-center py-10 text-gray-400">
                                No districts found.
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT SIDE: Map */}
                <div className="lg:col-span-8 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden relative">
                    <BangladeshMap 
                        serviceCenters={serviceCenters} 
                        activeDistrict={selectedDistrict} 
                    />
                    
                    {/* Overlay Info Card (Shows when a district is selected) */}
                    {selectedDistrict && (
                        <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-md p-5 rounded-xl shadow-xl border border-white/50 max-w-xs animate-fadeIn">
                            <h3 className="font-bold text-slate-800 text-lg mb-2">{selectedDistrict.district}</h3>
                            <p className="text-xs text-gray-500 font-bold uppercase mb-2">Covered Areas:</p>
                            <div className="flex flex-wrap gap-1">
                                {selectedDistrict.covered_area.slice(0, 5).map((area, i) => (
                                    <span key={i} className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-md border border-blue-100">
                                        {area}
                                    </span>
                                ))}
                                {selectedDistrict.covered_area.length > 5 && (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-500 text-[10px] rounded-md">
                                        +{selectedDistrict.covered_area.length - 5} more
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Coverage;