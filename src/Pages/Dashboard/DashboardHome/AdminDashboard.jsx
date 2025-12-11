import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
    FaMotorcycle,
    FaCheckCircle,
    FaShippingFast,
    FaBoxOpen,
    FaChartPie,
} from "react-icons/fa";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";

// Professional Color Palette
const COLORS = {
    not_collected: '#F43F5E', // Rose-500
    in_transit: '#F59E0B',    // Amber-500
    rider_assigned: '#3B82F6', // Blue-500
    delivered: '#10B981',     // Emerald-500
};

// UI Config for Cards
const cardConfig = {
    rider_assigned: {
        label: "Assigned to Rider",
        icon: <FaMotorcycle size={24} />,
        bg: "bg-blue-50",
        text: "text-blue-600",
        border: "border-blue-100"
    },
    delivered: {
        label: "Successfully Delivered",
        icon: <FaCheckCircle size={24} />,
        bg: "bg-emerald-50",
        text: "text-emerald-600",
        border: "border-emerald-100"
    },
    in_transit: {
        label: "Currently In Transit",
        icon: <FaShippingFast size={24} />,
        bg: "bg-amber-50",
        text: "text-amber-600",
        border: "border-amber-100"
    },
    not_collected: {
        label: "Pending Collection",
        icon: <FaBoxOpen size={24} />,
        bg: "bg-rose-50",
        text: "text-rose-600",
        border: "border-rose-100"
    },
};

export default function AdminDashboard() {
    const axiosSecure = UseAxiosSecure();
    
    const { data: deliveryStatus = [], isLoading, isError, error } = useQuery({
        queryKey: ["parcelStatusCount"],
        queryFn: async () => {
            const res = await axiosSecure.get("/parcels/delivery/status-count");
            return res.data;
        },
        staleTime: 5 * 60 * 1000, 
        retry: 1,
    });

    const processedPieData = deliveryStatus.map((item) => ({
        name: cardConfig[item.status]?.label || item.status,
        value: item.count,
        status: item.status
    }));

    if (isLoading)
        return (
            <div className="flex justify-center items-center h-[calc(100vh-100px)]">
                <span className="loading loading-spinner loading-lg text-blue-600"></span>
            </div>
        );

    if (isError)
        return (
            <div className="flex justify-center items-center h-[50vh] text-rose-500 bg-rose-50 rounded-xl m-6 border border-rose-200">
                <p>Error loading dashboard data: {error.message}</p>
            </div>
        );

    return (
        <div className="p-6 md:p-10 space-y-8 bg-gray-50/50 min-h-full">
            
            {/* Page Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Dashboard Overview</h1>
                <p className="text-slate-500 mt-1">Real-time statistics of your courier operations.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {deliveryStatus.map(({ count, status }) => {
                    const config = cardConfig[status] || cardConfig.not_collected;
                    return (
                        <div
                            key={status}
                            className={`bg-white p-6 rounded-2xl shadow-sm border ${config.border} hover:shadow-md transition-shadow duration-300 flex items-start justify-between`}
                        >
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-1">{config.label}</p>
                                <h2 className="text-3xl font-bold text-slate-800">{count}</h2>
                            </div>
                            <div className={`p-3 rounded-xl ${config.bg} ${config.text}`}>
                                {config.icon}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Chart Card */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <FaChartPie className="text-blue-500" /> Delivery Status Distribution
                        </h2>
                    </div>
                    
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={processedPieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80} // Donut Style
                                    outerRadius={110}
                                    paddingAngle={5}
                                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                >
                                    {processedPieData.map((entry) => (
                                        <Cell
                                            key={`cell-${entry.status}`}
                                            fill={COLORS[entry.status] || '#94A3B8'}
                                            strokeWidth={0}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                />
                                <Legend 
                                    verticalAlign="bottom" 
                                    height={36} 
                                    iconType="circle"
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Summary / Legend Card (Optional Visual Balance) */}
                <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Quick Summary</h3>
                    <div className="space-y-4">
                        {deliveryStatus.map(({ count, status }) => {
                            const config = cardConfig[status];
                            const total = deliveryStatus.reduce((acc, curr) => acc + curr.count, 0);
                            const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
                            
                            return (
                                <div key={status} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${config?.text.replace('text-', 'bg-')}`}></div>
                                        <span className="text-sm font-medium text-slate-600">{config?.label}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-sm font-bold text-slate-800">{count}</span>
                                        <span className="text-xs text-slate-400">{percentage}%</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-slate-400 text-sm">Total Parcels Managed</p>
                        <p className="text-4xl font-extrabold text-slate-800 mt-2">
                            {deliveryStatus.reduce((acc, curr) => acc + curr.count, 0)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}