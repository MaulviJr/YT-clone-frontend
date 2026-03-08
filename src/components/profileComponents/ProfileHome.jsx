


import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Loader2, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import videoService from '@/api/video.service';
import VideoCard from '@/components/VideoCard';

export default function ProfileHome() {
  const { channelInfo } = useOutletContext();
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChannelVideos = async () => {
      if (!channelInfo?._id) return;
      try {
        console.log(channelInfo);
        setIsLoading(true);
        const data = await videoService.fetchVideos({
          userId: channelInfo._id,
          sortBy: 'createdAt',
          sortType: 'desc',
          limit: 12,
        });
        console.log('Fetched channel videos:', data);
        setVideos(data || []);
      } catch (err) {
        console.error('Failed to fetch channel videos:', err);
        setError('Could not load videos.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChannelVideos();
  }, [channelInfo?._id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="h-9 w-9 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading videos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground">
        <PlayCircle size={48} strokeWidth={1.5} />
        <p className="text-lg font-medium">No videos uploaded yet</p>
        <p className="text-sm">Videos published by this channel will appear here.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Latest Video Feature Section */}
      {videos.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Latest</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
            {videos.slice(0, 1).map((video, index) => (
              <VideoCard key={video._id} video={video} index={index} />
            ))}
          </div>
        </motion.div>
      )}

      {/* All Videos Grid */}
      {videos.length > 1 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Videos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
            {videos.slice(1).map((video, index) => (
              <VideoCard key={video._id} video={video} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}