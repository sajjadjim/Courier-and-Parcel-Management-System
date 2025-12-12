import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaSearch, FaUserCheck, FaFilter, FaMotorcycle, FaMapMarkerAlt, FaUserTie, FaBan } from "react-icons/fa";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";

const Deactive_riders = () => {
  const axiosSecure = UseAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");

  // 1. FETCH & FILTER DATA
  const { data: deactivatedRiders = [], isLoading, refetch } = useQuery({
    queryKey: ["deactivatedRiders"],
    queryFn: async () => {
      // Fetch all riders and filter for 'deactivated' status on the client side
      // This ensures it works even if you don't have a specific '/riders/deactivated' endpoint
      const res = await axiosSecure.get("/riders");
      return res.data.filter(rider => rider.status === 'deactivated');
    },
  });

  // 2. EXTRACT UNIQUE REGIONS
  const regions = useMemo(() => {
    const allRegions = deactivatedRiders.map(r => r.region).filter(Boolean);
    return ["All", ...new Set(allRegions)];
  }, [deactivatedRiders]);

  // 3. SEARCH & REGION FILTER LOGIC
  const displayedRiders = useMemo(() => {
    return deactivatedRiders.filter((rider) => {
      const matchesSearch = 
        rider.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        rider.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRegion = selectedRegion === "All" || rider.region === selectedRegion;

      return matchesSearch && matchesRegion;
    });
  }, [deactivatedRiders, searchTerm, selectedRegion]);

  // 4. ACTIVATE HANDLER
  const handleActivate = async (id, name) => {
    const confirm = await Swal.fire({
      title: "Activate Rider?",
      text: `Are you sure you want to reactivate ${name}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981", // Green
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Activate",
    });

    if (!confirm.isConfirmed) return;

    try {
      // Update status to 'active' in database
      const res = await axiosSecure.patch(`/riders/${id}/status`, { status: "active" });
      
      if(res.data.modifiedCount > 0){
          refetch(); // Refresh the list
          Swal.fire({
            title: "Success!",
            text: `${name} is now Active.`,
            icon: "success",
            timer: 2000,
            showConfirmButton: false
          });
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to activate rider", "error");
    }
  };

  // SKELETON LOADER
  if (isLoading) return (
    <div className="p-8 space-y-4">
        <div className="flex justify-between">
            <div className="h-10 w-1/3 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-1/4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 w-full bg-gray-100 rounded-xl animate-pulse"></div>
            ))}
        </div>
    </div>
  );

  return (
    <div className="p-6 md:p-10 bg-slate-50 min-h-screen font-sans">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <FaBan className="text-red-500" /> Deactivated Riders 
            <span className="badge badge-error text-white badge-lg">{displayedRiders.length}</span>
          </h2>
          <p className="text-slate-500 mt-1">Manage suspended or inactive rider accounts.</p>
        </div>

        {/* --- TOOLBAR --- */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search Name or Email..."
              className="pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3.5 top-3.5 text-gray-400" />
          </div>

          {/* Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="pl-10 pr-8 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-red-500 bg-white cursor-pointer appearance-none w-full sm:w-48 font-medium text-slate-700"
            >
              {regions.map((region, idx) => (
                <option key={idx} value={region}>
                  {region === "All" ? "All Regions" : region}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {displayedRiders.length === 0 ? (
             <div className="text-center py-20">
                <div className="flex flex-col items-center text-slate-400">
                    <FaUserCheck className="text-5xl mb-3 text-slate-200" />
                    <p className="font-medium text-lg">No Deactivated Riders Found</p>
                    <p className="text-sm">Everyone is active or no data matches your filter.</p>
                </div>
            </div>
        ) : (
            <div className="overflow-x-auto">
            <table className="table w-full">
                <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider border-b border-gray-100">
                <tr>
                    <th className="py-4 pl-6">Rider Profile</th>
                    <th>Location</th>
                    <th>Vehicle Info</th>
                    <th>Current Status</th>
                    <th className="text-right pr-6">Action</th>
                </tr>
                </thead>
                
                <tbody className="divide-y divide-gray-100">
                {displayedRiders.map((rider) => (
                    <tr key={rider._id} className="hover:bg-red-50/10 transition-colors group">
                    
                    {/* Profile */}
                    <td className="pl-6 py-4">
                        <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                            <div className="bg-red-50 text-red-500 rounded-full w-10 h-10 flex items-center justify-center border border-red-100">
                            {rider.image ? (
                                <img src={rider.image} alt="avatar" className="rounded-full" />
                            ) : (
                                <FaUserTie className="text-xl" />
                            )}
                            </div>
                        </div>
                        <div>
                            <div className="font-bold text-slate-800">{rider.name}</div>
                            <div className="text-xs text-slate-500">{rider.email}</div>
                        </div>
                        </div>
                    </td>

                    {/* Location */}
                    <td>
                        <div className="flex items-start gap-2">
                            <FaMapMarkerAlt className="text-slate-400 mt-1" />
                            <div>
                            <div className="font-semibold text-slate-700">{rider.region}</div>
                            <div className="text-xs text-slate-500">{rider.city}</div>
                            </div>
                        </div>
                    </td>

                    {/* Vehicle */}
                    <td>
                        <div className="flex items-center gap-2">
                        <FaMotorcycle className="text-slate-400" />
                        <div>
                            <span className="text-sm font-medium text-slate-700 block">{rider.vehicleType}</span>
                            <span className="text-xs text-slate-400 font-mono">{rider.bikeRegistrationNumber}</span>
                        </div>
                        </div>
                    </td>

                    {/* Status */}
                    <td>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                            Deactivated
                        </span>
                    </td>

                    {/* Action Button */}
                    <td className="text-right pr-6">
                        <button
                        onClick={() => handleActivate(rider._id, rider.name)}
                        className="btn btn-sm btn-success text-white gap-2 shadow-sm shadow-green-200 hover:shadow-md transition-all"
                        >
                        <FaUserCheck /> Activate
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
      </div>
    </div>
  );
};

export default Deactive_riders;