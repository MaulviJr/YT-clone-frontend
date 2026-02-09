import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LogOut, Play, Search, User, Menu, Bell, Video, X } from 'lucide-react';
import { logout } from '@/store/authSlice.js';
import authService from '@/api/auth.service';
/**
 * Header Component
 * Optimized to use the custom YouTube theme variables provided in the CSS.
 * This version ensures all dependencies are correctly handled for the environment.
 */

// Local Button component using your theme variables to ensure independent rendering
const HeaderButton = ({ children, onClick, variant = "primary", className = "", size = "md" }) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors rounded-full focus:outline-none disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-primary text-primary-foreground hover:opacity-90",
    outline: "border border-border text-foreground hover:bg-secondary",
    ghost: "text-foreground hover:bg-secondary",
    destructive: "border border-destructive text-destructive hover:bg-destructive/10"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    icon: "w-8 h-8 p-2",
  };

  return (
    <button 
      onClick={onClick} 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Accessing auth state safely from Redux
  const authUser = useSelector((state) => state.auth?.userData);
  const authStatus = useSelector((state) => state.auth?.status);
    console.log("from header: ", authUser.user);


  const handleLogout = async () => {
    try {
      // 1. Call backend logout to clear cookies/session
      await authService.logout();
    } catch (err) {
      console.error("Logout API failed, but clearing local state anyway:", err);
    } finally {
      // 2. Clear local Redux store regardless of API success for security
      dispatch(logout());
      // 3. Navigate to login
      navigate("/login");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      // Logic to navigate to search results or filter video list
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
        
        {/* Left: Logo & Branding */}
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg group-hover:scale-105 transition-transform">
            <Play className="w-5 h-5 fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground hidden sm:inline-block">TubeClone</span>
        </div>

        {/* Center: Search Bar */}
        <form 
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-2xl mx-8"
        >
           <div className="relative w-full flex items-center">
              <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search videos..."
                  className="w-full bg-secondary/50 text-foreground pl-10 pr-10 py-2.5 rounded-l-full border border-border focus:border-primary focus:outline-none transition-all text-sm placeholder:text-muted-foreground"
                />
                {searchQuery && (
                  <X 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" 
                  />
                )}
              </div>
              <button 
                type="submit"
                className="bg-secondary border border-l-0 border-border px-5 py-2.5 rounded-r-full hover:bg-muted transition-colors"
              >
                <Search className="h-4 w-4 text-foreground" />
              </button>
           </div>
        </form>

        {/* Right: User Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {authStatus || authUser ? (
            <>
              {/* <div className="hidden sm:flex items-center gap-1 mr-2">
                <HeaderButton variant="ghost" className="p-2 h-10 w-10">
                  <Video className="h-5 w-5" />
                </HeaderButton>
                <HeaderButton variant="ghost" className="p-2 h-10 w-10">
                  <Bell className="h-5 w-5" />
                </HeaderButton>
              </div> */}

                 <div className="hidden sm:flex items-center gap-1 mr-2">
                <HeaderButton variant="ghost" className="icon">
                  <Video className="h-5 w-5" />
                </HeaderButton>
                <HeaderButton variant="ghost" className="icon">
                  <Bell className="h-5 w-5" />
                </HeaderButton>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right hidden lg:block">
                  <p className="text-sm font-medium text-foreground">@{authUser?.user?.username || 'User'} </p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Your Channel</p>
                </div>
                <div className="relative group cursor-pointer">
                  <img 
                    src={authUser?.user?.avatar || 'https://github.com/shadcn.png'} 
                    alt="User profile" 
                    className="w-9 h-9 rounded-full border border-border object-cover group-hover:ring-2 group-hover:ring-primary transition-all"
                  />
                </div>
              </div>
              
              <HeaderButton 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="ml-2 hidden xs:flex hover:text-destructive hover:border-destructive"
              >
                <LogOut className="mr-2 h-3.5 w-3.5" />
                Logout
              </HeaderButton>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <HeaderButton variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Sign In
              </HeaderButton>
              <HeaderButton size="sm" onClick={() => navigate('/signup')}>
                Sign Up
              </HeaderButton>
            </div>
          )}
          
          {/* Mobile Menu Toggle (Visual only) */}
          <HeaderButton variant="ghost" className="md:hidden p-2">
            <Menu className="h-6 w-6" />
          </HeaderButton>
        </div>
      </div>
    </header>
  );
};

export default Header;