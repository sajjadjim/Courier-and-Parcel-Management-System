import React, { useState, useMemo } from 'react';
import UseAxiosSecure from '../../../../Hooks/UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { FaEye, FaCheck, FaTimes, FaFilter, FaUserClock, FaMotorcycle } from "react-icons/fa";

const Pending_Riders = () => {
    const [selectedRider, setSelectedRider] = useState(null);
    const [filterRegion, setFilterRegion] = useState('All');
    const axiosSecure = UseAxiosSecure();

    const { isPending, data: riders = [], refetch } = useQuery({
        queryKey: ['pending-riders'],
        queryFn: async () => {
            const res = await axiosSecure.get("/riders/pending");
            return res.data;
        }
    });

    // 1. EXTRACT UNIQUE REGIONS FOR FILTER DROPDOWN
    const uniqueRegions = useMemo(() => {
        const regions = riders.map(r => r.region).filter(Boolean);
        return ['All', ...new Set(regions)];
    }, [riders]);

    // 2. SORT (NEWEST FIRST) & FILTER DATA
    const displayedRiders = useMemo(() => {
        let sorted = [...riders].sort((a, b) => new Date(b.createTime) - new Date(a.createTime)); // Newest top
        
        if (filterRegion !== 'All') {
            return sorted.filter(rider => rider.region === filterRegion);
        }
        return sorted;
    }, [riders, filterRegion]);

    const handleDecision = async (id, action, email) => {
        const confirm = await Swal.fire({
            title: action === "approve" ? "Approve Application?" : "Reject Application?",
            text: action === "approve" ? "This rider will be able to login immediately." : "This application will be archived.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: action === "approve" ? "#10B981" : "#EF4444", // Green for Yes, Red for No
            confirmButtonText: action === "approve" ? "Yes, Approve" : "Yes, Reject",
        });

        if (!confirm.isConfirmed) return;

        try {
            const status = action === "approve" ? "active" : "rejected";
            await axiosSecure.patch(`/riders/${id}/status`, { status, email });
            refetch();
            Swal.fire({
                title: "Updated!",
                text: `Rider has been ${action}d.`,
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });
        } catch (err) {
            Swal.fire("Error", "Could not update rider status", "error");
        }
    };

    // SKELETON LOADER
    if (isPending) {
        return (
            <div className="p-8 space-y-4">
                <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-64 bg-gray-100 rounded-xl animate-pulse"></div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 bg-slate-50 min-h-screen font-sans">
            
            {/* --- HEADER SECTION --- */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                        <FaUserClock className="text-blue-600" /> Pending Applications
                    </h2>
                    <p className="text-slate-500 mt-1">Review and manage new rider requests.</p>
                </div>

                {/* Filter Dropdown */}
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                    <FaFilter className="text-gray-400" />
                    <select 
                        className="bg-transparent outline-none text-slate-700 text-sm font-semibold cursor-pointer"
                        value={filterRegion}
                        onChange={(e) => setFilterRegion(e.target.value)}
                    >
                        {uniqueRegions.map((region, idx) => (
                            <option key={idx} value={region}>{region === 'All' ? 'Filter by Region' : region}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* --- TABLE CARD --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        {/* Head */}
                        <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider">
                            <tr>
                                <th className="py-4 pl-6">Applicant Name</th>
                                <th>Contact Info</th>
                                <th>Region / City</th>
                                <th>Vehicle Type</th>
                                <th>Applied Date</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        {/* Body */}
                        <tbody className="divide-y divide-gray-100">
                            {displayedRiders.length > 0 ? (
                                displayedRiders.map((rider) => (
                                    <tr key={rider._id} className="hover:bg-blue-50/50 transition-colors">
                                        <td className="pl-6">
                                            <div className="font-bold text-slate-800">{rider.name}</div>
                                            <div className="text-xs text-slate-400">NID: {rider.nid || "N/A"}</div>
                                        </td>
                                        <td>
                                            <div className="text-sm text-slate-700">{rider.email}</div>
                                            <div className="text-xs text-slate-500">{rider.mobile}</div>
                                        </td>
                                        <td>
                                            <div className="badge badge-ghost badge-sm font-semibold">{rider.region}</div>
                                            <div className="text-xs text-slate-500 mt-1">{rider.city}</div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2 text-sm text-slate-700">
                                                <FaMotorcycle className="text-slate-400" />
                                                {rider.vehicleType || "Bike"}
                                            </div>
                                            <div className="text-xs text-slate-400">{rider.bikeRegistrationNumber || "Reg: N/A"}</div>
                                        </td>
                                        <td className="text-sm text-slate-600 font-medium">
                                            {rider.createTime ? new Date(rider.createTime).toLocaleDateString() : "N/A"}
                                        </td>
                                        <td>
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => setSelectedRider(rider)}
                                                    className="btn btn-sm btn-square btn-ghost text-blue-600 hover:bg-blue-100"
                                                    title="View Details"
                                                >
                                                    <FaEye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDecision(rider._id, "approve", rider.email)}
                                                    className="btn btn-sm btn-square btn-ghost text-emerald-600 hover:bg-emerald-100"
                                                    title="Approve"
                                                >
                                                    <FaCheck size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDecision(rider._id, "reject", rider.email)}
                                                    className="btn btn-sm btn-square btn-ghost text-rose-600 hover:bg-rose-100"
                                                    title="Reject"
                                                >
                                                    <FaTimes size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-10 text-slate-400">
                                        No pending applications found in this region.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- DETAILS MODAL --- */}
            {selectedRider && (
                <dialog id="riderDetailsModal" className="modal modal-open backdrop-blur-sm">
                    <div className="modal-box w-11/12 max-w-3xl rounded-2xl p-0 overflow-hidden">
                        
                        {/* Modal Header */}
                        <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
                            <h3 className="font-bold text-xl flex items-center gap-2">
                                <FaUserClock /> Application Details
                            </h3>
                            <button onClick={() => setSelectedRider(null)} className="btn btn-circle btn-sm btn-ghost text-white hover:bg-white/20">
                                <FaTimes />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                            
                            {/* Column 1: Personal Info */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-slate-400 uppercase border-b pb-2 mb-3">Personal Information</h4>
                                <InfoRow label="Full Name" value={selectedRider.name} />
                                <InfoRow label="Email" value={selectedRider.email} />
                                <InfoRow label="Phone" value={selectedRider.mobile} />
                                <InfoRow label="NID Number" value={selectedRider.nid} />
                                <InfoRow label="Region" value={selectedRider.region} />
                                <InfoRow label="City/District" value={selectedRider.city} />
                            </div>

                            {/* Column 2: Vehicle & Meta Info */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-slate-400 uppercase border-b pb-2 mb-3">Vehicle Details</h4>
                                <InfoRow label="Vehicle Type" value={selectedRider.vehicleType || "Bike"} />
                                <InfoRow label="Registration No." value={selectedRider.bikeRegistrationNumber} />
                                
                                <div className="mt-6 pt-4 border-t border-dashed">
                                    <InfoRow label="Applied On" value={new Date(selectedRider.createTime).toLocaleString()} />
                                    <InfoRow label="Status" value={<span className="badge badge-warning">Pending</span>} />
                                </div>
                            </div>

                        </div>

                        {/* Modal Actions */}
                        <div className="bg-gray-50 p-4 flex justify-end gap-3 border-t">
                            <button
                                onClick={() => {
                                    handleDecision(selectedRider._id, "reject", selectedRider.email);
                                    setSelectedRider(null);
                                }}
                                className="btn btn-error btn-outline btn-sm"
                            >
                                Reject
                            </button>
                            <button
                                onClick={() => {
                                    handleDecision(selectedRider._id, "approve", selectedRider.email);
                                    setSelectedRider(null);
                                }}
                                className="btn btn-success text-white btn-sm"
                            >
                                Approve Rider
                            </button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
};

// Helper Component for Modal Rows
const InfoRow = ({ label, value }) => (
    <div className="flex flex-col">
        <span className="text-xs text-slate-400 font-semibold">{label}</span>
        <span className="text-slate-800 font-medium">{value || "N/A"}</span>
    </div>
);

export default Pending_Riders;