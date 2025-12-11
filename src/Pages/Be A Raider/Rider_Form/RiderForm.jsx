import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaIdCard, FaCarAlt, FaFileAlt, FaReceipt, FaMotorcycle, FaBoxOpen, FaUtensils } from "react-icons/fa";
import { useLoaderData, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Context/AuthContext";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import { useContext } from "react"; // Standard hook

const RiderForm = () => {
    useEffect(() => {
        document.title = "Apply as Rider | PickOn";
    }, []);

    const data = useLoaderData();
    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const { user } = useContext(AuthContext); // Standard useContext
    const axiosSecure = UseAxiosSecure();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm();

    const onSubmit = async (formData) => {
        const riderInformation = {
            ...formData,
            createTime: new Date().toISOString(),
            status: "pending",
        };

        try {
            const response = await axiosSecure.post('/riders', riderInformation);
            if (response.data.insertedId) {
                Swal.fire({
                    title: "Application Submitted!",
                    text: "We have received your application. Our team will contact you soon.",
                    icon: "success",
                    confirmButtonText: "Return to Home",
                    confirmButtonColor: "#2563EB"
                }).then(() => {
                    navigate("/");
                });
            }
        } catch (error) {
            Swal.fire("Error", "Something went wrong. Please try again.", "error");
        }
    };

    const requirements = [
        { icon: <FaIdCard />, title: "National ID", desc: "Original NID Copy" },
        { icon: <FaFileAlt />, title: "Driving License", desc: "Professional / Non-Pro" },
        { icon: <FaCarAlt />, title: "Registration Paper", desc: "Vehicle Blue Book" },
        { icon: <FaReceipt />, title: "Tax Token", desc: "Up-to-date Tax Token" }
    ];

    // Input Style Class
    const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm";
    const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

    return (
        <div className="bg-slate-50 min-h-screen py-10 px-4 md:px-8 font-sans">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* LEFT: Application Form */}
                <div className="lg:col-span-7 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="border-b border-gray-100 pb-6 mb-6">
                        <h2 className="text-3xl font-bold text-slate-800">Rider Application</h2>
                        <p className="text-slate-500 mt-2">Fill in your details to join our elite delivery team.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        
                        {/* Section: Personal Info */}
                        <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                            <h3 className="text-blue-800 font-bold mb-4 flex items-center gap-2">
                                <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span> 
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Full Name</label>
                                    <input type="text" {...register("name")} defaultValue={user?.displayName || ""} readOnly className={`${inputClass} bg-gray-100 cursor-not-allowed text-gray-500`} />
                                </div>
                                <div>
                                    <label className={labelClass}>Email Address</label>
                                    <input type="text" {...register("email")} defaultValue={user?.email || ""} readOnly className={`${inputClass} bg-gray-100 cursor-not-allowed text-gray-500`} />
                                </div>
                                <div>
                                    <label className={labelClass}>Mobile Number <span className="text-red-500">*</span></label>
                                    <input type="text" {...register("mobile", { required: true, pattern: /^01[3-9]\d{8}$/ })} placeholder="01XXXXXXXXX" className={inputClass} />
                                    {errors.mobile && <p className="text-red-500 text-xs mt-1">Valid BD number required</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>NID Number <span className="text-red-500">*</span></label>
                                    <input type="number" {...register("nid", { required: true })} placeholder="National ID Number" className={inputClass} />
                                </div>
                            </div>
                        </div>

                        {/* Section: Vehicle Info */}
                        <div className="bg-orange-50/50 p-5 rounded-xl border border-orange-100">
                            <h3 className="text-orange-800 font-bold mb-4 flex items-center gap-2">
                                <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span> 
                                Vehicle Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Vehicle Type <span className="text-red-500">*</span></label>
                                    <select {...register("vehicleType", { required: true })} className={inputClass}>
                                        <option value="Bike">Motorcycle</option>
                                        <option value="Scooter">Scooter</option>
                                        <option value="Cycle">Bicycle</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Registration Number <span className="text-red-500">*</span></label>
                                    <input type="text" {...register("bikeRegistrationNumber", { required: true })} placeholder="DHAKA METRO-HA-XX-XXXX" className={inputClass} />
                                </div>
                            </div>
                        </div>

                        {/* Section: Location */}
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
                                        onChange={e => {
                                            setSelectedRegion(e.target.value);
                                            setValue("region", e.target.value);
                                            setSelectedCity("");
                                            setValue("city", "");
                                        }}
                                    >
                                        <option value="">Select Region</option>
                                        {Array.isArray(data) && [...new Set(data.map(item => item.region))].map((region, idx) => (
                                            <option key={idx} value={region}>{region}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>City/Zone <span className="text-red-500">*</span></label>
                                    <select 
                                        {...register("city", { required: true })} 
                                        className={inputClass}
                                        value={selectedCity}
                                        onChange={e => {
                                            setSelectedCity(e.target.value);
                                            setValue("city", e.target.value);
                                        }}
                                        disabled={!selectedRegion}
                                    >
                                        <option value="">Select Zone</option>
                                        {Array.isArray(data) && data
                                            .filter(item => item.region === selectedRegion)
                                            .map((item, idx) => (
                                                <option key={idx} value={item.city}>{item.city}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95">
                                Submit Application
                            </button>
                            <p className="text-center text-xs text-gray-400 mt-4">
                                By clicking submit, you agree to our Terms & Conditions and Privacy Policy.
                            </p>
                        </div>
                    </form>
                </div>

                {/* RIGHT: Sticky Info Panel */}
                <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
                    
                    {/* Hero Card */}
                    <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                        <h2 className="text-2xl font-bold mb-4">Why Join Us?</h2>
                        <ul className="space-y-3 text-slate-300 mb-6">
                            <li className="flex items-center gap-2"><FaMotorcycle className="text-[#CAEB66]" /> Earn up to 50k BDT/month</li>
                            <li className="flex items-center gap-2"><FaBoxOpen className="text-[#CAEB66]" /> Flexible Delivery Slots</li>
                            <li className="flex items-center gap-2"><FaUtensils className="text-[#CAEB66]" /> Food & Parcel Delivery</li>
                        </ul>
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                            <p className="text-sm font-medium">🎉 Special Offer</p>
                            <p className="text-xs text-slate-400 mt-1">Get 0% commission for the first month if you join today!</p>
                        </div>
                    </div>

                    {/* Requirements Grid */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-slate-800 mb-4">Required Documents</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {requirements.map((req, i) => (
                                <div key={i} className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
                                    <div className="text-2xl text-blue-600 mb-2">{req.icon}</div>
                                    <h4 className="font-bold text-sm text-slate-700">{req.title}</h4>
                                    <p className="text-xs text-slate-500">{req.desc}</p>
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