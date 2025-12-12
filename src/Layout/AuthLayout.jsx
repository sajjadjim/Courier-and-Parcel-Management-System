import React from 'react';
import { Outlet } from 'react-router';
import FastestDelivarylogo from '../Shared/WebsiteLogo/FastestDelivarylogo';

const AuthLayout = () => {
    return (
        <div className="flex items-center justify-center min-h-screen ">
            <div className="flex flex-col md:flex-row w-full  gap-6  justify-center rounded-lg">
                <div className="w-full  flex flex-col items-center">
                    <div className="">
                       
                    </div>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;