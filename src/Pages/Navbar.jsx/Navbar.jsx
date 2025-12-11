import React, { useContext, useState, useEffect } from 'react';
// FIX: Must use 'react-router-dom' for web apps
import { NavLink, Link, useNavigate } from 'react-router'; 
import FastestDelivarylogo from '../../Shared/WebsiteLogo/FastestDelivarylogo';
import { AuthContext } from '../../Context/AuthContext';
import { FaBars, FaUserCircle, FaSignOutAlt, FaTachometerAlt, FaBell } from "react-icons/fa";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext); 
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  const handleLogOut = async () => {
    await logOut();
    navigate('/login');
  };

  // Scroll effect detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Professional Navigation Link Style
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 h-10 ${
      isActive
        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
        : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
    }`;

  // Menu Items (Reusable)
  const navItems = (
    <>
      <li><NavLink to='/' className={navLinkClass}>Home</NavLink></li>
      <li><NavLink to='/addparcel' className={navLinkClass}>Send Parcel</NavLink></li>
      <li><NavLink to='/beARider' className={navLinkClass}>Be A Rider</NavLink></li>
      <li><NavLink to='/coverage' className={navLinkClass}>Coverage</NavLink></li>
    </>
  );

  return (
    <div 
      className={`navbar fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled 
        ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 py-2 h-16" 
        : "bg-transparent py-4 h-20"
      }`}
    >
      <div className="max-w-7xl mx-auto w-full px-4 lg:px-8 h-full flex items-center justify-between">
        
        {/* === LEFT: Mobile Toggle & Logo === */}
        <div className="flex items-center gap-2">
          {/* Mobile Menu Dropdown */}
          <div className="dropdown lg:hidden">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle text-slate-600 hover:bg-slate-100 flex items-center justify-center">
              <FaBars size={22} />
            </div>
            <ul 
              tabIndex={0} 
              className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-2xl bg-white rounded-2xl w-64 border border-gray-100"
            >
              {navItems}
              {user && (
                 <li>
                   <NavLink to='/dashboard' className="flex items-center gap-2 px-4 py-3 mt-2 text-slate-600 font-semibold bg-gray-50 rounded-xl hover:bg-blue-50 hover:text-blue-600">
                     <FaTachometerAlt /> Dashboard
                   </NavLink>
                 </li>
              )}
            </ul>
          </div>
          
          {/* LOGO - Added 'flex' to ensure it centers vertically */}
          <div className="hover:opacity-90 transition-opacity flex items-center">
             <FastestDelivarylogo />
          </div>
        </div>

        {/* === CENTER: Desktop Navigation === */}
        <div className="hidden lg:flex items-center">
          <ul className="flex items-center gap-1 bg-white/50 px-2 py-1 rounded-full backdrop-blur-sm border border-white/20">
            {navItems}
          </ul>
        </div>

        {/* === RIGHT: Actions === */}
        <div className="flex items-center gap-3">
          
          {user ? (
            <div className="flex items-center gap-3 md:gap-5">
              
              {/* Notification Bell */}
              <button className="btn btn-ghost btn-circle btn-sm text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all hidden md:flex items-center justify-center relative group">
                <div className="indicator">
                  <FaBell size={20} />
                  <span className="badge badge-xs badge-error indicator-item border-white animate-pulse"></span>
                </div>
              </button>

              {/* User Dropdown */}
              <div className="dropdown dropdown-end">
                <div 
                  tabIndex={0} 
                  role="button" 
                  className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200 cursor-pointer group"
                >
                  
                  {/* Name & Role text */}
                  <div className="text-right hidden md:block">
                    <p className="text-sm font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                      {user?.displayName?.split(" ")[0] || "User"}
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">
                      Member
                    </p>
                  </div>

                  {/* Profile Image */}
                  <div className="avatar flex items-center">
                    <div className="w-10 h-10 rounded-full ring-2 ring-white ring-offset-2 ring-offset-blue-100 group-hover:ring-blue-500 transition-all shadow-sm">
                      {user?.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="object-cover" />
                      ) : (
                        <FaUserCircle className="w-full h-full text-slate-300 bg-slate-50" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Dropdown Menu Content */}
                <ul 
                  tabIndex={0} 
                  className="menu menu-sm dropdown-content mt-4 z-[1] p-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] bg-white rounded-2xl w-64 border border-gray-100"
                >
                  {/* User Header in Dropdown */}
                  <li className="px-4 py-3 border-b border-gray-50 mb-2 pointer-events-none">
                    <div>
                      <p className="font-bold text-slate-800 text-base">{user?.displayName || "User"}</p>
                      <p className="text-xs text-slate-400 truncate w-full">{user?.email}</p>
                    </div>
                  </li>
                  
                  <li>
                    <Link to="/dashboard" className="flex items-center gap-3 py-3 px-4 text-slate-600 font-medium hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                      <FaTachometerAlt className="text-blue-500" /> Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard/update-profile" className="flex items-center gap-3 py-3 px-4 text-slate-600 font-medium hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all">
                      <FaUserCircle className="text-purple-500" /> Edit Profile
                    </Link>
                  </li>
                  
                  <div className="h-px bg-gray-100 my-2 mx-2"></div>
                  
                  <li>
                    <button 
                      onClick={handleLogOut} 
                      className="flex items-center gap-3 py-3 px-4 text-red-500 font-medium hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                    >
                      <FaSignOutAlt /> Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            /* Login / Register Buttons */
            <div className="flex items-center gap-3 h-full">
              <Link 
                to='/login' 
                className="hidden md:flex items-center px-6 py-2.5 rounded-full text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all h-10"
              >
                Log In
              </Link>
              <Link 
                to='/register' 
                className="flex items-center px-6 py-2.5 rounded-full text-sm font-bold bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:bg-blue-700 hover:-translate-y-0.5 transition-all h-10"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;