import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import Modal from "react-modal";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router"; 
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import { AuthContext } from "../../Context/AuthContext";
import useTrackingLogger from "../../Hooks/useTrackingLogger";

// Icons for professional look
import { FaBoxOpen, FaWeightHanging, FaMapMarkerAlt, FaTruck, FaInfoCircle, FaExclamationTriangle, FaFileAlt } from "react-icons/fa";
import { MdLocalShipping } from "react-icons/md";
import { ImSpinner9 } from "react-icons/im";

Modal.setAppElement("#root");

const generateTrackingID = () => {
    const date = new Date();
    const datePart = date.toISOString().split("T")[0].replace(/-/g, "");
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `PCL-${datePart}-${rand}`;
};

const Send_Parcel = () => {
    document.title = "Add Parcel | PickOnGo";

    const { user } = useContext(AuthContext);
    const axiosSecure = UseAxiosSecure();
    const { logTracking } = useTrackingLogger();
    const navigate = useNavigate();

    // --- 1. DATA FETCHING STATE ---
    const [warehouseData, setWarehouseData] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [fetchError, setFetchError] = useState(false);

    const { register, handleSubmit, watch, setValue } = useForm();

    // --- STATES FOR CASCADING DROPDOWNS ---
    const [senderRegion, setSenderRegion] = useState("");
    const [senderDistricts, setSenderDistricts] = useState([]);
    const [senderDistrict, setSenderDistrict] = useState("");
    const [senderAreas, setSenderAreas] = useState([]);

    const [receiverRegion, setReceiverRegion] = useState("");
    const [receiverDistricts, setReceiverDistricts] = useState([]);
    const [receiverDistrict, setReceiverDistrict] = useState("");
    const [receiverAreas, setReceiverAreas] = useState([]);

    const [modalOpen, setModalOpen] = useState(false);
    const [pendingData, setPendingData] = useState(null);
    const [calculatedCost, setCalculatedCost] = useState({ amount: 0, label: "Calculating..." });

    const parcelType = watch("parcelType", "document");
    const parcelWeight = watch("parcelWeight", 0);

    // --- 2. FETCH DATA FROM GITHUB ---
    useEffect(() => {
        fetch('https://raw.githubusercontent.com/sajjadjim/Courier-and-Parcel-Management-System/refs/heads/main/public/warehouses.json')
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch data");
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setWarehouseData(data);
                } else {
                    console.error("Data is not an array:", data);
                    setWarehouseData([]);
                }
                setIsLoadingData(false);
            })
            .catch(err => {
                console.error("Error fetching warehouse data:", err);
                setFetchError(true);
                setIsLoadingData(false);
            });
    }, []);

    // --- 3. GET UNIQUE REGIONS ---
    const uniqueRegions = warehouseData.length > 0 
        ? [...new Set(warehouseData.map(item => item?.region).filter(Boolean))].sort() 
        : [];

    // --- 4. SENDER LOGIC ---
    useEffect(() => {
        if (senderRegion && warehouseData.length > 0) {
            const districts = warehouseData
                .filter(item => item.region === senderRegion)
                .map(item => item.district);
            setSenderDistricts([...new Set(districts)].sort());
            setSenderDistrict(""); 
            setSenderAreas([]);    
            setValue("senderCity", ""); 
            setValue("senderWarehouse", ""); 
        }
    }, [senderRegion, warehouseData, setValue]);

    useEffect(() => {
        if (senderDistrict && warehouseData.length > 0) {
            const target = warehouseData.find(item => 
                item.region === senderRegion && item.district === senderDistrict
            );
            setSenderAreas(target ? target.covered_area.sort() : []);
            setValue("senderWarehouse", ""); 
        }
    }, [senderDistrict, senderRegion, warehouseData, setValue]);

    // --- 5. RECEIVER LOGIC ---
    useEffect(() => {
        if (receiverRegion && warehouseData.length > 0) {
            const districts = warehouseData
                .filter(item => item.region === receiverRegion)
                .map(item => item.district);
            setReceiverDistricts([...new Set(districts)].sort());
            setReceiverDistrict(""); 
            setReceiverAreas([]);
            setValue("receiverCity", ""); 
            setValue("receiverWarehouse", "");
        }
    }, [receiverRegion, warehouseData, setValue]);

    useEffect(() => {
        if (receiverDistrict && warehouseData.length > 0) {
            const target = warehouseData.find(item => 
                item.region === receiverRegion && item.district === receiverDistrict
            );
            setReceiverAreas(target ? target.covered_area.sort() : []);
            setValue("receiverWarehouse", "");
        }
    }, [receiverDistrict, receiverRegion, warehouseData, setValue]);

    // --- 6. COST CALCULATION ---
    useEffect(() => {
        const w = parseFloat(parcelWeight) || 0;
        const isSameZone = senderRegion && receiverRegion && (senderRegion === receiverRegion);

        let cost = 0;
        let label = "";

        if (parcelType === "document") {
            cost = isSameZone ? 60 : 100;
            label = isSameZone ? "Same Region (Document)" : "Inter-Region (Document)";
        } else {
            const baseRate = isSameZone ? 60 : 120;
            if (w <= 1) {
                cost = baseRate;
            } else {
                cost = baseRate + ((w - 1) * 50);
            }
            label = isSameZone ? "Same Region (Parcel)" : "Inter-Region (Parcel)";
        }
        setCalculatedCost({ amount: Math.round(cost), label });
    }, [parcelType, parcelWeight, senderRegion, receiverRegion]);

    // --- 7. SUBMIT ---
    const onSubmit = (data) => {
        setPendingData(data);
        setModalOpen(true);
    };

    const confirmSubmit = () => {
        const weight = parseFloat(pendingData.parcelWeight) || 0;
        const trackingId = generateTrackingID();

        const parcelData = {
            ...pendingData,
            email: user?.email,
            payment_status: 'unpaid',
            parcelWeight: weight,
            deliveryCharge: calculatedCost,
            trackingId: trackingId,
            date: new Date().toISOString().split("T")[0],
            delivery_status: 'pending',
            senderRegion: senderRegion,
            senderCity: senderDistrict, 
            receiverRegion: receiverRegion,
            receiverCity: receiverDistrict
        };

        axiosSecure.post('/parcels', parcelData)
            .then(async (res) => {
                if (res.data.insertedId) {
                    toast.success("🎉 Order Placed Successfully!");
                    await logTracking({
                        trackingId: parcelData.trackingId,
                        status: "parcel_created",
                        details: `Created by ${user?.displayName}`,
                        updated_by: user?.email,
                    });
                    setTimeout(() => navigate("/dashboard/myParcels"), 1500);
                }
            })
            .catch(err => {
                console.error(err);
                toast.error("❌ Failed to place order");
            });
        
        setModalOpen(false);
    };

    const inputClass = "w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm text-gray-700 bg-white";
    const labelClass = "block text-xs font-bold text-gray-500 uppercase mb-1";
    const sectionClass = "bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 relative overflow-hidden";

    // LOADING STATE
    if (isLoadingData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500">
                <ImSpinner9 className="animate-spin text-4xl text-blue-600 mb-4" />
                <p className="font-semibold">Loading Locations...</p>
            </div>
        );
    }

    // ERROR STATE
    if (fetchError || warehouseData.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500">
                <FaExclamationTriangle className="text-5xl text-orange-400 mb-4" />
                <h2 className="text-2xl font-bold text-slate-700">Service Unavailable</h2>
                <p className="text-sm mt-2">Could not load district data from server.</p>
                <button onClick={() => window.location.reload()} className="mt-6 btn btn-sm btn-outline">Retry</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 md:px-8 font-sans">
            <div className="max-w-7xl mx-auto mt-15">
                
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 flex items-center justify-center gap-3">
                        <MdLocalShipping className="text-blue-600" /> Book a Delivery
                    </h1>
                    <p className="text-slate-500 mt-2">Fast, secure, and reliable shipping across 64 districts.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    
                    {/* LEFT COLUMN: FORM INPUTS */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* 1. Parcel Details */}
                        <div className={sectionClass}>
                            <h3 className="text-lg font-bold text-slate-700 mb-5 border-b pb-3 flex gap-2 items-center">
                                <FaBoxOpen className="text-blue-500"/> Parcel Information
                            </h3>

                            <div className="mb-6">
                                <label className={labelClass}>Parcel Type</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <label className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${parcelType === "document" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 hover:border-blue-300"}`}>
                                        <input type="radio" value="document" {...register("parcelType")} className="hidden" />
                                        <FaFileAlt size={24} />
                                        <span className="font-bold text-sm">Document</span>
                                    </label>
                                    <label className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${parcelType === "not-document" ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-200 hover:border-orange-300"}`}>
                                        <input type="radio" value="not-document" {...register("parcelType")} className="hidden" />
                                        <FaBoxOpen size={24} />
                                        <span className="font-bold text-sm">Package</span>
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className={labelClass}>Item Description</label>
                                    <input type="text" placeholder="e.g. Laptop, Clothes" {...register("parcelName", { required: true })} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Weight (KG)</label>
                                    <div className="relative">
                                        <input type="number" step="0.5" min="0.5" placeholder="0.5" {...register("parcelWeight", { required: true })} className={`${inputClass} pl-10`} />
                                        <FaWeightHanging className="absolute left-3 top-3.5 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Addresses Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* SENDER CARD */}
                            <div className={sectionClass}>
                                <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                                <h3 className="text-lg font-bold text-slate-700 mb-4 border-b pb-2 flex gap-2 items-center">
                                    <FaMapMarkerAlt className="text-green-600"/> Sender Info
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className={labelClass}>Name</label>
                                        <input placeholder="Sender Name" defaultValue={user?.displayName} {...register("senderName")} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Phone</label>
                                        <input placeholder="01XXXXXXXXX" {...register("senderContact", {required: true})} className={inputClass} />
                                    </div>
                                    
                                    {/* Sender Region */}
                                    <div>
                                        <label className={labelClass}>Select Region</label>
                                        <select 
                                            className={inputClass} 
                                            {...register("senderRegion", { required: true })}
                                            onChange={(e) => {
                                                setValue("senderRegion", e.target.value);
                                                setSenderRegion(e.target.value);
                                            }}
                                        >
                                            <option value="">Select Region</option>
                                            {uniqueRegions.map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    </div>

                                    {/* Sender District */}
                                    <div>
                                        <label className={labelClass}>City / District</label>
                                        <select 
                                            className={inputClass}
                                            {...register("senderCity", { required: true })}
                                            onChange={(e) => {
                                                setValue("senderCity", e.target.value);
                                                setSenderDistrict(e.target.value);
                                            }}
                                            disabled={!senderRegion}
                                        >
                                            <option value="">Select City</option>
                                            {senderDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>

                                    {/* Sender Area */}
                                    <div>
                                        <label className={labelClass}>Select Area</label>
                                        <select {...register("senderWarehouse", { required: true })} className={inputClass} disabled={!senderDistrict}>
                                            <option value="">Select Area</option>
                                            {senderAreas.map(a => <option key={a} value={a}>{a}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className={labelClass}>Detailed Address</label>
                                        <input placeholder="House No, Road No" {...register("senderAddress")} className={inputClass} />
                                    </div>
                                </div>
                            </div>

                            {/* RECEIVER CARD */}
                            <div className={sectionClass}>
                                <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                                <h3 className="text-lg font-bold text-slate-700 mb-4 border-b pb-2 flex gap-2 items-center">
                                    <FaTruck className="text-orange-600"/> Receiver Info
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className={labelClass}>Name</label>
                                        <input placeholder="Receiver Name" {...register("receiverName", {required: true})} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Phone</label>
                                        <input placeholder="01XXXXXXXXX" {...register("receiverContact", {required: true})} className={inputClass} />
                                    </div>
                                    
                                    {/* Receiver Region */}
                                    <div>
                                        <label className={labelClass}>Select Region</label>
                                        <select 
                                            className={inputClass} 
                                            {...register("receiverRegion", { required: true })}
                                            onChange={(e) => {
                                                setValue("receiverRegion", e.target.value);
                                                setReceiverRegion(e.target.value);
                                            }}
                                        >
                                            <option value="">Select Region</option>
                                            {uniqueRegions.map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    </div>

                                    {/* Receiver District */}
                                    <div>
                                        <label className={labelClass}>City / District</label>
                                        <select 
                                            className={inputClass}
                                            {...register("receiverCity", { required: true })}
                                            onChange={(e) => {
                                                setValue("receiverCity", e.target.value);
                                                setReceiverDistrict(e.target.value);
                                            }}
                                            disabled={!receiverRegion}
                                        >
                                            <option value="">Select City</option>
                                            {receiverDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>

                                    {/* Receiver Area */}
                                    <div>
                                        <label className={labelClass}>Select Area</label>
                                        <select {...register("receiverWarehouse", { required: true })} className={inputClass} disabled={!receiverDistrict}>
                                            <option value="">Select Area</option>
                                            {receiverAreas.map(a => <option key={a} value={a}>{a}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className={labelClass}>Detailed Address</label>
                                        <input placeholder="House No, Road No" {...register("receiverAddress")} className={inputClass} />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* RIGHT COLUMN: STICKY COST CALCULATOR */}
                    <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-6">
                        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden transition-all duration-300 hover:shadow-2xl">
                            <div className="bg-slate-900 p-6 text-white text-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
                                <p className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-1">Estimated Total</p>
                                <h1 className="text-5xl font-extrabold text-[#CAEB66]">
                                    ৳{calculatedCost.amount}
                                </h1>
                                <p className="text-sm mt-2 opacity-80">{calculatedCost.label}</p>
                            </div>
                            
                            <div className="p-6 space-y-4">
                                <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-sm text-slate-600 border border-slate-100">
                                    <div className="flex justify-between border-b border-dashed border-slate-200 pb-2">
                                        <span className="font-medium">Weight:</span> <strong>{parcelWeight} KG</strong>
                                    </div>
                                    <div className="flex justify-between border-b border-dashed border-slate-200 pb-2">
                                        <span className="font-medium">From:</span> 
                                        <span className="text-right truncate w-32">{senderDistrict || "..."}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-dashed border-slate-200 pb-2">
                                        <span className="font-medium">To:</span> 
                                        <span className="text-right truncate w-32">{receiverDistrict || "..."}</span>
                                    </div>
                                    <div className="flex justify-between pt-1">
                                        <span className="font-medium">Payment:</span> <span className="badge badge-success text-white badge-sm">Pending</span>
                                    </div>
                                </div>

                                <button type="submit" className="w-full btn bg-blue-600 hover:bg-blue-700 text-white border-none rounded-xl shadow-lg shadow-blue-200 h-12 text-lg font-bold">
                                    Review Order <FaTruck className="ml-2"/>
                                </button>
                                
                                <div className="flex items-start gap-2 text-xs text-orange-600 bg-orange-50 p-3 rounded-lg">
                                    <FaInfoCircle className="mt-0.5" />
                                    <p>Pickup within 24 hours. Price may change if weight varies.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </form>
            </div>

            <ToastContainer />

            {/* CONFIRMATION MODAL */}
            <Modal
                isOpen={modalOpen}
                onRequestClose={() => setModalOpen(false)}
                className="bg-white max-w-lg w-full mx-auto mt-24 p-0 rounded-2xl shadow-2xl outline-none"
                overlayClassName="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex justify-center items-start z-[100] pt-10"
            >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-xl text-slate-800">Confirm Booking</h3>
                    <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-red-500 font-bold">✕</button>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-slate-600 text-sm">Please review the details below. Once confirmed, a rider will be assigned.</p>
                    
                    <div className="bg-blue-50 p-5 rounded-xl space-y-3 text-sm border border-blue-100">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Route</span>
                            <span className="font-bold text-slate-800">{senderDistrict} → {receiverDistrict}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Item</span>
                            <span className="font-bold text-slate-800">{pendingData?.parcelName} ({pendingData?.parcelWeight}kg)</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Receiver</span>
                            <span className="font-bold text-slate-800">{pendingData?.receiverName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Contact</span>
                            <span className="font-bold text-slate-800">{pendingData?.receiverContact}</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center bg-slate-800 p-4 rounded-xl text-white">
                        <span className="font-medium">Total Payable</span>
                        <span className="text-2xl font-extrabold text-[#CAEB66]">৳{calculatedCost.amount}</span>
                    </div>
                </div>
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
                    <button onClick={() => setModalOpen(false)} className="btn btn-ghost text-slate-600">Edit Details</button>
                    <button onClick={confirmSubmit} className="btn bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200 border-none px-6">Confirm & Book</button>
                </div>
            </Modal>
        </div>
    );
};

export default Send_Parcel;