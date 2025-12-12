import React, { useState, useEffect, use } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import Modal from "react-modal";
import "react-toastify/dist/ReactToastify.css";
import { useLoaderData, useNavigate } from "react-router";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import { AuthContext } from "../../Context/AuthContext";
import useTrackingLogger from "../../Hooks/useTrackingLogger";

// Icons for professional look
import { FaBoxOpen, FaWeightHanging, FaMapMarkerAlt, FaUser, FaPhoneAlt, FaFileAlt, FaTruck, FaInfoCircle } from "react-icons/fa";
import { MdLocalShipping } from "react-icons/md";

Modal.setAppElement("#root");

const generateTrackingID = () => {
    const date = new Date();
    const datePart = date.toISOString().split("T")[0].replace(/-/g, "");
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `PCL-${datePart}-${rand}`;
};

const AddParcel = () => {

    document.title = "Add Parcel | PickOnGo - Fastest Delivery Service";

    const { user } = use(AuthContext);
    const axiosSecure = UseAxiosSecure();
    const warehouseData = useLoaderData();
    const { logTracking } = useTrackingLogger();
    const navigate = useNavigate();

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const [senderRegion, setSenderRegion] = useState("");
    const [receiverRegion, setReceiverRegion] = useState("");
    const [senderWarehouses, setSenderWarehouses] = useState([]);
    const [receiverWarehouses, setReceiverWarehouses] = useState([]);

    const [modalOpen, setModalOpen] = useState(false);
    const [pendingData, setPendingData] = useState(null);
    const [calculatedCost, setCalculatedCost] = useState(null);

    // Watch values for live cost calculation
    const parcelType = watch("parcelType", "document"); // Default to document
    const parcelWeight = watch("parcelWeight", 0);

    // Update warehouses when regions change
    useEffect(() => {
        if (warehouseData) {
            const filteredSender = warehouseData.filter(
                (item) => item.region.toLowerCase() === senderRegion.toLowerCase()
            );
            setSenderWarehouses(filteredSender.flatMap((item) => item.covered_area));

            const filteredReceiver = warehouseData.filter(
                (item) => item.region.toLowerCase() === receiverRegion.toLowerCase()
            );
            setReceiverWarehouses(filteredReceiver.flatMap((item) => item.covered_area));
        }
    }, [senderRegion, receiverRegion, warehouseData]);

    // Calculation Logic
    const calculateDeliveryCost = (type, weight, senderReg, receiverReg) => {
        const w = parseFloat(weight) || 0;
        const sReg = senderReg || "";
        const rReg = receiverReg || "";
        
        // Safety check for type
        const pType = type || "document";

        const sameRegion = sReg.toLowerCase() === rReg.toLowerCase();

        if (pType === "document") {
            return sameRegion
                ? { amount: 60, label: "Within City" }
                : { amount: 80, label: "Outside City/District" };
        } else {
            // Non-document logic
            if (w <= 3) {
                return sameRegion
                    ? { amount: 110, label: "Within City" }
                    : { amount: 150, label: "Outside City" };
            } else {
                const extra = (w - 3) * 40;
                return sameRegion
                    ? { amount: 110 + extra, label: "Within City" }
                    : { amount: 150 + extra + 40, label: "Outside City" };
            }
        }
    };

    const liveCost = calculateDeliveryCost(parcelType, parcelWeight, senderRegion, receiverRegion);

    const onSubmit = (data) => {
        const cost = calculateDeliveryCost(
            data.parcelType,
            data.parcelWeight,
            data.senderRegion,
            data.receiverRegion
        );
        setPendingData(data);
        setCalculatedCost(cost);
        setModalOpen(true); 
    };

    const confirmSubmit = () => {
        const data = pendingData;
        const costObj = calculatedCost;
        const weight = parseFloat(data.parcelWeight) || 0;
        const trackingId = generateTrackingID();

        const parcelData = {
            ...data,
            email: user.email,
            payment_status: 'unpaid',
            parcelWeight: weight,
            deliveryCharge: costObj,
            trackingId: trackingId,
            date: new Date().toISOString().split("T")[0],
            delivery_status: 'not_collected',
        };

        axiosSecure.post('/parcels', parcelData)
            .then(async (res) => {
                if (res.data && res.data.insertedId) {
                    toast.success("🎉 Order Placed Successfully!");
                    await logTracking({
                        trackingId: parcelData.trackingId,
                        status: "parcel_created",
                        details: `Created by ${user.displayName}`,
                        updated_by: user.email,
                    });
                    setTimeout(() => navigate("/dashboard/myParcels"), 1500);
                }
            })
            .catch(() => toast.error("❌ Failed to place order."));

        setModalOpen(false);
        setPendingData(null);
    };

    // Styling classes
    const inputClass = "w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm text-gray-700 bg-white";
    const labelClass = "block text-sm font-medium text-gray-600 mb-1";
    const sectionClass = "bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6";

    return (
        <div className="min-h-screen bg-gray-50 mt-20 py-8 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 flex items-center justify-center gap-3">
                        <MdLocalShipping className="text-blue-600" /> Book a New Parcel
                    </h1>
                    <p className="text-gray-500 mt-2">Fill in the details below to schedule your delivery instantly.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    
                    {/* LEFT COLUMN: FORM INPUTS (Spans 2 columns) */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* 1. Parcel Information */}
                        <div className={sectionClass}>
                            <h3 className="text-lg font-bold text-slate-700 mb-5 flex items-center gap-2 border-b pb-3">
                                <FaBoxOpen className="text-blue-500" /> Parcel Details
                            </h3>

                            <div className="mb-6">
                                <label className={labelClass}>Select Parcel Type</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <label className={`cursor-pointer border rounded-xl p-4 flex items-center gap-4 transition-all ${parcelType === "document" ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500" : "border-gray-200 hover:border-blue-300"}`}>
                                        <input type="radio" value="document" {...register("parcelType")} className="hidden" />
                                        <div className="p-2 bg-white rounded-full text-blue-600 shadow-sm"><FaFileAlt size={20} /></div>
                                        <div>
                                            <p className="font-semibold text-gray-800">Document</p>
                                            <p className="text-xs text-gray-500">Letters, Files, Papers</p>
                                        </div>
                                    </label>

                                    <label className={`cursor-pointer border rounded-xl p-4 flex items-center gap-4 transition-all ${parcelType === "not-document" ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500" : "border-gray-200 hover:border-blue-300"}`}>
                                        <input type="radio" value="not-document" {...register("parcelType")} className="hidden" />
                                        <div className="p-2 bg-white rounded-full text-orange-600 shadow-sm"><FaBoxOpen size={20} /></div>
                                        <div>
                                            <p className="font-semibold text-gray-800">Package / Box</p>
                                            <p className="text-xs text-gray-500">Electronics, Clothes, Gifts</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className={labelClass}>Parcel Name / Description</label>
                                    <input type="text" placeholder="E.g. Laptop, Legal Papers" {...register("parcelName", { required: true })} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Weight (kg)</label>
                                    <div className="relative">
                                        <input type="number" step="0.1" min="0" placeholder="0.0" {...register("parcelWeight", { required: true })} className={`${inputClass} pl-10`} />
                                        <FaWeightHanging className="absolute left-3 top-3.5 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Addresses (Sender & Receiver) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Sender Card */}
                            <div className={sectionClass}>
                                <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2 border-b pb-2">
                                    <FaMapMarkerAlt className="text-green-500" /> Sender Info
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className={labelClass}>Name</label>
                                        <input placeholder="Your Name" defaultValue={user?.displayName} {...register("senderName")} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Phone</label>
                                        <div className="relative">
                                            <input placeholder="Your Number" {...register("senderContact")} className={`${inputClass} pl-10`} />
                                            <FaPhoneAlt className="absolute left-3 top-3.5 text-gray-400" size={14} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Region</label>
                                        <select className={inputClass} {...register("senderRegion", { onChange: (e) => setSenderRegion(e.target.value) })}>
                                            <option value="">Select Area</option>
                                            {[...new Set(warehouseData.map((d) => d.region))].map((r) => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Nearest Warehouse</label>
                                        <select {...register("senderWarehouse")} className={inputClass}>
                                            <option value="">Select Warehouse</option>
                                            {senderWarehouses.map((wh, i) => <option key={i} value={wh}>{wh}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Full Address</label>
                                        <input placeholder="House, Road, Block" {...register("senderAddress")} className={inputClass} />
                                    </div>
                                </div>
                            </div>

                            {/* Receiver Card */}
                            <div className={sectionClass}>
                                <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2 border-b pb-2">
                                    <FaTruck className="text-orange-500" /> Receiver Info
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className={labelClass}>Name</label>
                                        <input placeholder="Receiver Name" {...register("receiverName")} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Phone</label>
                                        <div className="relative">
                                            <input placeholder="Receiver Number" {...register("receiverContact")} className={`${inputClass} pl-10`} />
                                            <FaPhoneAlt className="absolute left-3 top-3.5 text-gray-400" size={14} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Region</label>
                                        <select className={inputClass} {...register("receiverRegion", { onChange: (e) => setReceiverRegion(e.target.value) })}>
                                            <option value="">Select Area</option>
                                            {[...new Set(warehouseData.map((d) => d.region))].map((r) => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Nearest Warehouse</label>
                                        <select {...register("receiverWarehouse")} className={inputClass}>
                                            <option value="">Select Warehouse</option>
                                            {receiverWarehouses.map((wh, i) => <option key={i} value={wh}>{wh}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Full Address</label>
                                        <input placeholder="House, Road, Block" {...register("receiverAddress")} className={inputClass} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className={sectionClass}>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClass}>Pickup Instructions (Optional)</label>
                                    <textarea placeholder="E.g. Gate closed, call first..." {...register("pickupInstruction")} className={`${inputClass} h-20 resize-none`} />
                                </div>
                                <div>
                                    <label className={labelClass}>Delivery Instructions (Optional)</label>
                                    <textarea placeholder="E.g. Leave at reception..." {...register("deliveryInstruction")} className={`${inputClass} h-20 resize-none`} />
                                </div>
                             </div>
                        </div>
                    </div>


                    {/* RIGHT COLUMN: STICKY COST CALCULATOR (Spans 1 column) */}
                    <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-6">
                        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
                            <div className="bg-blue-600 p-5 text-white text-center">
                                <h2 className="text-xl font-bold uppercase tracking-wider">Estimated Cost</h2>
                                <p className="opacity-80 text-sm">Based on weight & location</p>
                            </div>
                            <div className="p-6 flex flex-col items-center justify-center space-y-4">
                                <div className="text-center">
                                    <p className="text-gray-500 text-sm font-medium uppercase mb-1">Total Delivery Charge</p>
                                    <h1 className="text-5xl font-extrabold text-slate-800">
                                        ৳{liveCost.amount}
                                    </h1>
                                </div>
                                
                                <div className="w-full bg-blue-50 p-4 rounded-xl space-y-2 border border-blue-100">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Type:</span>
                                        {/* FIX: Add safety check || "" before replace */}
                                        <span className="font-semibold capitalize">{(parcelType || "").replace("-", " ")}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Weight:</span>
                                        <span className="font-semibold">{parcelWeight} kg</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Zone:</span>
                                        <span className={`font-semibold px-2 py-0.5 rounded text-xs ${liveCost.label === "Within City" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                                            {liveCost.label}
                                        </span>
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2">
                                    Book Delivery <FaTruck />
                                </button>
                                <p className="text-xs text-gray-400 text-center">
                                    * Final price may vary if weight discrepancy found during pickup.
                                </p>
                            </div>
                        </div>

                        {/* Help Box */}
                        <div className="bg-orange-50 p-5 rounded-xl border border-orange-100 text-orange-800 text-sm flex items-start gap-3">
                            <FaInfoCircle className="mt-1 flex-shrink-0" size={18} />
                            <div>
                                <p className="font-bold">Pickup Time:</p>
                                <p>Our rider will arrive between <span className="font-bold">4 PM - 7 PM</span> today if booked before 2 PM.</p>
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
                className="bg-white max-w-lg w-full mx-auto mt-20 p-0 rounded-2xl shadow-2xl outline-none overflow-hidden"
                overlayClassName="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-start z-[100] pt-10"
            >
                <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-800">Review Your Order</h2>
                    <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-red-500">✕</button>
                </div>
                
                <div className="p-6 space-y-4">
                    {pendingData && calculatedCost && (
                        <div className="space-y-3">
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500">Parcel Type</span>
                                {/* FIX: Add safety check here too just in case */}
                                <span className="font-medium capitalize">{(pendingData.parcelType || "").replace('-', ' ')}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500">Weight</span>
                                <span className="font-medium">{pendingData.parcelWeight} kg</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500">Sender Region</span>
                                <span className="font-medium">{pendingData.senderRegion || "N/A"}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500">Receiver Region</span>
                                <span className="font-medium">{pendingData.receiverRegion || "N/A"}</span>
                            </div>
                            
                            <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center mt-4">
                                <span className="font-bold text-blue-800">Total Payable</span>
                                <span className="text-2xl font-bold text-blue-600">৳{calculatedCost.amount}</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-gray-50 border-t flex justify-end gap-3">
                    <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-white transition-colors font-medium">
                        Edit Details
                    </button>
                    <button onClick={confirmSubmit} className="px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200 transition-colors font-bold flex items-center gap-2">
                        Confirm Order <FaTruck />
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default AddParcel;