import React, { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { FaIdCard, FaCarAlt, FaFileAlt, FaReceipt, FaMotorcycle, FaBoxOpen, FaUtensils } from "react-icons/fa";
import { useLoaderData, useNavigate } from "react-router"; 
import Swal from "sweetalert2";
import { AuthContext } from "../../../Context/AuthContext";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";

const RiderForm = () => {
    useEffect(() => {
        document.title = "Apply as Rider | PickOn";
    }, []);

    const warehouseData = useLoaderData(); 
    const { user } = useContext(AuthContext);
    const axiosSecure = UseAxiosSecure();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        resetField
    } = useForm({
        mode: "onChange", // Validates fields live
        defaultValues: {
            vehicleType: "Bike",
            name: user?.displayName || "",
            email: user?.email || ""
        }
    });

    // --- WATCHERS ---
    const selectedRegion = watch("region");
    const selectedVehicle = watch("vehicleType");

    // --- DYNAMIC DATA ---
    const availableCities = selectedRegion 
        ? warehouseData
            .filter(item => item.region === selectedRegion)
            .map(item => item.city)
        : [];
    
    const uniqueCities = [...new Set(availableCities)];

    // 1. Reset City when Region changes
    useEffect(() => {
        // Only reset if the current city value is not in the new list (to prevent loops)
        resetField("city");
    }, [selectedRegion, resetField]);

    // 2. Handle Cycle N/A Logic
    useEffect(() => {
        if (selectedVehicle === "Cycle") {
            setValue("bikeRegistrationNumber", "N/A");
        } else {
            setValue("bikeRegistrationNumber", ""); // Clear it for Bike/Scooter
        }
    }, [selectedVehicle, setValue]);


    const onSubmit = async (formData) => {
        console.log("Form Data Submitted:", formData); // Debugging

        // 3. Safety: Ensure Cycle always sends "N/A"
        const finalRegNumber = formData.vehicleType === "Cycle" ? "N/A" : formData.bikeRegistrationNumber;

        const riderInformation = {
            ...formData,
            bikeRegistrationNumber: finalRegNumber,
            createTime: new Date().toISOString(),
            status: "pending",
        };

        try {
            const response = await axiosSecure.post('/riders', riderInformation);
            
            if (response.data.insertedId) {
                Swal.fire({
                    title: "Application Received!",
                    text: "We will review your details and contact you shortly.",
                    icon: "success",
                    confirmButtonColor: "#2563EB"
                }).then(() => {
                    navigate("/");
                });
            }
        } catch (error) {
            console.error("Submission Error:", error);
            // Show specific server error if available
            const msg = error.response?.data?.message || "Please ensure all fields (Region, City, Vehicle Info) are filled correctly.";
            Swal.fire("Validation Error", msg, "error");
        }
    };

    // Requirements Icons
    const requirements = [
        { icon: <FaIdCard />, title: "National ID", desc: "Original NID Copy" },
        { icon: <FaFileAlt />, title: "Driving License", desc: "Professional / Non-Pro" },
        { icon: <FaCarAlt />, title: "Registration Paper", desc: "Vehicle Blue Book" },
        { icon: <FaReceipt />, title: "Tax Token", desc: "Up-to-date Tax Token" }
    ];

    const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm bg-white";
    const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

    return (
        <div className="bg-slate-50 min-h-screen py-10 px-4 md:px-8 font-sans">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* FORM SECTION */}
                <div className="lg:col-span-7 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="border-b border-gray-100 pb-6 mb-6">
                        <h2 className="text-3xl font-bold text-slate-800">Rider Application</h2>
                        <p className="text-slate-500 mt-2">Start your journey with us.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        
                        {/* 1. Personal Info */}
                        <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                            <h3 className="text-blue-800 font-bold mb-4 flex items-center gap-2">
                                <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span> 
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Full Name</label>
                                    <input type="text" {...register("name")}  className={`${inputClass} bg-gray-100 text-gray-500 cursor-not-allowed`} />
                                </div>
                                <div>
                                    <label className={labelClass}>Email Address</label>
                                    <input type="text" {...register("email")} readOnly className={`${inputClass} bg-gray-100 text-gray-500 cursor-not-allowed`} />
                                </div>
                                <div>
                                    <label className={labelClass}>Mobile Number <span className="text-red-500">*</span></label>
                                    <input type="text" {...register("mobile", { required: true, pattern: /^01[3-9]\d{8}$/ })} placeholder="01XXXXXXXXX" className={inputClass} />
                                    {errors.mobile && <p className="text-red-500 text-xs mt-1">Valid BD number required</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>NID Number <span className="text-red-500">*</span></label>
                                    <input type="number" {...register("nid", { required: true })} placeholder="National ID Number" className={inputClass} />
                                    {errors.nid && <p className="text-red-500 text-xs mt-1">NID is required</p>}
                                </div>
                            </div>
                        </div>

                        {/* 2. Vehicle Info */}
                        <div className="bg-orange-50/50 p-5 rounded-xl border border-orange-100">
                            <h3 className="text-orange-800 font-bold mb-4 flex items-center gap-2">
                                <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span> 
                                Vehicle Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Vehicle Type <span className="text-red-500">*</span></label>
                                    <select 
                                        {...register("vehicleType", { required: true })} 
                                        className={inputClass}
                                    >
                                        <option value="Bike">Motorcycle</option>
                                        <option value="Scooter">Scooter</option>
                                        <option value="Cycle">Bicycle (No License)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Registration Number <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" 
                                        {...register("bikeRegistrationNumber", { 
                                            // Validation rule: Required only if NOT Cycle
                                            required: selectedVehicle !== "Cycle" 
                                        })} 
                                        placeholder={selectedVehicle === "Cycle" ? "N/A" : "DHAKA METRO-HA-XX-XXXX"}
                                        readOnly={selectedVehicle === "Cycle"} 
                                        className={`${inputClass} ${selectedVehicle === "Cycle" ? "bg-gray-100 cursor-not-allowed" : ""}`}
                                    />
                                    {errors.bikeRegistrationNumber && <p className="text-red-500 text-xs mt-1">Registration number is required</p>}
                                </div>
                            </div>
                        </div>

                        {/* 3. Location Info */}
                        <div className="bg-green-50/50 p-5 rounded-xl border border-green-100">
                            <h3 className="text-green-800 font-bold mb-4 flex items-center gap-2">
                                <span className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span> 
                                Preferred Area
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Region <span className="text-red-500">*</span></label>
                                    <select 
                                        {...register("region", { required: true })} 
                                        className={inputClass}
                                    >
                                        <option value="">Select Region</option>
                                        {Array.isArray(warehouseData) && [...new Set(warehouseData.map(item => item.region))].map((region, idx) => (
                                            <option key={idx} value={region}>{region}</option>
                                        ))}
                                    </select>
                                    {errors.region && <p className="text-red-500 text-xs mt-1">Region is required</p>}
                                </div>
                                
                                <div>
                                    <label className={labelClass}>City/Zone <span className="text-red-500">*</span></label>
                                    <select 
                                        {...register("city", { required: true })} 
                                        className={inputClass}
                                        disabled={!selectedRegion}
                                    >
                                        <option value="">Select Zone</option>
                                        {uniqueCities.map((city, idx) => (
                                            <option key={idx} value={city}>{city}</option>
                                        ))}
                                    </select>
                                    {errors.city && <p className="text-red-500 text-xs mt-1">City is required</p>}
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
                        >
                            Submit Application
                        </button>
                    </form>
                </div>

                {/* INFO PANEL */}
                <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24 hidden md:block">
                    <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                        <h2 className="text-2xl font-bold mb-4">Why Join Us?</h2>
                        <ul className="space-y-3 text-slate-300 mb-6">
                            <li className="flex items-center gap-2"><FaMotorcycle className="text-[#CAEB66]" /> Weekly Payouts</li>
                            <li className="flex items-center gap-2"><FaBoxOpen className="text-[#CAEB66]" /> Flexible Schedule</li>
                            <li className="flex items-center gap-2"><FaUtensils className="text-[#CAEB66]" /> Performance Bonus</li>
                        </ul>
                    </div>
                    
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-slate-800 mb-4">What You Need</h3>
                        <div className="grid grid-cols-1 gap-4">
                            {requirements.map((req, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="text-xl text-blue-600">{req.icon}</div>
                                    <div>
                                        <h4 className="font-bold text-xs text-slate-700">{req.title}</h4>
                                        <p className="text-[10px] text-slate-500">{req.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiderForm;