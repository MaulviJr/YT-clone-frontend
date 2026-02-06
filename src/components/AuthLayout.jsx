import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

/**
 * AuthLayout acts as a protection layer for routes.
 * @param {boolean} authentication - If true, protects the route for logged-in users. 
 * If false, protects the route for logged-out users (like Login/Signup).
 */
export default function AuthLayout({ children, authentication = true }) {
    const navigate = useNavigate();
    const [loader, setLoader] = useState(true);
    const authStatus = useSelector((state) => state.auth.status);

    useEffect(() => {
        // Logic breakdown:
        // 1. If the route requires auth (authentication=true) but user is not logged in (authStatus=false)
        console.log("AuthLayout :: useEffect :: authStatus =", authStatus, "authentication =", authentication);
        if (authentication && authStatus !== authentication) {
            console.log("I am here");
            navigate("/login");
        } 
        // 2. If the route is for public-only (authentication=false, e.g. Login page) 
        // but user is already logged in (authStatus=true)
        else if (!authentication && authStatus !== authentication) {
               console.log("I am here");
            navigate("/");
        }
        
        setLoader(false);
    }, [authStatus, navigate, authentication]);

    return loader ? (
        <div className="h-screen w-full flex items-center justify-center bg-[#0f0f0f]">
             <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-600"></div>
        </div>
    ) : (
        <>{children}</>
    );
}