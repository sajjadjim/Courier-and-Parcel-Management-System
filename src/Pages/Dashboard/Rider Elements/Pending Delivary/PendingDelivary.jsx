import React, { use, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { FaBoxOpen, FaCheckCircle, FaMapMarkerAlt, FaTruckLoading, FaPhoneAlt } from "react-icons/fa";

import UseAxiosSecure from '../../../../Hooks/UseAxiosSecure';
import { AuthContext } from '../../../../Context/AuthContext';
import useTrackingLogger from '../../../../Hooks/useTrackingLogger';

const PendingDelivary = () => {
    const axiosSecure = UseAxiosSecure();
    const queryClient = useQueryClient();
    const { user } = use(AuthContext);
    const { logTracking } = useTrackingLogger(); 

    // 1. Fetch ALL Parcels and Filter for Current Rider
    const { data: parcels = [], isLoading } = useQuery({
        queryKey: ["riderParcels", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get('/parcels');
            // Filter: Only return parcels assigned to this rider
            return res.data.filter(parcel => 
                parcel.assigned_rider_email === user.email
            );
        },
    });

    // 2. Filter for Active Tasks (Include your new status 'rider_take_parcel')
    const activeParcels = useMemo(() => {
        return parcels.filter(p => 
            ['rider_assigned', 'rider_take_parcel', 'in_transit'].includes(p.delivery_status)
        );
    }, [parcels]);

    // 3. Mutation to Update Status
    const { mutateAsync: updateStatus } = useMutation({
        mutationFn: async ({ id, status }) => {
            const res = await axiosSecure.patch(`/parcels/${id}/status`, { status });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["riderParcels"]);
        },
    });

    // 4. Handle Actions
    const handleStatusChange = async (parcel, action) => {
        let newStatus = "";
        let confirmTitle = "";
        let confirmText = "";
        let logDetails = "";

        // --- LOGIC UPDATED HERE ---
        if (action === "take") {
            newStatus = "rider_take_parcel"; // Updated as per your request
            confirmTitle = "Accept Parcel?";
            confirmText = "Confirm that you have picked up this parcel.";
            logDetails = `Parcel picked up by Rider: ${user.displayName}`;
        } else if (action === "deliver") {
            newStatus = "delivered";
            confirmTitle = "Confirm Delivery?";
            confirmText = "Mark this parcel as successfully delivered.";
            logDetails = `Parcel successfully delivered by ${user.displayName}`;
        }

        const result = await Swal.fire({
            title: confirmTitle,
            text: confirmText,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#2563eb",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Confirm"
        });

        if (result.isConfirmed) {
            try {
                await updateStatus({ id: parcel._id, status: newStatus });

                if (logTracking) {
                    await logTracking({
                        trackingId: parcel.trackingId,
                        status: newStatus,
                        details: logDetails,
                        updated_by: user.email,
                    });
                }
                Swal.fire("Success!", "Status updated successfully.", "success");
            } catch (error) {
                console.error(error);
                Swal.fire("Error", "Failed to update status", "error");
            }
        }
    };

    if (isLoading) return (
        <div className="min-h-screen flex justify-center items-center">
            <span className="loading loading-bars loading-lg text-blue-600"></span>
        </div>
    );

    return (
        <div className="p-4 md:p-10 bg-slate-50 min-h-screen font-sans">
            
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                    <FaTruckLoading size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">My Tasks</h2>
                    <p className="text-slate-500 text-sm">Manage your pickups and deliveries.</p>
                </div>
            </div>

            {/* Content */}
            {activeParcels.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaBoxOpen className="text-slate-300 text-3xl" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-700">No Pending Tasks</h3>
                    <p className="text-slate-400">You are all caught up!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {activeParcels.map((parcel) => (
                        <div 
                            key={parcel._id} 
                            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all relative overflow-hidden group"
                        >
                            {/* Status Badge */}
                            <div className="absolute top-4 right-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                                    parcel.delivery_status === 'rider_assigned' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                    'bg-blue-50 text-blue-600 border-blue-100'
                                }`}>
                                    {parcel.delivery_status.replace(/_/g, " ")}
                                </span>
                            </div>

                            {/* Parcel Title & ID */}
                            <div className="mb-6 pr-24">
                                <h3 className="text-lg font-bold text-slate-800">{parcel.parcelName}</h3>
                                <p className="text-xs text-slate-400 font-mono mt-1">ID: {parcel.trackingId}</p>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100 mb-6">
                                {/* Pickup */}
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 flex items-center gap-1">
                                        <FaBoxOpen /> Pickup From
                                    </p>
                                    <p className="font-semibold text-slate-700 text-sm">{parcel.senderName}</p>
                                    <p className="text-xs text-slate-500 mb-1">{parcel.senderWarehouse || parcel.senderAddress}</p>
                                    <a href={`tel:${parcel.senderContact}`} className="text-xs text-blue-600 flex items-center gap-1 hover:underline">
                                        <FaPhoneAlt size={10} /> {parcel.senderContact}
                                    </a>
                                </div>

                                {/* Delivery */}
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 flex items-center gap-1">
                                        <FaMapMarkerAlt /> Deliver To
                                    </p>
                                    <p className="font-semibold text-slate-700 text-sm">{parcel.receiverName}</p>
                                    <p className="text-xs text-slate-500 mb-1">{parcel.receiverWarehouse || parcel.receiverAddress}</p>
                                    <a href={`tel:${parcel.receiverContact}`} className="text-xs text-blue-600 flex items-center gap-1 hover:underline">
                                        <FaPhoneAlt size={10} /> {parcel.receiverContact}
                                    </a>
                                </div>
                            </div>

                            {/* --- ACTION BUTTONS --- */}
                            <div className="pt-2">
                                {/* Condition 1: Rider Assigned -> Show TAKE PARCEL */}
                                {parcel.delivery_status === 'rider_assigned' && (
                                    <button 
                                        onClick={() => handleStatusChange(parcel, "take")}
                                        className="w-full btn bg-blue-600 hover:bg-blue-700 text-white border-none rounded-xl shadow-lg shadow-blue-200"
                                    >
                                        Take Parcel
                                    </button>
                                )}

                                {/* Condition 2: Rider Took Parcel -> Show DELIVER */}
                                {(parcel.delivery_status === 'rider_take_parcel' || parcel.delivery_status === 'in_transit') && (
                                    <button 
                                        onClick={() => handleStatusChange(parcel, "deliver")}
                                        className="w-full btn bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded-xl shadow-lg shadow-emerald-200"
                                    >
                                        Mark as Delivered
                                    </button>
                                )}
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PendingDelivary;