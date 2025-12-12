import React from 'react';
import { NavLink, Outlet, Link } from 'react-router'; // Use 'react-router-dom'
import FastestDelivarylogo from '../Shared/WebsiteLogo/FastestDelivarylogo';
import { 
    FaHome, FaBox, FaCreditCard, FaSearchLocation, 
    FaUserEdit, FaUserShield, FaTasks, FaWallet, 
    FaCheckCircle, FaSignOutAlt , FaUserSlash 
} from 'react-icons/fa';
import { RiMotorbikeFill, RiDashboardLine } from "react-icons/ri";
import useUserRole from '../Hooks/useUserRole';
import useAuth from '../Hooks/useAuth'; 

const DashBoardLayout = () => {
    const { role, roleLoading } = useUserRole();
    const { logOut } = useAuth(); 

    const navLinkClasses = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 transition-all duration-200 rounded-lg text-sm font-medium ${
            isActive 
            ? "bg-blue-50 text-blue-700 shadow-sm border-l-4 border-blue-600" 
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`;

    if (roleLoading) {
        return <div className="flex justify-center items-center h-screen bg-white">
            <span className="loading loading-spinner loading-lg text-blue-600"></span>
        </div>;
    }

    return (
        <div className="drawer lg:drawer-open bg-gray-50 min-h-screen font-sans">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            
            {/* Main Content Area */}
            <div className="drawer-content flex flex-col">
                {/* Mobile Navbar */}
                <div className="navbar bg-white border-b border-gray-200 w-full lg:hidden sticky top-0 z-50 shadow-sm">
                    <div className="flex-none">
                        <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-6 w-6 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </label>
                    </div>
                    <div className="flex-1 px-2 font-bold text-gray-800">Dashboard</div>
                    <div className="flex-none"><FastestDelivarylogo /></div>
                </div>

                {/* Page Content */}
                <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full">
                    <Outlet />
                </div>
            </div>

            {/* Sidebar */}
            <div className="drawer-side z-50">
                <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
                
                <div className="menu bg-white text-base-content min-h-full w-72 flex flex-col justify-between p-0 border-r border-gray-200">
                    
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 flex justify-center">
                        <div className="scale-110"><FastestDelivarylogo /></div>
                    </div>

                    {/* Links */}
                    <ul className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        
                        {/* GENERAL MENU (Visible to All) */}
                        <li className="mb-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider px-4">Menu</span>
                        </li>
                        <li>
                            <Link to='/' className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg">
                                <FaHome /> Home
                            </Link>
                        </li>
                        <li>
                            <NavLink to="/dashboard" end className={navLinkClasses}>
                                <RiDashboardLine /> Dashboard Overview
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard/update-profile" className={navLinkClasses}>
                                <FaUserEdit /> Update Profile
                            </NavLink>
                        </li>

                        {/* === USER TOOLS (ONLY for 'user') === */}
                        {role === 'user' && (
                            <>
                                <li className="mt-6 mb-2">
                                    <span className="text-xs font-bold text-green-600 uppercase tracking-wider px-4">User Tools</span>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/myParcels" className={navLinkClasses}>
                                        <FaBox /> My Parcels
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/payment-history" className={navLinkClasses}>
                                        <FaCreditCard /> Payment History
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/track_parcel" className={navLinkClasses}>
                                        <FaSearchLocation /> Track Package
                                    </NavLink>
                                </li>
                            </>
                        )}

                        {/* === RIDER TOOLS (ONLY for 'rider') === */}
                        {role === 'rider' && (
                            <>
                                <li className="mt-6 mb-2">
                                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider px-4">Rider Zone</span>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/pending-deliveries" className={navLinkClasses}>
                                        <FaTasks /> My Delivery Tasks
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/completed-deliveries" className={navLinkClasses}>
                                        <FaCheckCircle /> Completed Jobs
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/my-earnings" className={navLinkClasses}>
                                        <FaWallet /> My Earnings
                                    </NavLink>
                                </li>
                            </>
                        )}

                        {/* === ADMIN TOOLS (ONLY for 'admin') === */}
                        {role === 'admin' && (
                            <>
                                <li className="mt-6 mb-2">
                                    <span className="text-xs font-bold text-red-500 uppercase tracking-wider px-4">Admin Control</span>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/active-riders" className={navLinkClasses}>
                                        <RiMotorbikeFill /> Manage Riders
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/pending-riders" className={navLinkClasses}>
                                        <RiMotorbikeFill className="text-red-500" /> Verify Applications
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/assignRider" className={navLinkClasses}>
                                        <RiMotorbikeFill className="text-yellow-600" /> Assign Rider
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/make-Admin" className={navLinkClasses}>
                                        <FaUserShield /> User Roles
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/deactive_riders" className={navLinkClasses}>
                                        <FaUserSlash className="text-gray-600" /> Deactivated Riders
                                    </NavLink>
                                </li>
                            </>
                        )}
                    </ul>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                        <button 
                            onClick={logOut}
                            className="flex w-full items-center gap-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all font-medium"
                        >
                            <FaSignOutAlt /> Logout
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DashBoardLayout;