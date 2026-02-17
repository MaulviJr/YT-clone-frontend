import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, LogOut, User } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Fixed relative imports to ensure they resolve correctly in all environments
import { getVideos } from '@/store/videoSlice.js';
import { logout } from '@/store/authSlice.js';
import authService from '@/api/auth.service.js';
import VideoCard from '../../components/VideoCard';

// Using standard shadcn components as requested
import { Button } from "@/components/ui/button";
import Header from "../../components/Header.jsx"
import Sidebar from '@/components/Sidebar';
const mockVideos = [

];

const HomePage = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  
  // Accessing both video and auth state
  const { videos, isLoading, error } = useSelector((state) => state.videos || { videos: [], isLoading: false, error: null });


  console.log("videos: ", videos)

  useEffect(() => {
    // Only attempt fetch if the action exists in your store
    
      dispatch(getVideos({}));
    
  }, [dispatch]);

  const displayVideos = videos && videos.length > 0 ? videos : mockVideos;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Header */}
    
      {/* <Header/> */}
      {/* <SideNavigation/> */}
      <main className="container px-4 md:px-6 py-6 max-w-360 mx-auto">
        {/* Category Pills */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 mb-6">
          {['All', 'React', 'JavaScript', 'TypeScript', 'Node.js', 'CSS', 'Tutorials', 'Live', 'Gaming', 'Music'].map(
            (category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  index === 0
                    ? 'bg-foreground text-background'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-transparent'
                }`}
              >
                {category}
              </motion.button>
            )
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm animate-pulse">Fetching videos...</p>
          </div>
        )}

        {/* Error / Demo Info State */}
        {!isLoading && error && (videos?.length === 0 || !videos) && (
          <div className="text-center py-8 mb-6 bg-muted/30 rounded-2xl border border-dashed border-muted-foreground/20">
            <p className="text-muted-foreground text-sm font-medium">No live connection found.</p>
            <p className="text-[11px] text-muted-foreground/60 mt-1">Displaying demo content for development purposes.</p>
          </div>
        )}

        {/* Video Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
            {displayVideos.map((video, index) => (
              <VideoCard key={video._id} video={video} index={index} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;