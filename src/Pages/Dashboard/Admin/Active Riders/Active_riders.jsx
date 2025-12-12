import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaSearch, FaUserSlash, FaFilter, FaMotorcycle, FaMapMarkerAlt, FaUserTie } from "react-icons/fa";
import UseAxiosSecure from "../../../../Hooks/UseAxiosSecure";

const Active_riders = () => {
  const axiosSecure = UseAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");

  // 1. FETCH DATA
  const { data: riders = [], isLoading, refetch, isError } = useQuery({
    queryKey: ["activeRiders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/active");
      return res.data;
    },
  });

  // 2. EXTRACT UNIQUE REGIONS DYNAMICALLY
  const regions = useMemo(() => {
    const allRegions = riders.map(r => r.region).filter(Boolean); // Get all regions
    return ["All", ...new Set(allRegions)]; // Remove duplicates
  }, [riders]);

  // 3. FILTER LOGIC (Search + Region)
  const filteredRiders = useMemo(() => {
    return riders.filter((rider) => {
      const matchesSearch = 
        rider.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        rider.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRegion = selectedRegion === "All" || rider.region === selectedRegion;

      return matchesSearch && matchesRegion;
    });
  }, [riders, searchTerm, selectedRegion]);

  // 4. DEACTIVATE HANDLER
  const handleDeactivate = async (id, name) => {
    const confirm = await Swal.fire({
      title: "Deactivate Rider?",
      text: `Are you sure you want to remove ${name} from active duty?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Deactivate",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.patch(`/riders/${id}/status`, { status: "deactivated" });
      
      // Optimistic update or Refetch
      refetch();
      
      Swal.fire({
        title: "Deactivated!",
        text: `${name} has been moved to inactive list.`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to deactivate rider", "error");
    }
  };

  // SKELETON LOADER COMPONENT
  if (isLoading) return (
    <div className="p-8 space-y-4">
        <div className="flex justify-between">
            <div className="h-8 w-1/4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-1/4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="h-96 w-full bg-gray-100 rounded-xl animate-pulse"></div>
    </div>
  );

  return (
    <div className="p-6 md:p-10 bg-slate-50 min-h-screen font-sans">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            Active Riders <span className="badge badge-success text-white badge-md">{filteredRiders.length}</span>
          </h2>
          <p className="text-slate-500 mt-1">Manage and monitor your currently active logistics workforce.</p>
        </div>

        {/* --- TOOLBAR (Search & Filter) --- */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search Name or Email..."
              className="pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3.5 top-3.5 text-gray-400" />
          </div>

          {/* Region Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="pl-10 pr-8 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-blue-500 bg-white cursor-pointer appearance-none w-full sm:w-48 font-medium text-slate-700"
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
        <div className="overflow-x-auto">
          <table className="table w-full">
            {/* Table Head */}
            <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-4 pl-6">Rider Profile</th>
                <th>Assigned Location</th>
                <th>Vehicle Details</th>
                <th>Performance</th>
                <th className="text-right pr-6">Actions</th>
              </tr>
            </thead>
            
            {/* Table Body */}
            <tbody className="divide-y divide-gray-100">
              {filteredRiders.length > 0 ? (
                filteredRiders.map((rider) => (
                  <tr key={rider._id} className="hover:bg-blue-50/30 transition-colors group">
                    
                    {/* Col 1: Profile */}
                    <td className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-blue-100 text-blue-600 rounded-full w-10 h-10 flex items-center justify-center">
                            {rider.image ? (
                                <img src={rider.image} alt="avatar" />
                            ) : (
                                <FaUserTie className="text-xl" />
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{rider.name}</div>
                          <div className="text-xs text-slate-500">{rider.email}</div>
                          <div className="text-xs text-slate-400">{rider.phone || rider.mobile}</div>
                        </div>
                      </div>
                    </td>

                    {/* Col 2: Location (Region) */}
                    <td>
                      <div className="flex items-start gap-2">
                         <FaMapMarkerAlt className="text-slate-400 mt-1" />
                         <div>
                            <div className="font-semibold text-slate-700">{rider.region}</div>
                            <div className="text-xs text-slate-500 bg-gray-100 px-2 py-0.5 rounded-full inline-block mt-1">
                                {rider.city || "City N/A"}
                            </div>
                         </div>
                      </div>
                    </td>

                    {/* Col 3: Vehicle */}
                    <td>
                      <div className="flex items-center gap-2">
                        <FaMotorcycle className="text-slate-400" />
                        <div>
                            <div className="text-sm font-medium text-slate-700 capitalize">{rider.vehicleType || "Motorbike"}</div>
                            <div className="text-xs text-slate-400 font-mono">
                                {rider.bikeRegistrationNumber || "N/A"}
                            </div>
                        </div>
                      </div>
                    </td>

                    {/* Col 4: Status/Stats */}
                    <td>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Active
                        </span>
                    </td>

                    {/* Col 5: Actions */}
                    <td className="text-right pr-6">
                      <button
                        onClick={() => handleDeactivate(rider._id, rider.name)}
                        className="btn btn-sm btn-outline btn-error hover:text-white gap-2"
                      >
                        <FaUserSlash /> Deactivate
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-10">
                    <div className="flex flex-col items-center text-slate-400">
                        <FaMotorcycle className="text-4xl mb-3 opacity-20" />
                        <p className="font-medium">No riders found.</p>
                        <p className="text-sm">Try adjusting your search or filter.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Active_riders;