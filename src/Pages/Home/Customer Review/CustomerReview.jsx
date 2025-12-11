import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { FaQuoteLeft, FaStar } from "react-icons/fa";

import 'swiper/css';
import 'swiper/css/pagination';
import './styles.css'; 

const testimonials = [
    {
        name: 'Awlad Hossin',
        role: 'Senior Product Designer',
        text: 'The tracking feature is absolutely top-notch. I can see exactly where my package is at every step. Highly recommended for professionals.',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop',
    },
    {
        name: 'Jannatul Ferdous',
        role: 'UX Researcher',
        text: 'I send documents across the city daily. The riders are always polite, punctual, and the parcels arrive in perfect condition.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    },
    {
        name: 'Nasir Uddin',
        role: 'CEO, TechFlow',
        text: 'We switched our company logistics to this service last month. The dashboard for managing bulk orders is a game-changer.',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
    },
    {
        name: 'Sadia Afrin',
        role: 'Small Business Owner',
        text: 'Fast, reliable, and affordable. My customers are happy because they get their deliveries on time, every time.',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop',
    },
    {
        name: 'Tanvir Alam',
        role: 'Product Manager',
        text: 'The "Secure Delivery" promise is real. I sent fragile electronics and they handled it with extreme care. 5 stars!',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    },
    {
        name: 'Sajjad Hossain Jim',
        role: 'UI Designer',
        text: 'Beautiful interface and very easy to book a rider. The user experience is smooth from start to finish.',
        avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&auto=format&fit=crop',
    },
];

// Helper to render stars
const StarRating = () => (
    <div className="flex text-yellow-400 gap-1 mb-4 text-sm">
        {[...Array(5)].map((_, i) => <FaStar key={i} />)}
    </div>
);

export default function CustomerReviewSwiper() {
    return (
        <section className="py-20 bg-slate-50 font-sans">
            <div className="max-w-7xl mx-auto px-4">
                
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Testimonials</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2 mb-4">
                        Trusted by Thousands
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                        Don't just take our word for it. Here is what our customers have to say about their delivery experience.
                    </p>
                </div>

                {/* Slider */}
                <Swiper
                    slidesPerView={1}
                    spaceBetween={30}
                    loop={true}
                    pagination={{ 
                        clickable: true,
                        dynamicBullets: true 
                    }}
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                    }}
                    modules={[Pagination, Autoplay]}
                    className="pb-16" // Padding bottom for pagination dots
                    breakpoints={{
                        640: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                >
                    {testimonials.map((item, index) => (
                        <SwiperSlide key={index} className="h-full">
                            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 h-full flex flex-col hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group">
                                
                                {/* Decorative Icon */}
                                <FaQuoteLeft className="absolute top-6 right-6 text-blue-100 text-6xl opacity-50 group-hover:text-blue-50 transition-colors" />

                                <StarRating />

                                <p className="text-slate-600 leading-relaxed mb-8 flex-grow relative z-10">
                                    "{item.text}"
                                </p>

                                <div className="flex items-center gap-4 mt-auto border-t border-gray-100 pt-6">
                                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-blue-50">
                                        <img
                                            src={item.avatar}
                                            alt={item.name}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                                        <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">{item.role}</p>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}