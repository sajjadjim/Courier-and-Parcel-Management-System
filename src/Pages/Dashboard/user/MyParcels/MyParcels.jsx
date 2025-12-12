import { useQuery } from '@tanstack/react-query';
import React, { use, useEffect, useState } from 'react';
import { AuthContext } from '../../../../Context/AuthContext';
import UseAxiosSecure from '../../../../Hooks/UseAxiosSecure';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import { FaBoxOpen, FaCreditCard, FaEdit, FaTrashAlt, FaFilter, FaPlus } from "react-icons/fa";

const MyParcels = () => {
    const navigate = useNavigate();
    const [parcels, setParcels] = useState([]);
    const [filter, setFilter] = useState('all'); // State for filtering UI
    const { user } = use(AuthContext);
    const axiosSecure = UseAxiosSecure();

    const { data: parcelsAll = [], refetch } = useQuery({
        queryKey: ['myParcels', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels?email=${user?.email}`);
            return res.data;
        }
    });

    // Sync state and handle filtering
    useEffect(() => {
        if (parcelsAll.length) {
            if (filter === 'all') {
                setParcels(parcelsAll);
            } else {
                setParcels(parcelsAll.filter(p => p.payment_status === filter));
            }
        }
    }, [parcelsAll, filter]);

    const handleDelete = (id) => {
        Swal.fire({
            title: "Delete Parcel?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444", // Red-500
            cancelButtonColor: "#6b7280", // Gray-500
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                // Ideally use axiosSecure here, but keeping your fetch logic
                const res = await fetch(`https://server-courier-and-parcel-managemen.vercel.app/parcels/${id}`, {
                    method: "DELETE",
                });

                if (res.ok) {
                    refetch(); // Refetch data from server to be safe
                    Swal.fire("Deleted!", "Your parcel has been deleted.", "success");
                } else {
                    Swal.fire("Error", "Failed to delete parcel.", "error");
                }
            }
        });
    };

    const handleUpdate = async (id) => {
        const { value: payment_status } = await Swal.fire({
            title: "Update Status",
            input: "select",
            inputOptions: {
                paid: "Paid",
                unpaid: "Unpaid",
            },
            inputPlaceholder: "Select status",
            showCancelButton: true,
            confirmButtonColor: "#3b82f6",
        });

        if (payment_status) {
            await fetch(`https://server-courier-and-parcel-managemen.vercel.app/parcels/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ payment_status }),
            });
            refetch(); // Refresh data
            Swal.fire("Updated!", "Payment status updated.", "success");
        }
    };

    const handlePayment = (id) => {
        navigate(`/dashboard/payment/${id}`);
    };

    return (
        <div className="w-full space-y-6">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaBoxOpen className="text-blue-600" /> My Parcels
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Manage your shipment history and payments</p>
                </div>
                <button 
                    onClick={() => navigate('/addparcel')}
                    className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md shadow-blue-200 text-sm font-medium"
                >
                    <FaPlus /> Book New Parcel
                </button>
            </div>

            {/* Filters & Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                
                {/* Filter Tabs */}
                <div className="flex items-center gap-4 p-4 border-b border-gray-100 overflow-x-auto">
                    <button 
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'all' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        All Parcels
                    </button>
                    <button 
                        onClick={() => setFilter('paid')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'paid' ? 'bg-green-50 text-green-700' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Paid
                    </button>
                    <button 
                        onClick={() => setFilter('unpaid')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'unpaid' ? 'bg-amber-50 text-amber-700' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Unpaid
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="p-4 font-semibold"># Parcel ID</th>
                                <th className="p-4 font-semibold">Details</th>
                                <th className="p-4 font-semibold">Date</th>
                                <th className="p-4 font-semibold text-center">Status</th>
                                <th className="p-4 font-semibold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {parcels.map((parcel, idx) => (
                                <tr key={parcel._id} className="hover:bg-gray-50/80 transition-colors duration-200 group">
                                    <td className="p-4 text-gray-600 text-sm font-medium">
                                        #{parcel._id.slice(-6).toUpperCase()}
                                        <span className="block text-xs text-gray-400 font-normal">{idx + 1}</span>
                                    </td>
                                    
                                    <td className="p-4">
                                        <p className="text-gray-800 font-semibold text-sm">{parcel.parcelName}</p>
                                        <p className="text-xs text-gray-400">{parcel.parcelType}</p>
                                    </td>

                                    <td className="p-4 text-sm text-gray-500">
                                        {new Date(parcel.date).toLocaleDateString(undefined, {
                                            year: 'numeric', month: 'short', day: 'numeric'
                                        })}
                                    </td>

                                    <td className="p-4 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                            ${parcel.payment_status === "paid" 
                                                ? "bg-green-50 text-green-700 border-green-200" 
                                                : "bg-amber-50 text-amber-700 border-amber-200"
                                            }`}>
                                            {parcel.payment_status === "paid" ? "Paid" : "Unpaid"}
                                        </span>
                                    </td>

                                    <td className="p-4 flex justify-center gap-2">
                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all tooltip"
                                                title="Update Status"
                                                onClick={() => handleUpdate(parcel._id)}
                                            >
                                                <FaEdit size={16} />
                                            </button>
                                            
                                            {parcel.payment_status === "unpaid" && (
                                                <button
                                                    className="p-2 rounded-lg text-amber-500 hover:text-amber-700 hover:bg-amber-50 transition-all tooltip"
                                                    title="Pay Now"
                                                    onClick={() => handlePayment(parcel._id)}
                                                >
                                                    <FaCreditCard size={16} />
                                                </button>
                                            )}

                                            <button
                                                className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all tooltip"
                                                title="Delete Parcel"
                                                onClick={() => handleDelete(parcel._id)}
                                            >
                                                <FaTrashAlt size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Empty State */}
                    {parcels.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                            <div className="bg-gray-50 p-4 rounded-full mb-4">
                                <FaBoxOpen className="text-gray-300 text-4xl" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700">No Parcels Found</h3>
                            <p className="text-gray-500 text-sm max-w-xs mt-1 mb-6">
                                You haven't booked any parcels with this status yet.
                            </p>
                            <button 
                                onClick={() => navigate('/addparcel')}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
                            >
                                Create your first booking &rarr;
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyParcels;