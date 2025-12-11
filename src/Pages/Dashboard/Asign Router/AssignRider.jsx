import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaMotorcycle, FaMapMarkerAlt, FaBox, FaArrowRight, FaCalendarAlt, FaUserTie, FaSearch, FaTimes } from "react-icons/fa";
import { use, useState, useMemo } from "react";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import useTrackingLogger from "../../../Hooks/useTrackingLogger";
import { AuthContext } from "../../../Context/AuthContext";

const AssignRider = () => {
    const axiosSecure = UseAxiosSecure();
    const [selectedParcel, setSelectedParcel] = useState(null);
    const [riders, setRiders] = useState([]);
    const [loadingRiders, setLoadingRiders] = useState(false);
    const [searchTerm, setSearchTerm] = useState(""); // For filtering parcels
    
    const queryClient = useQueryClient();
    const { logTracking } = useTrackingLogger();
    const { user } = use(AuthContext);

    // Fetch Parcels
    const { data: parcels = [], isLoading } = useQuery({
        queryKey: ["assignableParcels"],
        queryFn: async () => {
            const res = await axiosSecure.get(
                "/parcels?payment_status=paid&delivery_status=not_collected"
            );
            return res.data.sort(
                (a, b) => new Date(a.creation_date) - new Date(b.creation_date)
            );
        },
    });

    // Filter Logic for Search Bar
    const filteredParcels = useMemo(() => {
        return parcels.filter(p => 
            p.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.senderWarehouse.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [parcels, searchTerm]);

    // Mutation
    const { mutateAsync: assignRider, isPending: isAssigning } = useMutation({
        mutationFn: async ({ parcelId, rider }) => {
            const res = await axiosSecure.patch(`/parcels/${parcelId}/assign`, {
                riderId: rider._id,
                riderName: rider.name,
                riderEmail: rider.email,
            });
            return { res, rider }; // Return rider to use in onSuccess
        },
        onSuccess: async ({ rider }) => {
            queryClient.invalidateQueries(["assignableParcels"]);
            
            // Log Tracking
            await logTracking({
                trackingId: selectedParcel.trackingId,
                status: "rider_assigned",
                details: `Rider Assigned: ${rider.name} (${rider.mobile})`,
                updated_by: user.email,
            });

            Swal.fire({
                title: "Assigned!",
                text: `Rider ${rider.name} has been assigned successfully.`,
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });

            document.getElementById("assignModal").close();
        },
        onError: () => {
            Swal.fire("Error", "Failed to assign rider", "error");
        },
    });

    // Open Modal
    const openAssignModal = async (parcel) => {
        setSelectedParcel(parcel);
        setLoadingRiders(true);
        setRiders([]);

        try {
            const res = await axiosSecure.get("/riders/available", {
                params: { city: parcel.senderAddress }, // Keep logic: Sender City -> Rider City
            });
            setRiders(res.data);
        } catch (error) {
            console.error("Error", error);
            Swal.fire("Error", "Failed to load riders", "error");
        } finally {
            setLoadingRiders(false);
            document.getElementById("assignModal").showModal();
        }
    };

    // Skeleton Loader Component
    if (isLoading) {
        return (
            <div className="p-8 space-y-4">
                <div className="h-10 w-1/4 bg-gray-200 rounded animate-pulse mb-6"></div>
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-20 w-full bg-gray-100 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 bg-slate-50 min-h-screen font-sans">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
                        <FaMotorcycle className="text-blue-600" /> Assign Riders
                    </h2>
                    <p className="text-slate-500 mt-1">Manage pending deliveries and assign logistics partners.</p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-72">
                    <input 
                        type="text" 
                        placeholder="Search Tracking ID or Region..." 
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="absolute left-3.5 top-3.5 text-gray-400" />
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {filteredParcels.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500 text-3xl">
                            <FaBox />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700">No Parcels Found</h3>
                        <p className="text-slate-400">There are no paid parcels waiting for collection.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            {/* Head */}
                            <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider border-b border-gray-100">
                                <tr>
                                    <th className="py-5 pl-6">Parcel Info</th>
                                    <th>Route Details</th>
                                    <th>Cost & Date</th>
                                    <th className="text-right pr-6">Action</th>
                                </tr>
                            </thead>
                            {/* Body */}
                            <tbody className="divide-y divide-gray-100">
                                {filteredParcels.map((parcel) => (
                                    <tr key={parcel._id} className="hover:bg-blue-50/30 transition-colors group">
                                        
                                        {/* Col 1: Parcel Info */}
                                        <td className="pl-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg">
                                                    <FaBox />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800">{parcel.parcelName}</div>
                                                    <div className="text-xs text-slate-500 font-mono bg-gray-100 px-1.5 py-0.5 rounded inline-block mt-1">
                                                        {parcel.trackingId}
                                                    </div>
                                                    <div className="text-xs text-slate-400 mt-0.5">{parcel.parcelType}</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Col 2: Route */}
                                        <td>
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="text-slate-600 font-medium">
                                                    <span className="text-xs text-slate-400 block uppercase">From</span>
                                                    {parcel.senderWarehouse}
                                                </div>
                                                <FaArrowRight className="text-slate-300 mx-2" />
                                                <div className="text-slate-600 font-medium">
                                                    <span className="text-xs text-slate-400 block uppercase">To</span>
                                                    {parcel.receiverWarehouse}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Col 3: Cost & Date */}
                                        <td>
                                            <div className="font-bold text-slate-800">৳ {parcel.deliveryCharge.charge}</div>
                                            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                                                <FaCalendarAlt />
                                                {new Date(parcel.date).toLocaleDateString()}
                                            </div>
                                        </td>

                                        {/* Col 4: Action */}
                                        <td className="text-right pr-6">
                                            <button
                                                onClick={() => openAssignModal(parcel)}
                                                className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white border-none shadow-md shadow-blue-200 gap-2"
                                            >
                                                Assign Rider <FaMotorcycle />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* --- ASSIGN MODAL --- */}
            <dialog id="assignModal" className="modal backdrop-blur-sm">
                <div className="modal-box max-w-2xl p-0 rounded-2xl overflow-hidden">
                    
                    {/* Modal Header */}
                    <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                Select Rider
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                                For Parcel: <span className="text-white font-mono">{selectedParcel?.trackingId}</span>
                            </p>
                        </div>
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost text-white hover:bg-white/20">
                                <FaTimes />
                            </button>
                        </form>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6 max-h-[400px] overflow-y-auto bg-slate-50">
                        {loadingRiders ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-200 rounded-xl animate-pulse"></div>)}
                            </div>
                        ) : riders.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-red-500 font-bold">No riders available nearby.</p>
                                <p className="text-sm text-slate-400">Try looking for riders in a neighboring region.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {riders.map((rider) => (
                                    <div 
                                        key={rider._id} 
                                        className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-blue-300 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                                <FaUserTie />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm">{rider.name}</h4>
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <span>{rider.mobile}</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                    <span>{rider.vehicleType}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <button
                                            onClick={() => assignRider({ parcelId: selectedParcel._id, rider })}
                                            disabled={isAssigning}
                                            className="btn btn-sm btn-success text-white rounded-lg px-4"
                                        >
                                            {isAssigning ? 'Assigning...' : 'Assign'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Modal Footer */}
                    <div className="bg-white p-4 border-t text-right">
                         <form method="dialog">
                            <button className="btn btn-sm btn-ghost text-slate-500">Cancel</button>
                        </form>
                    </div>
                </div>
            </dialog>

        </div>
    );
};

export default AssignRider;