import React, { useContext, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../../../Context/AuthContext';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import { toast, ToastContainer } from 'react-toastify';
import { FaUserEdit, FaSave, FaTimes, FaCamera, FaEnvelope, FaIdBadge, FaPhone, FaMapMarkerAlt, FaUserTag } from 'react-icons/fa';

const ProfileUpdate = () => {
    const { user, updateUserProfile } = useContext(AuthContext); 
    const [isEditing, setIsEditing] = useState(false);
    const axiosSecure = UseAxiosSecure();

    // 1. FETCH DATA STRICTLY MATCHING LOGGED-IN USER
    const { data: dbUser = {}, refetch, isLoading } = useQuery({
        queryKey: ['userProfile', user?.email], // Unique key based on email
        queryFn: async () => {
            if (!user?.email) return {};
            // This endpoint must match your server route: router.get('/:email', ...)
            const res = await axiosSecure.get(`/users/${user.email}`); 
            return res.data || {}; 
        },
        enabled: !!user?.email, // Only run query if user is logged in
    });

    const { register, handleSubmit, reset, setValue } = useForm();

    // 2. SYNC FORM WITH DATABASE DATA
    useEffect(() => {
        if (user && dbUser) {
            // Prioritize Database data, fallback to Firebase data
            setValue("name", dbUser.name || user.displayName || "");
            setValue("photoURL", dbUser.image || user.photoURL || "");
            setValue("phone", dbUser.phone || ""); // From DB only
            setValue("address", dbUser.address || ""); // From DB only
        }
    }, [user, dbUser, setValue, isEditing]); // Re-run when edit mode opens to ensure fresh data

    const onSubmit = async (data) => {
        try {
            // A. Update Firebase Auth (Name & Photo)
            await updateUserProfile(data.name, data.photoURL);

            // B. Update Database Record
            const userInfo = {
                name: data.name,
                image: data.photoURL,
                phone: data.phone,
                address: data.address,
                // We do NOT send email here as it's the unique identifier and shouldn't change
            };

            const res = await axiosSecure.patch(`/users/${user?.email}`, userInfo);

            if (res.data.modifiedCount > 0 || res.data.matchedCount > 0 || res.data.upsertedCount > 0) {
                toast.success("Profile updated successfully!");
                await refetch(); // Reload data from server to reflect changes
                setIsEditing(false); 
            } else {
                toast.info("No changes detected.");
            }

        } catch (error) {
            console.error("Update Error:", error);
            toast.error("Failed to update profile. Please try again.");
        }
    };

    if (isLoading) return (
        <div className="min-h-[60vh] flex justify-center items-center">
            <span className="loading loading-bars loading-lg text-blue-600"></span>
        </div>
    );

    return (
        <div className="min-h-[80vh] flex justify-center items-center bg-gray-50 p-4 font-sans">
            <ToastContainer position="top-right" autoClose={3000} />
            
            <div className="bg-white max-w-5xl w-full rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
                
                {/* LEFT SIDE: Banner */}
                <div className="w-full md:w-1/3 bg-gradient-to-br from-blue-700 to-indigo-800 p-8 flex flex-col items-center justify-center text-white relative">
                    <div className="relative group z-10">
                        <div className="w-44 h-44 rounded-full border-4 border-white/30 shadow-2xl overflow-hidden p-1 bg-white/10 backdrop-blur-sm">
                            <img 
                                src={dbUser.image || user?.photoURL || "https://i.ibb.co/5GzXkwq/user.png"} 
                                alt="Profile" 
                                className="w-full h-full object-cover rounded-full"
                            />
                        </div>
                        {!isEditing && (
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="absolute bottom-3 right-3 bg-white text-blue-600 p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer"
                                title="Edit Photo"
                            >
                                <FaCamera size={16} />
                            </button>
                        )}
                    </div>
                    <h2 className="text-2xl font-bold mt-6 text-center">{dbUser.name || user?.displayName}</h2>
                    <div className="mt-3 flex items-center gap-2 px-4 py-1.5 bg-white/20 rounded-full text-sm font-bold backdrop-blur-md border border-white/20 capitalize">
                        <FaUserTag className="text-yellow-300" /> {dbUser.role || "User"}
                    </div>
                </div>

                {/* RIGHT SIDE: Details / Edit Form */}
                <div className="w-full md:w-2/3 p-8 md:p-12 bg-white">
                    <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                        <h1 className="text-2xl font-bold text-slate-800">
                            {isEditing ? "Edit Profile Information" : "My Profile Details"}
                        </h1>
                        {!isEditing && (
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg shadow-md transition-all text-sm font-medium"
                            >
                                <FaUserEdit /> Edit Profile
                            </button>
                        )}
                    </div>

                    {isEditing ? (
                        /* EDIT FORM */
                        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                            <div className="form-control">
                                <label className="label"><span className="label-text font-bold text-slate-600">Full Name</span></label>
                                <input type="text" {...register("name")} className="input input-bordered w-full focus:border-blue-500 bg-gray-50 rounded-lg" />
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text font-bold text-slate-600">Phone Number</span></label>
                                <input type="tel" {...register("phone")} placeholder="+880 1XXX-XXXXXX" className="input input-bordered w-full focus:border-blue-500 bg-gray-50 rounded-lg" />
                            </div>

                            <div className="form-control md:col-span-2">
                                <label className="label"><span className="label-text font-bold text-slate-600">Address</span></label>
                                <textarea {...register("address")} placeholder="Full Address" className="textarea textarea-bordered w-full focus:border-blue-500 bg-gray-50 rounded-lg h-24"></textarea>
                            </div>

                            <div className="form-control md:col-span-2">
                                <label className="label"><span className="label-text font-bold text-slate-600">Photo URL</span></label>
                                <input type="url" {...register("photoURL")} className="input input-bordered w-full focus:border-blue-500 bg-gray-50 rounded-lg" />
                            </div>

                            <div className="flex gap-4 pt-6 md:col-span-2">
                                <button type="submit" className="btn bg-blue-600 hover:bg-blue-700 text-white flex-1 border-none rounded-lg"><FaSave /> Save</button>
                                <button type="button" onClick={() => setIsEditing(false)} className="btn bg-gray-100 hover:bg-gray-200 text-gray-600 flex-1 border-none rounded-lg"><FaTimes /> Cancel</button>
                            </div>
                        </form>
                    ) : (
                        /* VIEW DETAILS */
                        <div className="space-y-4 animate-fadeIn">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoBlock icon={<FaIdBadge />} label="Full Name" value={dbUser.name || user?.displayName} color="blue" />
                                <InfoBlock icon={<FaPhone />} label="Phone" value={dbUser.phone || "Not set"} color="green" />
                            </div>
                            <InfoBlock icon={<FaEnvelope />} label="Email" value={user?.email} color="purple" />
                            <InfoBlock icon={<FaMapMarkerAlt />} label="Address" value={dbUser.address || "No address provided."} color="orange" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Helper Component for Info Blocks (Keeps main code clean)
const InfoBlock = ({ icon, label, value, color }) => {
    const colors = {
        blue: "bg-blue-100 text-blue-600",
        green: "bg-green-100 text-green-600",
        purple: "bg-purple-100 text-purple-600",
        orange: "bg-orange-100 text-orange-600",
    };
    return (
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
            <div className={`p-3 rounded-full ${colors[color]}`}>{icon}</div>
            <div className="overflow-hidden">
                <p className="text-xs text-gray-500 font-bold uppercase">{label}</p>
                <p className="text-base font-semibold text-slate-800 truncate">{value}</p>
            </div>
        </div>
    );
};

export default ProfileUpdate;