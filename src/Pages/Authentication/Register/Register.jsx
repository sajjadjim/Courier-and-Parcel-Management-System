import React, { useContext, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router'; // Use 'dom'
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { FaUser, FaMotorcycle, FaGoogle, FaEnvelope, FaLock, FaImage, FaSpinner } from 'react-icons/fa';

import useAuth from '../../../Hooks/useAuth';
import useAxiosInstance from '../../../Hooks/useAxiosInstance';
import { AuthContext } from '../../../Context/AuthContext';
import FastestDelivarylogo from '../../../Shared/WebsiteLogo/FastestDelivarylogo';
// import loginImage from '../../../../public/login.png'; // Add a nice illustration here

const Register = () => {
    useEffect(() => {
        document.title = "Register | Join Us";
    }, []);

    const [imageUrl, setImageUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const [userType, setUserType] = useState(''); // 'user' or 'rider'
    
    const { createUser, signInWithGoogle, updateUserProfile, user } = useContext(AuthContext); // Standard useContext
    const axiosInstance = useAxiosInstance();
    const location = useLocation();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm();

    // 1. Image Upload Handler
    const handleImageUpload = async (e) => {
        const image = e.target.files[0];
        if (!image) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', image);

        try {
            const res = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_UPLOAD_API_KEY}`, formData);
            setImageUrl(res.data.data.display_url);
            toast.success("Image uploaded successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    // 2. Main Registration Handler
    const onSubmitData = async (data) => {
        if (!userType) {
            toast.error("Please select an Account Type (User or Rider)");
            return;
        }

        if (!imageUrl) {
            toast.error("Please upload a profile picture");
            return;
        }

        try {
            // Check if user already exists in DB (Optional but good for UX)
            // const checkUser = await axiosInstance.get(`/users/${data.email}`);
            // if (checkUser.data) {
            //     toast.error("User with this email already exists!");
            //     return;
            // }

            // Create Firebase User
            const result = await createUser(data.email, data.password);
            
            // Update Firebase Profile
            await updateUserProfile(data.name, imageUrl);

            // Prepare Database Entry
            const userInfo = {
                name: data.name,
                email: data.email,
                role: userType, // 'user' or 'rider'
                image: imageUrl,
                phone: data.phone || "", // Optional phone field if you add it
                createdAt: new Date(),
                lastLogin: new Date(),
                status: userType === 'rider' ? 'pending' : 'active' // Riders might need approval
            };

            // Save to MongoDB
            const dbResponse = await axiosInstance.post('/users', userInfo);

            if (dbResponse.data.insertedId) {
                toast.success(`Welcome! Registered as a ${userType}.`);
                navigate(location.state ? location.state : '/');
            } else {
                // If backend says user exists (handle duplicate logic here)
                toast.warning(dbResponse.data.message || "User already exists in database");
                navigate('/login');
            }

        } catch (error) {
            console.error(error);
            if (error.code === 'auth/email-already-in-use') {
                toast.error("Email is already registered. Please login.");
            } else {
                toast.error("Registration failed. Try again.");
            }
        }
    };

    // 3. Google Sign Up Handler
    const handleGoogleSignUp = () => {
        if (!userType) {
            toast.error("Please select Account Type first!");
            return;
        }

        signInWithGoogle()
            .then(async (result) => {
                const userInfo = {
                    name: result.user.displayName,
                    email: result.user.email,
                    role: userType,
                    image: result.user.photoURL,
                    createdAt: new Date(),
                    lastLogin: new Date(),
                    status: 'active' 
                };

                const res = await axiosInstance.post('/users', userInfo);
                
                if (res.data.insertedId || res.data.message === 'User already exists') {
                    toast.success("Login Successful!");
                    navigate(location.state ? location.state : '/');
                }
            })
            .catch(error => {
                console.error(error);
                toast.error("Google Sign-in Failed");
            });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
            <ToastContainer />
            
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row">
                
                {/* Left Side - Image/Info */}
                <div className="md:w-1/2 bg-slate-900 p-10 flex flex-col justify-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#CAEB66] rounded-full blur-3xl opacity-10 translate-y-1/2 -translate-x-1/2"></div>
                     <FastestDelivarylogo className="z-10 cursor-pointer" />
                    {/* <h2 className="text-4xl font-bold mb-4 z-10">Join Our Community</h2> */}
                    <p className="text-slate-300 mb-8 z-10 text-lg">
                        Create an account to track parcels, manage deliveries, or become a rider partner.
                    </p>
                    
                    {/* Illustration Placeholder */}
                    <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/10 z-10">
                        <h3 className="font-bold text-[#CAEB66] mb-2">Why Register?</h3>
                        <ul className="space-y-2 text-sm text-slate-300">
                            <li>✓ Real-time Parcel Tracking</li>
                            <li>✓ Secure Payment Processing</li>
                            <li>✓ 24/7 Customer Support</li>
                            <li>✓ Easy Returns Management</li>
                        </ul>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="md:w-1/2 p-8 md:p-12">
                    <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center">Create Account</h2>

                    {/* Step 1: Select Type */}
                    <div className="flex gap-4 mb-8">
                        <button 
                            type="button"
                            onClick={() => setUserType('user')}
                            className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${userType === 'user' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                        >
                            <FaUser size={20} />
                            <span className="font-bold text-sm">Customer</span>
                        </button>
                        <button 
                            type="button"
                            onClick={() => setUserType('rider')}
                            className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${userType === 'rider' ? 'border-[#CAEB66] bg-[#f4fadc] text-slate-800' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                        >
                            <FaMotorcycle size={20} />
                            <span className="font-bold text-sm">Delivery Rider</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmitData)} className="space-y-4">
                        
                        {/* Name Input */}
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-600 uppercase">Full Name</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    {...register('name', { required: true })}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                                    placeholder="John Doe"
                                />
                                <FaUser className="absolute left-3 top-3.5 text-gray-400" size={14} />
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-600 uppercase">Profile Photo</label>
                            <div className="relative">
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                <FaImage className="absolute left-3 top-3.5 text-gray-400" size={14} />
                                {uploading && <FaSpinner className="absolute right-3 top-3.5 animate-spin text-blue-600" />}
                            </div>
                        </div>

                        {/* Email Input */}
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-600 uppercase">Email Address</label>
                            <div className="relative">
                                <input 
                                    type="email" 
                                    {...register('email', { required: true })}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                                    placeholder="name@example.com"
                                />
                                <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" size={14} />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="form-control">
                            <label className="label text-xs font-bold text-slate-600 uppercase">Password</label>
                            <div className="relative">
                                <input 
                                    type="password" 
                                    {...register('password', { required: true, minLength: 6 })}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                                    placeholder="••••••••"
                                />
                                <FaLock className="absolute left-3 top-3.5 text-gray-400" size={14} />
                            </div>
                            {errors.password && <span className="text-red-500 text-xs mt-1">Min 6 chars required</span>}
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit"
                            disabled={uploading}
                            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            {uploading ? 'Uploading Image...' : 'Create Account'}
                        </button>

                    </form>

                    <div className="divider my-6 text-xs text-gray-400">OR CONTINUE WITH</div>

                    <button 
                        onClick={handleGoogleSignUp}
                        className="w-full py-3 border border-gray-200 bg-white hover:bg-gray-50 text-slate-700 font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                        <FaGoogle className="text-red-500" /> Google
                    </button>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Log In</Link>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Register;