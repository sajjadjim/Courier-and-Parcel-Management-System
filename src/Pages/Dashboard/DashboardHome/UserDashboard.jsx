import React, { useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { 
    FaBoxOpen, 
    FaCheckCircle, 
    FaHourglassHalf, 
    FaCalendarAlt, 
    FaArrowRight, 
    FaTruck,
    FaMapMarkedAlt,
    FaTimes
} from 'react-icons/fa';

import { AuthContext } from '../../../Context/AuthContext';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
// IMPORT THE TRACKING COMPONENT
import TrackParcel from '../user/TrackParcel'; 

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = UseAxiosSecure();
    const [viewParcel, setViewParcel] = useState(null); // State for modal

    // Fetch user's parcels
    const { data: parcels = [], isLoading } = useQuery({
        queryKey: ['dashboardStats', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels?email=${user?.email}`);
            // Return sorted by date (newest first)
            return res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        },
    });

    // --- CALCULATE STATS ---
    const totalParcels = parcels.length;
    const paidParcels = parcels.filter(p => p.payment_status === 'paid').length;
    const unpaidParcels = parcels.filter(p => p.payment_status !== 'paid').length;

    const latestParcel = parcels.length > 0 ? parcels[0] : null;
    const lastDate = latestParcel 
        ? new Date(latestParcel.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
        : "No shipments yet";

    // Open Modal Function
    const handleTrack = (parcel) => {
        setViewParcel(parcel);
        document.getElementById('tracking_modal').showModal();
    };

    if (isLoading) return (
        <div className="min-h-screen flex justify-center items-center">
            <span className="loading loading-bars loading-lg text-blue-600"></span>
        </div>
    );

    return (
        <div className="p-6 md:p-10 min-h-screen bg-slate-50/50 font-sans">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">
                        Dashboard
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg">
                        Welcome back, <span className="font-bold text-blue-600">{user?.displayName}!</span> here's your shipping overview.
                    </p>
                </div>
                <Link to="/addparcel" className="btn bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-lg shadow-blue-200 border-none">
                    <FaTruck /> Book a Parcel
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {/* Total Parcels */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all">
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Bookings</p>
                        <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{totalParcels}</h3>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                        <FaBoxOpen />
                    </div>
                </div>

                {/* Paid Parcels */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all">
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Paid Parcels</p>
                        <h3 className="text-3xl font-extrabold text-emerald-600 mt-1">{paidParcels}</h3>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                        <FaCheckCircle />
                    </div>
                </div>

                {/* Unpaid / Pending */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all">
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Unpaid / Due</p>
                        <h3 className="text-3xl font-extrabold text-amber-500 mt-1">{unpaidParcels}</h3>
                    </div>
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                        <FaHourglassHalf />
                    </div>
                </div>

                {/* Last Activity */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-lg text-white flex items-center justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Last Shipment</p>
                        <h3 className="text-lg font-bold mt-1 leading-tight">{lastDate}</h3>
                    </div>
                    <div className="relative z-10 w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-xl">
                        <FaCalendarAlt />
                    </div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                </div>
            </div>

            {/* === RECENT PARCELS TABLE (New Section) === */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-800">Recent Bookings</h3>
                    <Link to="/dashboard/myParcels" className="text-sm text-blue-600 font-bold hover:underline">View All</Link>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                            <tr>
                                <th className="pl-6 py-4">Tracking ID</th>
                                <th>Status</th>
                                <th>Booking Date</th>
                                <th>Amount</th>
                                <th className="text-right pr-6">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {parcels.slice(0, 5).map((parcel) => (
                                <tr key={parcel._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="pl-6 py-4 font-mono font-medium text-slate-600">
                                        {parcel.trackingId}
                                    </td>
                                    <td>
                                        <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${
                                            parcel.delivery_status === 'delivered' ? 'bg-green-100 text-green-700' : 
                                            parcel.delivery_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                            {parcel.delivery_status.replace(/_/g, " ")}
                                        </span>
                                    </td>
                                    <td className="text-slate-500 text-sm">
                                        {new Date(parcel.date).toLocaleDateString()}
                                    </td>
                                    <td className="font-bold text-slate-700">
                                        ৳{parcel.deliveryCharge?.amount ||parcel.deliveryCharge?.charge || 0}
                                    </td>
                                    <td className="text-right pr-6">
                                        <button 
                                            onClick={() => handleTrack(parcel)}
                                            className="btn btn-sm btn-ghost text-blue-600 hover:bg-blue-50 gap-2 border border-blue-100 hover:border-blue-200"
                                        >
                                            <FaMapMarkedAlt /> Track Live
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* === TRACKING MODAL === */}
            <dialog id="tracking_modal" className="modal backdrop-blur-sm">
                <div className="modal-box w-11/12 max-w-5xl p-0 rounded-2xl overflow-hidden bg-slate-100">
                    
                    {/* Modal Header */}
                    <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <FaTruck className="text-blue-500" /> Tracking Shipment
                        </h3>
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost text-white hover:bg-white/20">
                                <FaTimes />
                            </button>
                        </form>
                    </div>

                    {/* Modal Content (Map) */}
                    <div className="p-0">
                        {viewParcel && <TrackParcel parcel={viewParcel} />}
                    </div>
                </div>
            </dialog>

        </div>
    );
};

export default UserDashboard;