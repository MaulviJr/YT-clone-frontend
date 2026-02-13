import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import { LogOut, Play, Search, Menu, Bell, Video, X } from 'lucide-react';
import { logout } from '@/store/authSlice.js';
import authService from '@/api/auth.service';

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
    icon: "w-10 h-10 p-2",
  };

  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  );
};

const Header = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get current path
  const [searchQuery, setSearchQuery] = useState("");
  
  const authUser = useSelector((state) => state.auth?.userData);
  const authStatus = useSelector((state) => state.auth?.status);

  // Define paths where the search and user actions should be hidden
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout API failed, clearing local state anyway:", err);
    } finally {
      dispatch(logout());
      navigate("/login");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4">
        
        {/* Left: Menu Toggle & Logo (Always Visible) */}
        <div className="flex items-center gap-2 md:gap-4">
          <HeaderButton 
            variant="ghost" 
            size="icon" 
            onClick={onMenuClick} 
            className="hover:bg-secondary"
          >
            <Menu className="h-6 w-6 text-foreground" />
          </HeaderButton>

          <div onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer group">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg group-hover:scale-105 transition-transform">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground hidden sm:inline-block">TubeClone</span>
          </div>
        </div>

        {/* Center: Search Bar - HIDDEN on Auth Pages */}
        {!isAuthPage && (
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-8">
             <div className="relative w-full flex items-center">
                <div className="relative flex-1 group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search"
                    className="w-full bg-secondary/30 text-foreground pl-10 pr-10 py-2 rounded-l-full border border-border focus:border-primary focus:outline-none transition-all text-sm placeholder:text-muted-foreground"
                  />
                  {searchQuery && (
                    <X onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" />
                  )}
                </div>
                <button type="submit" className="bg-secondary/50 border border-l-0 border-border px-5 py-2 rounded-r-full hover:bg-muted transition-colors">
                  <Search className="h-4 w-4 text-foreground" />
                </button>
             </div>
          </form>
        )}

        {/* Right: User Actions - HIDDEN on Auth Pages */}
        <div className="flex items-center gap-1 md:gap-3">
          {!isAuthPage && (
            <>
              {authStatus || authUser ? (
                <>
                  <div className="flex items-center gap-1">
                    <HeaderButton variant="ghost" size="icon"><Video className="h-5 w-5" /></HeaderButton>
                    <HeaderButton variant="ghost" size="icon"><Bell className="h-5 w-5" /></HeaderButton>
                  </div>
                  <div className="flex items-center gap-3 ml-2">
                    <div className="relative group cursor-pointer" onClick={() => navigate(`/profile/${authUser?.user?.username}`)}>
                      {/* {  console.log("I am above avatar of authUser",authUser)} */}
                      <img 
                        src={authUser?.user?.avatar} 
                        alt="User profile" 
                        className="w-8 h-8 rounded-full border border-border object-cover group-hover:ring-2 group-hover:ring-primary transition-all"
                      />
                    </div>
                  </div>
                  <HeaderButton variant="ghost" size="sm" onClick={handleLogout} className="ml-2 hidden sm:flex text-muted-foreground hover:text-destructive">
                    <LogOut className="h-4 w-4" />
                  </HeaderButton>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <HeaderButton variant="ghost" size="sm" onClick={() => navigate('/login')}>Sign In</HeaderButton>
                  <HeaderButton size="sm" onClick={() => navigate('/signup')}>Sign Up</HeaderButton>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;