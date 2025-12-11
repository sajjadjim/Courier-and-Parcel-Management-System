import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { 
    FaBoxOpen, 
    FaCheckCircle, 
    FaHourglassHalf, 
    FaCalendarAlt, 
    FaArrowRight, 
    FaTruck 
} from 'react-icons/fa';

import { AuthContext } from '../../../Context/AuthContext';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = UseAxiosSecure();

    // Fetch user's parcels
    const { data: parcels = [], isLoading } = useQuery({
        queryKey: ['dashboardStats', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels?email=${user?.email}`);
            return res.data;
        },
    });

    // --- CALCULATE STATS ---
    const totalParcels = parcels.length;
    const paidParcels = parcels.filter(p => p.payment_status === 'paid').length;
    const unpaidParcels = parcels.filter(p => p.payment_status !== 'paid').length;

    // Find latest parcel date
    const latestParcel = parcels.length > 0 
        ? parcels.reduce((a, b) => new Date(a.date) > new Date(b.date) ? a : b) 
        : null;

    const lastDate = latestParcel 
        ? new Date(latestParcel.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
        : "No shipments yet";

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
                <Link to="/addparcel" className="btn bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-lg shadow-blue-200">
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
                    {/* Decor */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                </div>
            </div>

            {/* Quick Action / Recent Notice */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex w-16 h-16 bg-blue-100 rounded-full items-center justify-center text-blue-600 text-2xl">
                        🚀
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Ready to send another package?</h3>
                        <p className="text-slate-500 mt-1">
                            Our riders are available in your area. Book now for express pickup.
                        </p>
                    </div>
                </div>
                <Link to="/addparcel" className="flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition-colors">
                    Send Now <FaArrowRight />
                </Link>
            </div>

        </div>
    );
};

export default UserDashboard;