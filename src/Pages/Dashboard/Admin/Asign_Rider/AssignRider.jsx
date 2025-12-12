import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaMotorcycle, FaArrowRight, FaCalendarAlt, FaUserTie, FaSearch, FaTimes, FaMapMarkerAlt, FaBox } from "react-icons/fa";
import { use, useState, useMemo } from "react";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../../../Hooks/UseAxiosSecure";
import useTrackingLogger from "../../../../Hooks/useTrackingLogger";
import { AuthContext } from "../../../../Context/AuthContext";

const AssignRider = () => {
    const axiosSecure = UseAxiosSecure();
    const [selectedParcel, setSelectedParcel] = useState(null);
    const [riders, setRiders] = useState([]);
    const [loadingRiders, setLoadingRiders] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchLocation, setSearchLocation] = useState(""); 
    
    const queryClient = useQueryClient();
    const { logTracking } = useTrackingLogger();
    const { user } = use(AuthContext);

    // 1. Fetch Parcels (Paid & Pending)
    const { data: parcels = [], isLoading } = useQuery({
        queryKey: ["assignableParcels"],
        queryFn: async () => {
            // ✅ FIX: Changed 'not_collected' to 'pending' to match your AddParcel logic
            const res = await axiosSecure.get(
                "/parcels?payment_status=paid&delivery_status=pending"
            );
            return res.data.sort(
                (a, b) => new Date(a.creation_date) - new Date(b.creation_date)
            );
        },
    });

    // 2. Filter Logic for Search Bar
    const filteredParcels = useMemo(() => {
        return parcels.filter(p => 
            p.trackingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.senderWarehouse?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [parcels, searchTerm]);

    // 3. Assign Rider Mutation
    const { mutateAsync: assignRider, isPending: isAssigning } = useMutation({
        mutationFn: async ({ parcelId, rider }) => {
            const res = await axiosSecure.patch(`/parcels/${parcelId}/assign`, {
                riderId: rider._id,
                riderName: rider.name,
                riderEmail: rider.email,
            });
            return { res, rider };
        },
        onSuccess: async ({ rider }) => {
            queryClient.invalidateQueries(["assignableParcels"]);
            
            await logTracking({
                trackingId: selectedParcel.trackingId,
                status: "rider_assigned",
                details: `Rider Assigned: ${rider.name} (${rider.mobile})`,
                updated_by: user.email,
            });

            Swal.fire({
                title: "Assigned!",
                text: `Rider ${rider.name} is now active for this delivery.`,
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

    // 4. OPEN MODAL & STRICTLY FILTER RIDERS BY CITY/REGION
    const openAssignModal = async (parcel) => {
        setSelectedParcel(parcel);
        setLoadingRiders(true);
        setRiders([]);

        // Determine the target location
        const targetRegion = parcel.senderRegion || parcel.senderCity || parcel.senderWarehouse;
        setSearchLocation(targetRegion);

        try {
            const res = await axiosSecure.get("/riders/active"); 

            // Strict Client-Side Filter
            const matchedRiders = res.data.filter(rider => {
                if (rider.status !== 'active') return false;

                const riderCity = (rider.city || "").toLowerCase().trim();
                const parcelLocation = (targetRegion || "").toLowerCase().trim();

                // Relaxed matching (includes instead of exact match to prevent typos issues)
                return riderCity.includes(parcelLocation) || parcelLocation.includes(riderCity);
            });
            
            setRiders(matchedRiders);

        } catch (error) {
            console.error("Error loading riders", error);
            Swal.fire("Error", "Failed to load available riders", "error");
        } finally {
            setLoadingRiders(false);
            document.getElementById("assignModal").showModal();
        }
    };

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
                    <p className="text-slate-500 mt-1">Match paid parcels with active riders in the same region.</p>
                </div>

                <div className="relative w-full md:w-72">
                    <input 
                        type="text" 
                        placeholder="Search Tracking ID..." 
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none transition-all"
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
                        <h3 className="text-xl font-bold text-slate-700">No Pending Parcels</h3>
                        <p className="text-slate-400">All paid parcels have been assigned or none exist.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider border-b border-gray-100">
                                <tr>
                                    <th className="py-5 pl-6">Parcel Info</th>
                                    <th>Route (From → To)</th>
                                    <th>Cost & Date</th>
                                    <th className="text-right pr-6">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredParcels.map((parcel) => (
                                    <tr key={parcel._id} className="hover:bg-blue-50/30 transition-colors group">
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
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="text-slate-600 font-medium">
                                                    <span className="text-xs text-slate-400 block uppercase">Sender</span>
                                                    {parcel.senderRegion || parcel.senderCity}
                                                </div>
                                                <FaArrowRight className="text-slate-300 mx-2" />
                                                <div className="text-slate-600 font-medium">
                                                    <span className="text-xs text-slate-400 block uppercase">Receiver</span>
                                                    {parcel.receiverRegion || parcel.receiverCity}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {/* ✅ FIX: Use 'amount' instead of 'charge' */}
                                            <div className="font-bold text-slate-800">৳ {parcel.deliveryCharge?.amount || 0}</div>
                                            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                                                <FaCalendarAlt />
                                                {new Date(parcel.date).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="text-right pr-6">
                                            <button
                                                onClick={() => openAssignModal(parcel)}
                                                className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white border-none shadow-md shadow-blue-200 gap-2"
                                            >
                                                Select Rider <FaMotorcycle />
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
                                Available Active Riders
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-slate-300 mt-1">
                                <FaMapMarkerAlt className="text-red-400" /> 
                                Matching City: <span className="text-white font-bold underline bg-white/10 px-2 py-0.5 rounded">{searchLocation}</span>
                            </div>
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
                            <div className="text-center py-12 flex flex-col items-center justify-center">
                                <div className="bg-red-50 p-4 rounded-full mb-3">
                                    <FaMotorcycle className="text-4xl text-red-300" />
                                </div>
                                <p className="text-red-500 font-bold text-lg">No Active Riders Found</p>
                                <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
                                    We couldn't find any active riders in <b>"{searchLocation}"</b>. 
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {riders.map((rider) => (
                                    <div 
                                        key={rider._id} 
                                        className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-blue-300 transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                                                {rider.image ? (
                                                    <img src={rider.image} alt="" className="w-full h-full rounded-full object-cover"/>
                                                ) : <FaUserTie />}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                                    {rider.name}
                                                    <span className="badge badge-xs badge-success text-white">Active</span>
                                                </h4>
                                                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                                    <span className="flex items-center gap-1"><FaMotorcycle className="text-slate-400"/> {rider.vehicleType}</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                    <span className="font-medium text-blue-600">{rider.city}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <button
                                            onClick={() => assignRider({ parcelId: selectedParcel._id, rider })}
                                            disabled={isAssigning}
                                            className="btn btn-sm btn-success text-white rounded-lg px-6 shadow-sm hover:shadow-md"
                                        >
                                            {isAssigning ? 'Assigning...' : 'Assign'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </dialog>

        </div>
    );
};

export default AssignRider;