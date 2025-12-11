import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
import { FaEnvelope, FaLock, FaGoogle, FaArrowRight, FaSpinner, FaTruckMoving } from 'react-icons/fa';

import useAxiosInstance from '../../../Hooks/useAxiosInstance';
import { AuthContext } from '../../../Context/AuthContext';

const Login = () => {
    useEffect(() => {
        document.title = "Login | Welcome Back";
    }, []);

    const [loading, setLoading] = useState(false);
    const axiosInstance = useAxiosInstance();
    const location = useLocation();
    const navigate = useNavigate();
    
    // Redirect path (default to home if no history)
    const from = location.state?.from?.pathname || location.state || "/";

    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signIn, signInWithGoogle } = useContext(AuthContext);

    // 1. Email/Password Login
    const onSubmitData = async (data) => {
        setLoading(true);
        try {
            await signIn(data.email, data.password);
            toast.success("Welcome back!", { position: "top-center" });
            
            // Short delay for visual feedback
            setTimeout(() => {
                navigate(from, { replace: true });
            }, 1000);
        } catch (error) {
            console.error(error);
            toast.error("Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    // 2. Google Login
    const handleLoginwithGoogle = () => {
        signInWithGoogle()
            .then(async (result) => {
                const userInfo = {
                    name: result.user.displayName,
                    email: result.user.email,
                    role: 'user', // Default role, backend should handle existing roles
                    image: result.user.photoURL,
                    lastLogin: new Date(),
                };

                // Sync with Database
                try {
                    await axiosInstance.post('/users', userInfo);
                    toast.success("Login Successful!");
                    navigate(from, { replace: true });
                } catch (err) {
                    // Even if DB post fails (e.g. user exists), we still let them in
                    console.log("User sync note:", err.response?.data?.message);
                    navigate(from, { replace: true });
                }
            })
            .catch(error => {
                console.error(error);
                toast.error("Google Sign-in failed.");
            });
    };

    return (
        <div className="min-h-screen flex bg-white font-sans">
            <ToastContainer />

            {/* === LEFT SIDE: Branding (Hidden on Mobile) === */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center p-12 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#CAEB66] rounded-full blur-[120px] opacity-10 translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10 text-white max-w-lg">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md border border-white/10 text-[#CAEB66]">
                            <FaTruckMoving size={28} />
                        </div>
                        <span className="text-xl font-bold tracking-wide">PickOn Logistics</span>
                    </div>
                    
                    <h1 className="text-5xl font-extrabold mb-6 leading-tight">
                        Welcome Back, <br /> Partner.
                    </h1>
                    <p className="text-slate-300 text-lg leading-relaxed">
                        Log in to track your shipments, manage deliveries, or book a new courier request instantly.
                    </p>
                </div>
            </div>

            {/* === RIGHT SIDE: Form === */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-md space-y-8">
                    
                    {/* Header */}
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-900">Sign In</h2>
                        <p className="text-slate-500 mt-2">Enter your credentials to access your account.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmitData)} className="space-y-6">
                        
                        {/* Email Field */}
                        <div className="group">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    {...register('email', { required: true })}
                                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-800 placeholder:text-slate-400"
                                    placeholder="name@example.com"
                                />
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">Email is required</p>}
                        </div>

                        {/* Password Field */}
                        <div className="group">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    {...register('password', { required: true, minLength: 6 })}
                                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-800 placeholder:text-slate-400"
                                    placeholder="••••••••"
                                />
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">Password must be at least 6 characters</p>}
                            
                            <div className="flex justify-end mt-2">
                                <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline">Forgot password?</a>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <FaSpinner className="animate-spin" /> : 'Log In'} 
                            {!loading && <FaArrowRight size={16} />}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-slate-200"></div>
                        <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase">Or continue with</span>
                        <div className="flex-grow border-t border-slate-200"></div>
                    </div>

                    {/* Google Button */}
                    <button
                        onClick={handleLoginwithGoogle}
                        className="w-full py-3.5 border-2 border-slate-100 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-all flex items-center justify-center gap-3"
                    >
                        <FaGoogle className="text-red-500 text-xl" /> 
                        <span>Google</span>
                    </button>

                    {/* Register Link */}
                    <p className="text-center text-slate-500 mt-8">
                        Don't have an account?{' '}
                        <Link className="text-blue-600 font-bold hover:underline" to="/register">
                            Register Now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;