import React from 'react';
import FastestDelivarylogo from '../../Shared/WebsiteLogo/FastestDelivarylogo';
import { FaFacebook, FaLinkedin, FaInstagram, FaTwitter } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { Link } from 'react-router';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 font-sans">
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: Brand & Contact */}
          <div className="space-y-6">
            <div className="scale-100 origin-left brightness-0 invert">
               {/* Invert brightness to make logo white on dark background if it's an image */}
               <FastestDelivarylogo />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Fastest Product Delivery Ltd. is the leading logistics partner for modern businesses. We ensure your parcels arrive safe, secure, and on time, every time.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <MdLocationOn className="text-blue-500 text-lg" />
                <span>Mirpur 10, Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <MdPhone className="text-blue-500 text-lg" />
                <span>+880 1234-567890</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <MdEmail className="text-blue-500 text-lg" />
                <span>support@fastestdelivery.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
              Our Services
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-blue-600 rounded-full"></span>
            </h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Same Day Delivery</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Inter-District Courier</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Warehouse Storage</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Corporate Logistics</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">E-commerce Solutions</a></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
              Company
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-blue-600 rounded-full"></span>
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-blue-400 transition-colors">Careers</Link></li>
              <li><Link to="/pricing" className="hover:text-blue-400 transition-colors">Pricing Plans</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contact Support</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Subscribe</h3>
            <p className="text-slate-400 text-sm mb-4">
              Join our newsletter to stay updated on new features and shipping discounts.
            </p>
            <div className="form-control">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Enter your email" 
                  className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 text-sm" 
                />
                <button className="absolute right-1 top-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-xs font-bold uppercase transition-all">
                  Join
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar: Copyright & Socials */}
      <div className="border-t border-slate-800 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          
          <p className="text-slate-500 text-sm text-center md:text-left">
            Copyright © {new Date().getFullYear()} <span className="text-blue-500 font-semibold">Fastest Delivery Ltd</span>. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
             <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300">
                <FaFacebook size={18} />
             </a>
             <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-sky-500 hover:text-white transition-all duration-300">
                <FaTwitter size={18} />
             </a>
             <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-pink-600 hover:text-white transition-all duration-300">
                <FaInstagram size={18} />
             </a>
             <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-700 hover:text-white transition-all duration-300">
                <FaLinkedin size={18} />
             </a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;