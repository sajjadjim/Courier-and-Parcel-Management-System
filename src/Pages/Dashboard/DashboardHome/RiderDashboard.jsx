import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
    FaBoxOpen, 
    FaCheckCircle, 
    FaWallet, 
    FaTruckMoving, 
    FaStar 
} from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import { AuthContext } from '../../../Context/AuthContext';

const RiderDashboard = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = UseAxiosSecure();

    // 1. Fetch All Parcels assigned to Rider
    const { data: parcels = [], isLoading } = useQuery({
        queryKey: ["riderDashboardStats", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get('/parcels');
            // Filter only this rider's parcels
            return res.data.filter(p => p.assigned_rider_email === user.email);
        },
    });

    // 2. Calculate Statistics
    const completedParcels = parcels.filter(p => p.delivery_status === 'delivered');
    const pendingParcels = parcels.filter(p => ['rider_assigned', 'rider_take_parcel', 'in_transit'].includes(p.delivery_status));
    
    // Calculate Total Earnings (Logic: 80% if same region, 30% if different)
    const totalEarnings = completedParcels.reduce((acc, curr) => {
        const amount = curr.deliveryCharge?.amount || 0;
        // Check if sender and receiver regions match (Case insensitive)
        const isSameRegion = curr.senderRegion?.toLowerCase() === curr.receiverRegion?.toLowerCase();
        const commission = isSameRegion ? 0.8 : 0.3; 
        return acc + (amount * commission);
    }, 0);

    // 3. Prepare Chart Data (Last 5 Deliveries)
    const chartData = completedParcels.slice(0, 5).map((p, index) => ({
        name: `Job ${index + 1}`,
        earning: (p.deliveryCharge?.amount || 0) * (p.senderRegion === p.receiverRegion ? 0.8 : 0.3),
    }));

    if (isLoading) return (
        <div className="flex justify-center items-center h-screen">
            <span className="loading loading-bars loading-lg text-blue-600"></span>
        </div>
    );

    return (
        <div className="p-6 md:p-10 bg-slate-50 min-h-screen font-sans">
            
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-extrabold text-slate-800">Rider Dashboard</h1>
                <p className="text-slate-500 mt-2">
                    Welcome back, <span className="font-bold text-blue-600">{user?.displayName}</span>! Here is your performance overview.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                
                {/* Total Completed */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Completed</p>
                        <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{completedParcels.length}</h3>
                    </div>
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center text-xl">
                        <FaCheckCircle />
                    </div>
                </div>

                {/* Pending Tasks */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Pending</p>
                        <h3 className="text-3xl font-extrabold text-amber-500 mt-1">{pendingParcels.length}</h3>
                    </div>
                    <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center text-xl">
                        <FaTruckMoving />
                    </div>
                </div>

                {/* Total Earnings */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Earnings</p>
                        <h3 className="text-3xl font-extrabold text-blue-600 mt-1">৳{totalEarnings.toFixed(0)}</h3>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl">
                        <FaWallet />
                    </div>
                </div>

                {/* Rating (Static Placeholder) */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-lg text-white flex items-center justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">My Rating</p>
                        <h3 className="text-3xl font-extrabold mt-1 flex items-center gap-2">
                            4.9 <span className="text-sm font-medium text-yellow-400 opacity-80">/ 5.0</span>
                        </h3>
                    </div>
                    <div className="relative z-10 w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-xl text-yellow-400">
                        <FaStar />
                    </div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                </div>
            </div>

            {/* Split View: Graph & Recent List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Chart Section */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Earnings Overview</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} prefix="৳" />
                                <Tooltip 
                                    cursor={{fill: '#f1f5f9'}}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="earning" radius={[6, 6, 0, 0]} barSize={40}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill="#3b82f6" />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity List */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Deliveries</h3>
                    <div className="space-y-4">
                        {completedParcels.length > 0 ? (
                            completedParcels.slice(0, 4).map((parcel) => (
                                <div key={parcel._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                                        <FaBoxOpen />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-slate-700 text-sm truncate">{parcel.parcelName}</h4>
                                        <p className="text-xs text-slate-500 truncate">{new Date(parcel.delivered_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="block font-bold text-blue-600 text-sm">
                                            +৳{((parcel.deliveryCharge?.amount || 0) * (parcel.senderRegion === parcel.receiverRegion ? 0.8 : 0.3)).toFixed(0)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-400 text-sm text-center py-10">No completed deliveries yet.</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default RiderDashboard;