import React, { useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
    FaSearch, FaBoxOpen, FaUserTie, FaCheckCircle, 
    FaTruck, FaMapMarkedAlt, FaTimes, FaCircle 
} from 'react-icons/fa';
import { MdDeliveryDining } from "react-icons/md";

import UseAxiosSecure from '../../../../Hooks/UseAxiosSecure'; // Your custom hook
import { AuthContext } from '../../../../Context/AuthContext'; // Your Auth Context
import TrackParcelMap from '../TrackParcel'; // Import the Map Component we created earlier

const Track_parcel = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = UseAxiosSecure();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedParcel, setSelectedParcel] = useState(null); // For Modal

    // 1. Fetch User Parcels
    const { data: parcels = [], isLoading } = useQuery({
        queryKey: ['myParcels', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels?email=${user.email}`);
            // Sort by Date (Newest First)
            return res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
    });

    // 2. Filter Logic
    const filteredParcels = parcels.filter(p => 
        p.trackingId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 3. Status Step Helper
    const getStepStatus = (status) => {
        const steps = ['pending', 'rider_assigned', 'rider_take_parcel', 'in_transit', 'delivered'];
        return steps.indexOf(status);
    };

    if (isLoading) return (
        <div className="flex justify-center items-center h-screen bg-slate-50">
            <span className="loading loading-bars loading-lg text-blue-600"></span>
        </div>
    );

    return (
        <div className="p-6 md:p-10 bg-slate-50 min-h-screen font-sans">
            
            {/* Header */}
            <div className="max-w-5xl mx-auto mb-10 text-center">
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4 flex justify-center items-center gap-3">
                    <FaMapMarkedAlt className="text-blue-600" /> Track Your Shipment
                </h1>
                
                {/* Search Bar */}
                <div className="relative max-w-lg mx-auto">
                    <input 
                        type="text" 
                        placeholder="Enter Tracking ID (e.g. PCL-2025...)" 
                        className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="absolute left-5 top-5 text-gray-400 text-lg" />
                </div>
            </div>

            {/* Content Grid */}
            <div className="max-w-5xl mx-auto space-y-8">
                {filteredParcels.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl shadow-sm">
                        <FaBoxOpen className="mx-auto text-6xl text-slate-200 mb-4" />
                        <p className="text-slate-500 font-medium">No parcels found with that ID.</p>
                    </div>
                ) : (
                    filteredParcels.map((parcel) => (
                        <div key={parcel._id} className="bg-white rounded-3xl p-6 md:p-8 shadow-md border border-slate-100 relative overflow-hidden group hover:shadow-lg transition-all">
                            
                            {/* Top Bar: ID & Date */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-4 mb-6 gap-4">
                                <div>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tracking Number</span>
                                    <h2 className="text-xl md:text-2xl font-mono font-bold text-slate-800 mt-1">{parcel.trackingId}</h2>
                                    <p className="text-sm text-slate-500 mt-1">Booked on: {new Date(parcel.date).toLocaleDateString()}</p>
                                </div>
                                <button 
                                    onClick={() => setSelectedParcel(parcel)}
                                    className="btn btn-sm md:btn-md bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border-none rounded-full px-6 shadow-none hover:shadow-md transition-all gap-2"
                                >
                                    <FaMapMarkedAlt /> View Live Map
                                </button>
                            </div>

                            {/* Main Info Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                
                                {/* Col 1: Route Info */}
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Timeline Visual */}
                                    <div className="relative pl-4 border-l-2 border-slate-100 space-y-8 my-4">
                                        {/* Step 1: Pending */}
                                        <div className="relative">
                                            <div className={`absolute -left-[21px] top-1 w-4 h-4 rounded-full border-2 ${getStepStatus(parcel.delivery_status) >= 0 ? 'bg-green-500 border-green-500' : 'bg-white border-slate-300'}`}></div>
                                            <h4 className="font-bold text-slate-700">Order Placed</h4>
                                            <p className="text-xs text-slate-500">{new Date(parcel.date).toLocaleDateString()}</p>
                                        </div>

                                        {/* Step 2: Rider Assigned */}
                                        <div className="relative">
                                            <div className={`absolute -left-[21px] top-1 w-4 h-4 rounded-full border-2 ${getStepStatus(parcel.delivery_status) >= 1 ? 'bg-green-500 border-green-500' : 'bg-white border-slate-300'}`}></div>
                                            <h4 className={`font-bold ${getStepStatus(parcel.delivery_status) >= 1 ? 'text-slate-700' : 'text-slate-300'}`}>Rider Assigned</h4>
                                            <p className="text-xs text-slate-400">
                                                {parcel.assigned_rider_name ? `Rider: ${parcel.assigned_rider_name}` : "Waiting for assignment..."}
                                            </p>
                                        </div>

                                        {/* Step 3: In Transit */}
                                        <div className="relative">
                                            <div className={`absolute -left-[21px] top-1 w-4 h-4 rounded-full border-2 ${getStepStatus(parcel.delivery_status) >= 3 ? 'bg-green-500 border-green-500' : 'bg-white border-slate-300'}`}></div>
                                            <h4 className={`font-bold ${getStepStatus(parcel.delivery_status) >= 3 ? 'text-slate-700' : 'text-slate-300'}`}>In Transit</h4>
                                            <p className="text-xs text-slate-400">On the way to destination</p>
                                        </div>

                                        {/* Step 4: Delivered */}
                                        <div className="relative">
                                            <div className={`absolute -left-[21px] top-1 w-4 h-4 rounded-full border-2 ${getStepStatus(parcel.delivery_status) >= 4 ? 'bg-green-500 border-green-500' : 'bg-white border-slate-300'}`}></div>
                                            <h4 className={`font-bold ${getStepStatus(parcel.delivery_status) >= 4 ? 'text-slate-700' : 'text-slate-300'}`}>Delivered</h4>
                                            {parcel.delivered_at && <p className="text-xs text-green-600 font-bold">{new Date(parcel.delivered_at).toLocaleString()}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Col 2: Rider Card (Conditional) */}
                                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 h-fit">
                                    <h4 className="text-sm font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
                                        <MdDeliveryDining className="text-lg" /> Delivery Agent
                                    </h4>
                                    
                                    {parcel.assigned_rider_id ? (
                                        <div className="text-center space-y-3">
                                            <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm text-slate-300 text-3xl overflow-hidden">
                                                <FaUserTie /> 
                                                {/* If you have rider image: <img src={parcel.riderImage} /> */}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800">{parcel.assigned_rider_name}</h3>
                                                <p className="text-xs text-slate-500">{parcel.assigned_rider_email}</p>
                                                <div className="mt-2 inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                                    Verified Rider
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 text-slate-400">
                                            <div className="animate-pulse flex flex-col items-center">
                                                <div className="h-12 w-12 bg-slate-200 rounded-full mb-3"></div>
                                                <p className="text-xs">Searching for nearby rider...</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                            </div>

                            {/* Footer: Route Details */}
                            <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">From</p>
                                    <p className="font-semibold text-slate-700">{parcel.senderRegion}, {parcel.senderCity}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">To</p>
                                    <p className="font-semibold text-slate-700">{parcel.receiverRegion}, {parcel.receiverCity}</p>
                                </div>
                            </div>

                        </div>
                    ))
                )}
            </div>

            {/* Live Map Modal */}
            {selectedParcel && (
                <dialog id="map_modal" className="modal modal-open backdrop-blur-sm">
                    <div className="modal-box w-11/12 max-w-5xl p-0 rounded-2xl overflow-hidden bg-slate-100 shadow-2xl">
                        
                        {/* Modal Header */}
                        <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <FaMapMarkedAlt className="text-blue-500" /> Live Location
                            </h3>
                            <button onClick={() => setSelectedParcel(null)} className="btn btn-sm btn-circle btn-ghost text-white hover:bg-white/20">
                                <FaTimes />
                            </button>
                        </div>

                        {/* Map Component */}
                        <div className="h-[500px] w-full bg-white relative">
                            <TrackParcelMap parcel={selectedParcel} />
                        </div>
                        
                    </div>
                </dialog>
            )}

        </div>
    );
};

export default Track_parcel;