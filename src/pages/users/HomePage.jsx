import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, LogOut, User } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Fixed relative imports to ensure they resolve correctly in all environments
import { fetchVideos } from '@/store/videoSlice';
import { logout } from '@/store/authSlice';
import authService from '@/api/auth.service';
import VideoCard from '../../components/VideoCard';

// Using standard shadcn components as requested
import { Button } from "@/components/ui/button";

const mockVideos = [
  {
    _id: '1',
    title: 'Building a Full Stack App with React and Node.js - Complete Tutorial',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop',
    duration: 3720,
    views: 152000,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    owner: {
      _id: 'user1',
      username: 'techcreator',
      fullName: 'Tech Creator',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    },
  },
  {
    _id: '2',
    title: 'Learn TypeScript in 2024 - The Complete Guide for Beginners',
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=450&fit=crop',
    duration: 5400,
    views: 89000,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    owner: {
      _id: 'user2',
      username: 'codingmaster',
      fullName: 'Coding Master',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
  },
  {
    _id: '3',
    title: 'Next.js 14 - Server Actions and App Router Deep Dive',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop',
    duration: 2100,
    views: 45000,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    owner: {
      _id: 'user3',
      username: 'webdevpro',
      fullName: 'Web Dev Pro',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    },
  }
];

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Accessing both video and auth state
  const { videos, isLoading, error } = useSelector((state) => state.videos || { videos: [], isLoading: false, error: null });
  const authUser = useSelector((state) => state.auth.userData);

  useEffect(() => {
    // Only attempt fetch if the action exists in your store
    if (dispatch && fetchVideos) {
      dispatch(fetchVideos({}));
    }
  }, [dispatch]);

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

  const displayVideos = videos && videos.length > 0 ? videos : mockVideos;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8 max-w-[1440px] mx-auto">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
              <div className="w-4 h-4 bg-current rounded-sm" />
            </div>
            <span className="text-xl font-bold tracking-tight hidden sm:inline-block">TubeClone</span>
          </div>

          <div className="flex items-center gap-4">
            {authUser && (
              <div className="flex items-center gap-2 mr-2">
                <img 
                  src={authUser.avatar} 
                  alt={authUser.username} 
                  className="w-8 h-8 rounded-full border border-muted"
                  onError={(e) => { e.target.src = 'https://github.com/shadcn.png' }}
                />
                <span className="text-sm font-medium hidden md:inline-block">@{authUser.username}</span>
              </div>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="rounded-full border-muted-foreground/20 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 md:px-6 py-6 max-w-[1440px] mx-auto">
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