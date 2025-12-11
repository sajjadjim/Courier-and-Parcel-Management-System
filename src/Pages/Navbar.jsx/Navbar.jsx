import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom'; // Fixed import source
import FastestDelivarylogo from '../../Shared/WebsiteLogo/FastestDelivarylogo';
import { AuthContext } from '../../Context/AuthContext';

const Navbar = () => {
    // START: Changed 'use' to 'useContext' for stability in Vite/React 18
    const { user, logOut } = useContext(AuthContext); 
    // END

    const handleLogOut = () => {
        logOut()
            .then(() => { })
            .catch(error => console.log(error));
    }

    // Professional Active Link Style
    const getLinkClass = ({ isActive }) =>
        isActive
            ? "text-primary font-bold px-3 py-2 border-b-2 border-primary transition-all duration-300"
            : "text-gray-700 font-medium px-3 py-2 hover:text-primary transition-colors duration-300";

    const navItems = <>
        <li><NavLink to='/' className={getLinkClass}>Home</NavLink></li>
        <li><NavLink to='/coverage' className={getLinkClass}>Coverage</NavLink></li>
        {/* "Send Parcel" is a key Customer feature [cite: 12] */}
        <li><NavLink to='/addparcel' className={getLinkClass}>Send Parcel</NavLink></li>
        <li><NavLink to='/beARider' className={getLinkClass}>Be a Rider</NavLink></li>
    </>

    return (
        // Added 'sticky', 'backdrop-blur', and 'z-50' to keep navbar on top while scrolling
        <div className="navbar bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50 px-4 lg:px-12">
            
            {/* Left Side: Logo & Mobile Menu */}
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> 
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> 
                        </svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        {navItems}
                        {/* Mobile Dashboard Link (if logged in) */}
                        {user && <li><Link to='/dashboard'>Dashboard</Link></li>}
                    </ul>
                </div>
                
                {/* Logo Component */}
                <div className="cursor-pointer">
                    <FastestDelivarylogo />
                </div>
            </div>

            {/* Center: Desktop Navigation */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 space-x-2">
                    {navItems}
                </ul>
            </div>

            {/* Right Side: Auth Buttons or Profile Dropdown */}
            <div className="navbar-end space-x-3">
                {user ? (
                    <div className="dropdown dropdown-end">
                        {/* Avatar / Profile Picture Trigger */}
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border border-gray-200">
                            <div className="w-10 rounded-full">
                                <img 
                                    alt="User Profile" 
                                    src={user?.photoURL || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} 
                                />
                            </div>
                        </div>
                        {/* Dropdown Menu */}
                        <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow border border-gray-100">
                            <li className="px-4 py-2 font-bold text-primary border-b border-gray-200 mb-2">
                                {user?.displayName || "User"}
                            </li>
                            <li>
                                {/* Dashboard is the central hub for tracking and management [cite: 21] */}
                                <Link to='/dashboard' className="justify-between">
                                    Dashboard
                                    <span className="badge badge-primary badge-sm">New</span>
                                </Link>
                            </li>
                            <li><button onClick={handleLogOut} className="text-red-500 hover:bg-red-50">Logout</button></li>
                        </ul>
                    </div>
                ) : (
                    // Login / Join Buttons
                    <>
                        <Link to='/login' className='btn btn-ghost font-bold'>Login</Link>
                        <Link to='/register' className='btn btn-primary text-white shadow-lg hover:shadow-xl transition-all'>Join Now</Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default Navbar;