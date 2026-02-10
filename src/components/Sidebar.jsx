import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Compass, PlaySquare, Film, User } from 'lucide-react';
import subscriptionService from '@/api/subscription.service';
import { useSelector } from 'react-redux';
import { Separator } from './ui/separator';

const SidebarItem = ({ icon: Icon, label, path, isCollapsed, avatar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <div
      onClick={() => navigate(path)}
      className={`
        flex items-center cursor-pointer rounded-xl transition-colors
        ${!isCollapsed ? 'px-3 py-2 gap-5 mx-2' : 'flex-col py-3 gap-1 justify-center'}
        ${isActive ? 'bg-secondary font-bold' : 'hover:bg-secondary/80'}
      `}
    >
      {avatar ? (
        <img src={avatar} alt={label} className="w-6 h-6 rounded-full object-cover" />
      ) : (
        <Icon className={`w-6 h-6 ${isActive ? 'text-primary' : 'text-foreground'}`} />
        
      )}
      <span className={`${!isCollapsed ? 'text-sm' : 'text-[10px]'} truncate w-full`}>
        {label}
      </span>
    </div>
  );
};

const Sidebar = ({ isCollapsed }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const userData = useSelector(state => state.auth.userData);
  
  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Compass, label: 'Explore', path: '/explore' },
    { icon: Film, label: 'Shorts', path: '/shorts' },
    { icon: PlaySquare, label: 'Subscriptions', path: '/subscriptions' },
  ];

  useEffect(() => {
    const fetchSubs = async () => {
      if (userData?._id || userData?.user?._id) {
        try {
          // Adjust the ID access based on your specific userData structure
          const userId = userData?._id || userData?.user?._id;
          console.log("Fetching subscriptions for user ID:", userId);
          const response = await subscriptionService.getSubscribedChannels(userId);
          console.log("Fetched subscriptions:", response);
          // Assuming response.data contains the list of channels
          setSubscriptions(response || []);
        } catch (error) {
          console.error("Error fetching subscriptions:", error);
        }
      }
    };
    fetchSubs();
  }, [userData]);

  return (
    <aside 
      className={`
        hidden md:flex flex-col border-r border-border bg-background transition-all duration-300
        ${!isCollapsed ? 'w-64' : 'w-20'}
      `}
    >
      <div className="py-2 space-y-1">
        {menuItems.map((item) => (
          <SidebarItem key={item.path} {...item} isCollapsed={isCollapsed} />
        ))}
      </div>

      {userData && (
        <>
          <Separator className="my-2" />
          <div className="flex-1 overflow-y-auto py-2">
            <h2 className={`px-5 py-2 text-sm font-bold ${isCollapsed ? 'hidden' : ''}`}>
              Subscriptions
            </h2>
            <div className="space-y-1">
              {subscriptions.length > 0 ? (
                subscriptions.map((sub) => (
                  <SidebarItem 
                    key={sub._id}
                    label={sub?.fullName || "Channel"}
                    avatar={sub?.avatar}
                    path={`/channel/${sub?.username}`}
                    isCollapsed={isCollapsed}
                  />
                ))
              ) : (
                <p className={`px-5 text-xs text-muted-foreground ${isCollapsed ? 'hidden' : ''}`}>
                  No subscriptions yet
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;