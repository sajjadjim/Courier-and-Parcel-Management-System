import React from "react";
import Marquee from 'react-fast-marquee';

// Replace these with your correct image paths
import amazon from '../../../../public/brands/amazon.png';
import google from '../../../../public/brands/amazon_vector.png';
import casio from '../../../../public/brands/casio.png';
import moonstar from '../../../../public/brands/moonstar.png';
import start from '../../../../public/brands/start.png';
import randstad from '../../../../public/brands/start-people 1.png';
import people from '../../../../public/brands/randstad.png';

const logos = [
    { src: amazon, alt: "Amazon" },
    { src: google, alt: "Google" },
    { src: casio, alt: "Casio" },
    { src: moonstar, alt: "Moonstar" },
    { src: start, alt: "Start" },
    { src: randstad, alt: "Randstad" },
    { src: people, alt: "People" },
];

const ClientLogoMarquee = () => {
  return (
    <section className="py-16 bg-white border-y border-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="text-center mb-10">
            <span className="text-blue-600 font-bold tracking-widest uppercase text-xs">Our Partners</span>
            <div className="text-slate-500 mt-2 text-sm font-medium">
                Trusted by 500+ fast-growing businesses for their logistics needs
            </div>
        </div>

        {/* Marquee Container with Gradient Fades */}
        <div className="relative">
            
            {/* Left Gradient Fade */}
            <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            
            <Marquee 
                pauseOnHover={true} 
                speed={40} 
                gradient={false} 
                className="py-4 overflow-hidden"
            >
                {/* Adding a wrapper fragment to ensure stability */}
                {logos.map((logo, idx) => (
                    <div 
                        key={`logo-${idx}`} 
                        className="mx-8 md:mx-16 group flex items-center justify-center cursor-pointer"
                    >
                        <img 
                            src={logo.src} 
                            alt={logo.alt} 
                            className="h-8 md:h-12 w-auto object-contain grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 ease-in-out transform group-hover:scale-110" 
                        />
                    </div>
                ))}
            </Marquee>

            {/* Right Gradient Fade */}
            <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
        </div>

      </div>
    </section>
  );
};

export default ClientLogoMarquee;