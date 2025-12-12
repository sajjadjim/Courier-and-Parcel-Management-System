import React, { useState, useMemo, use } from 'react';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaCheckCircle, FaMoneyBillWave, FaArrowLeft, FaArrowRight, FaBox } from "react-icons/fa";

import UseAxiosSecure from "../../../../Hooks/UseAxiosSecure";
import { AuthContext } from "../../../../Context/AuthContext";

const CompletedDelivery = () => {
    const axiosSecure = UseAxiosSecure();
    const queryClient = useQueryClient();
    const { user } = use(AuthContext);
    
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // 1. Fetch & Filter Data
    const { data: parcels = [], isLoading } = useQuery({
        queryKey: ["completedDeliveries", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            // Fetch all parcels
            const res = await axiosSecure.get('/parcels');
            
            // FILTER: 
            // 1. Assigned to current rider
            // 2. Status is 'delivered'
            const myCompleted = res.data.filter(parcel => 
                parcel.assigned_rider_email === user.email && 
                parcel.delivery_status === 'delivered'
            );
            
            // Sort by delivered date (newest first)
            return myCompleted.sort((a, b) => new Date(b.delivered_at) - new Date(a.delivered_at));
        },
    });

    // 2. Pagination Logic
    const totalPages = Math.ceil(parcels.length / itemsPerPage);
    const paginatedParcels = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return parcels.slice(start, start + itemsPerPage);
    }, [parcels, currentPage]);

    // 3. Earning Calculator
    const calculateEarning = (parcel) => {
        // Handle variations in data structure (charge vs amount)
        const totalFee = parcel.deliveryCharge?.charge || parcel.deliveryCharge?.amount || 0;
        
        // Logic: Same Region = Higher Commission
        if (parcel.senderRegion?.toLowerCase() === parcel.receiverRegion?.toLowerCase()) {
            return totalFee * 0.80; // 80% for same city
        } else {
            return totalFee * 0.30; // 30% for inter-city
        }
    };

    // 4. Cashout Mutation
    const { mutateAsync: cashout } = useMutation({
        mutationFn: async (parcelId) => {
            const res = await axiosSecure.patch(`/parcels/${parcelId}/cashout`, { cashout_status: "cashed_out" });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["completedDeliveries"]);
            Swal.fire("Success", "Amount added to your wallet.", "success");
        },
    });

    const handleCashout = (parcelId) => {
        Swal.fire({
            title: "Cash Out?",
            text: "Transfer this earning to your wallet?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#10B981",
            confirmButtonText: "Yes, Cash Out",
        }).then((result) => {
            if (result.isConfirmed) {
                cashout(parcelId);
            }
        });
    };

    if (isLoading) return (
        <div className="flex justify-center items-center h-screen">
            <span className="loading loading-bars loading-lg text-blue-600"></span>
        </div>
    );

    return (
        <div className="p-6 md:p-10 bg-slate-50 min-h-screen font-sans">
            
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="bg-green-100 p-3 rounded-full text-green-600">
                    <FaCheckCircle size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Delivery History</h2>
                    <p className="text-slate-500 text-sm">View your completed jobs and earnings.</p>
                </div>
                <div className="ml-auto bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
                    <span className="text-xs text-slate-400 uppercase font-bold">Total Completed</span>
                    <p className="text-xl font-bold text-slate-800">{parcels.length}</p>
                </div>
            </div>

            {/* Content Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {paginatedParcels.length === 0 ? (
                    <div className="text-center py-20">
                        <FaBox className="mx-auto text-slate-200 text-5xl mb-4" />
                        <p className="text-slate-500 font-medium">No completed deliveries found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="py-4 pl-6">Tracking ID</th>
                                    <th>Parcel Info</th>
                                    <th>Route</th>
                                    <th>Delivered At</th>
                                    <th>Earning</th>
                                    <th className="text-right pr-6">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {paginatedParcels.map((parcel) => (
                                    <tr key={parcel._id} className="hover:bg-slate-50/50 transition-colors">
                                        
                                        {/* Tracking ID */}
                                        <td className="pl-6 py-4">
                                            <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                                {parcel.trackingId}
                                            </span>
                                        </td>

                                        {/* Parcel Info */}
                                        <td>
                                            <div className="font-bold text-slate-800">{parcel.parcelName}</div>
                                            <div className="text-xs text-slate-400 capitalize">{parcel.parcelType}</div>
                                        </td>

                                        {/* Route */}
                                        <td>
                                            <div className="text-xs">
                                                <span className="text-slate-400">From:</span> <span className="font-medium text-slate-700">{parcel.senderRegion}</span>
                                            </div>
                                            <div className="text-xs mt-1">
                                                <span className="text-slate-400">To:</span> <span className="font-medium text-slate-700">{parcel.receiverRegion}</span>
                                            </div>
                                        </td>

                                        {/* Date */}
                                        <td>
                                            <div className="text-sm text-slate-600">
                                                {parcel.delivered_at 
                                                    ? new Date(parcel.delivered_at).toLocaleDateString() 
                                                    : "N/A"}
                                            </div>
                                            <div className="text-xs text-slate-400">
                                                {parcel.delivered_at 
                                                    ? new Date(parcel.delivered_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
                                                    : ""}
                                            </div>
                                        </td>

                                        {/* Earning */}
                                        <td>
                                            <div className="font-bold text-emerald-600">
                                                ৳ {calculateEarning(parcel).toFixed(0)}
                                            </div>
                                            <div className="text-[10px] text-slate-400">
                                                Base Fee: ৳{parcel.deliveryCharge?.charge || parcel.deliveryCharge?.amount}
                                            </div>
                                        </td>

                                        {/* Action (Cashout) */}
                                        <td className="text-right pr-6">
                                            {parcel.cashout_status === "cashed_out" ? (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-bold border border-gray-200">
                                                    <FaCheckCircle /> Paid
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => handleCashout(parcel._id)}
                                                    className="btn btn-sm bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-md shadow-emerald-200 gap-2"
                                                >
                                                    <FaMoneyBillWave /> Cashout
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination Controls */}
                {parcels.length > itemsPerPage && (
                    <div className="flex justify-between items-center p-4 border-t border-slate-100 bg-white">
                        <button
                            className="btn btn-sm btn-ghost gap-2 disabled:bg-transparent"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            <FaArrowLeft /> Previous
                        </button>
                        
                        <span className="text-sm font-medium text-slate-600">
                            Page {currentPage} of {totalPages}
                        </span>

                        <button
                            className="btn btn-sm btn-ghost gap-2 disabled:bg-transparent"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next <FaArrowRight />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompletedDelivery;