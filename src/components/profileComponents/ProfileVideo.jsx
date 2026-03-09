import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Loader2, PlayCircle } from 'lucide-react';
import videoService from '@/api/video.service';
import VideoCard from '@/components/VideoCard';

export default function ProfileVideo() {
  const { channelInfo } = useOutletContext();
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChannelVideos = async () => {
      if (!channelInfo?._id) return;
      try {
        setIsLoading(true);
        setError(null);

        const data = await videoService.fetchVideos({
          userId: channelInfo._id,
          sortBy: 'createdAt',
          sortType: 'asc',
          limit: 50,
        });

        setVideos(data || []);
      } catch (err) {
        console.error('Failed to fetch profile videos:', err);
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
        <p className="text-sm">Videos will appear here in upload order.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-4">Videos</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
        {videos.map((video, index) => (
          <VideoCard key={video._id} video={video} index={index} />
        ))}
      </div>
    </div>
  );
}