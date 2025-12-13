import React, { useState, useMemo, useEffect } from 'react';
import BangladeshMap from './BangladeshMap';
import { FaMapMarkedAlt, FaSearch, FaMapMarkerAlt, FaGlobeAsia, FaExclamationTriangle } from 'react-icons/fa';
import { ImSpinner9 } from 'react-icons/im';

const Coverage = () => {
    document.title = "Coverage Area | PickOnGo";

    // --- 1. STATE MANAGEMENT ---
    const [serviceCenters, setServiceCenters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const [selectedDivision, setSelectedDivision] = useState(''); 
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // --- 2. FETCH DATA FROM GITHUB ---
    useEffect(() => {
        fetch('https://raw.githubusercontent.com/sajjadjim/Courier-and-Parcel-Management-System/refs/heads/main/public/warehouses.json')
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch data");
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setServiceCenters(data);
                } else {
                    console.error("Data is not an array:", data);
                    setServiceCenters([]);
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Error loading coverage data:", err);
                setError(true);
                setIsLoading(false);
            });
    }, []);

    // --- 3. LOGIC: Get Unique Divisions ---
    const divisions = useMemo(() => {
        if (!serviceCenters || serviceCenters.length === 0) return [];
        const unique = [...new Set(serviceCenters.map(item => item?.region).filter(Boolean))];
        return unique.sort();
    }, [serviceCenters]);

    // --- 4. LOGIC: Filter Districts ---
    const filteredDistricts = useMemo(() => {
        if (!selectedDivision) return [];

        return serviceCenters.filter(center => {
            const matchesDivision = center?.region === selectedDivision;
            const matchesSearch = center?.district?.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesDivision && matchesSearch;
        });
    }, [serviceCenters, selectedDivision, searchTerm]);


    // --- 5. LOADING STATE UI ---
    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500 font-sans">
                <ImSpinner9 className="animate-spin text-4xl text-blue-600 mb-4" />
                <p className="font-semibold text-lg">Loading Map Data...</p>
            </div>
        );
    }

    // --- 6. ERROR STATE UI ---
    if (error || serviceCenters.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500 font-sans">
                <FaExclamationTriangle className="text-5xl text-orange-400 mb-4" />
                <h2 className="text-2xl font-bold text-slate-700">Map Unavailable</h2>
                <p className="text-sm mt-2">We couldn't load the coverage map data.</p>
                <button onClick={() => window.location.reload()} className="mt-6 px-6 py-2 bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition-colors font-medium text-sm">
                    Retry Connection
                </button>
            </div>
        );
    }

    // --- 7. MAIN UI ---
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            
            {/* Header Section */}
            <div className="bg-slate-900 text-white py-10 px-6 text-center shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#CAEB66] rounded-full blur-[100px] opacity-10 translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10">
                    <h1 className="text-3xl md:text-4xl font-extrabold mb-3 flex justify-center items-center gap-3">
                        <FaMapMarkedAlt className="text-blue-500" /> Nationwide Coverage
                    </h1>
                    <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
                        Delivering happiness to 64 districts. Select a division to find your hub.
                    </p>
                </div>
            </div>

            {/* Content Grid */}
            <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)]">
                
                {/* LEFT SIDEBAR: Filters & List */}
                <div className="lg:col-span-4 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col h-full">
                    
                    {/* Filters Header */}
                    <div className="p-5 border-b border-gray-100 bg-gray-50 space-y-3">
                        
                        {/* Division Dropdown (Primary Action) */}
                        <div className="relative">
                            <FaGlobeAsia className="absolute left-3.5 top-3 text-gray-500 z-10" />
                            <select
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 bg-white text-sm outline-none cursor-pointer appearance-none text-slate-800 font-bold shadow-sm"
                                value={selectedDivision}
                                onChange={(e) => {
                                    setSelectedDivision(e.target.value);
                                    setSelectedDistrict(null); // Reset map zoom when division changes
                                }}
                            >
                                <option value="" disabled>Select a Division</option>
                                {divisions.map((div, idx) => (
                                    <option key={idx} value={div}>
                                        {div} Division
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400 text-xs">▼</div>
                        </div>

                        {/* Search Input (Only enabled if division selected) */}
                        <div className={`relative transition-opacity duration-300 ${!selectedDivision ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                            <input
                                type="text"
                                placeholder="Search District in Division..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                disabled={!selectedDivision}
                            />
                            <FaSearch className="absolute left-3.5 top-3 text-gray-400" />
                        </div>
                    </div>

                    {/* District List Area */}
                    <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar bg-slate-50/30">
                        {!selectedDivision ? (
                            // INITIAL STATE: Prompt user to select division
                            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-400">
                                <FaGlobeAsia className="text-4xl mb-3 text-gray-300" />
                                <p className="font-semibold text-gray-600">No Division Selected</p>
                                <p className="text-xs mt-1">Please select a division from the dropdown above to view available districts.</p>
                            </div>
                        ) : filteredDistricts.length === 0 ? (
                            // EMPTY SEARCH STATE
                            <div className="text-center py-12 flex flex-col items-center text-gray-400">
                                <FaSearch className="text-3xl mb-2 opacity-20" />
                                <p className="text-sm">No districts found matching "{searchTerm}".</p>
                            </div>
                        ) : (
                            // LIST STATE
                            filteredDistricts.map((center, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedDistrict(center)}
                                    className={`w-full text-left p-3 md:p-4 rounded-xl transition-all duration-200 flex items-center justify-between group border border-transparent
                                        ${selectedDistrict?.district === center.district 
                                            ? "bg-blue-600 text-white shadow-md shadow-blue-200 border-blue-500" 
                                            : "hover:bg-white hover:shadow-sm hover:border-gray-200 text-gray-700"}`}
                                >
                                    <div>
                                        <h3 className={`font-bold text-sm ${selectedDistrict?.district === center.district ? "text-white" : "text-slate-800"}`}>
                                            {center.district}
                                        </h3>
                                        <p className={`text-[10px] uppercase font-semibold tracking-wide ${selectedDistrict?.district === center.district ? "text-blue-200" : "text-gray-400"}`}>
                                            {center?.covered_area?.length || 0} Areas Covered
                                        </p>
                                    </div>
                                    <div className={`p-2 rounded-full ${selectedDistrict?.district === center.district ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500"}`}>
                                        <FaMapMarkerAlt size={14} />
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                    
                    {/* Footer Status */}
                    {selectedDivision && (
                        <div className="p-3 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-400 font-medium">
                            Found {filteredDistricts.length} Locations in {selectedDivision}
                        </div>
                    )}
                </div>

                {/* RIGHT: Map Container */}
                <div className="lg:col-span-8 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden relative h-[500px] lg:h-full">
                    <BangladeshMap 
                        serviceCenters={serviceCenters} 
                        activeDistrict={selectedDistrict} 
                    />
                    
                    {/* Floating Info Card */}
                    {selectedDistrict && (
                        <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-80 z-[1000] bg-white/95 backdrop-blur-xl p-5 rounded-2xl shadow-2xl border border-white/50 animate-slideUp">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-bold text-slate-800 text-xl">{selectedDistrict.district}</h3>
                                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wide">
                                        {selectedDistrict.region}
                                    </span>
                                </div>
                                <button 
                                    onClick={() => setSelectedDistrict(null)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                            
                            <p className="text-xs text-gray-500 font-bold uppercase mb-2">Covered Zones:</p>
                            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto custom-scrollbar">
                                {selectedDistrict?.covered_area?.map((area, i) => (
                                    <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded border border-slate-200">
                                        {area}
                                    </span>
                                )) || <span className="text-xs text-gray-400">No specific zones listed</span>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Coverage;