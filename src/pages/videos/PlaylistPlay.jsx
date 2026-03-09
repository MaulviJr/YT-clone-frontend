import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Loader2, ListVideo, Play, CheckCircle2 } from 'lucide-react';
import playlistServiceInstance from '@/api/playlist.service';
import videoService from '@/api/video.service';

export default function PlaylistPlay() {
  const { playlistId } = useParams();

  const [playlist, setPlaylist] = useState(null);
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlaylistData = async () => {
      if (!playlistId) return;

      try {
        setIsLoading(true);
        setError('');

        const playlistData = await playlistServiceInstance.getPlaylistById(playlistId);
        setPlaylist(playlistData);

        const videoRefs = playlistData?.videos || [];
        if (videoRefs.length === 0) {
          setVideos([]);
          setCurrentIndex(0);
          return;
        }

        const videoDetails = await Promise.all(
          videoRefs.map(async (videoRef) => {
            const id = typeof videoRef === 'string' ? videoRef : videoRef?._id;
            if (!id) return null;
            try {
              return await videoService.getVideoById(id);
            } catch {
              return null;
            }
          })
        );

        const validVideos = videoDetails.filter(Boolean);
        setVideos(validVideos);
        setCurrentIndex(0);
      } catch (err) {
        console.error('Failed to load playlist page:', err);
        setError('Could not load this playlist.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylistData();
    window.scrollTo(0, 0);
  }, [playlistId]);

  const currentVideo = useMemo(() => videos[currentIndex] || null, [videos, currentIndex]);

  useEffect(() => {
    if (!currentVideo?._id) return;
    videoService.updateVideoViews(currentVideo._id).catch(() => {});
  }, [currentVideo?._id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-muted-foreground">{error}</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 px-4 md:px-6 lg:px-10 py-6 bg-background min-h-screen">
      <div className="flex-1 max-w-full lg:max-w-[calc(100%-420px)]">
        {currentVideo ? (
          <>
            <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-lg">
              <video
                src={currentVideo.videoFile}
                controls
                autoPlay
                className="w-full h-full"
                poster={currentVideo.thumbnail}
              />
            </div>

            <h1 className="text-xl md:text-2xl font-bold mt-4 text-foreground line-clamp-2">
              {currentVideo.title}
            </h1>

            <div className="mt-3 p-3 rounded-xl bg-secondary/50 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground mb-1">{playlist?.name}</p>
              <p className="line-clamp-3">{playlist?.description}</p>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <Link to={`/profile/${currentVideo.owner?.username}`} className="flex items-center gap-3">
                <img
                  src={currentVideo.owner?.avatar || 'https://github.com/shadcn.png'}
                  alt="owner"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-sm truncate">
                      {currentVideo.owner?.fullName || currentVideo.owner?.username}
                    </span>
                    <CheckCircle2 size={13} className="text-muted-foreground fill-current" />
                  </div>
                  <span className="text-xs text-muted-foreground">@{currentVideo.owner?.username}</span>
                </div>
              </Link>
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-border p-8 text-center text-muted-foreground">
            This playlist has no playable videos.
          </div>
        )}
      </div>

      <div className="w-full lg:w-[420px] shrink-0">
        <div className="border border-border rounded-xl overflow-hidden bg-secondary/20">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-foreground line-clamp-1">{playlist?.name || 'Playlist'}</h2>
            <p className="text-xs text-muted-foreground mt-1">
              {videos.length} video{videos.length !== 1 ? 's' : ''}
            </p>
          </div>

          {videos.length === 0 ? (
            <div className="p-8 flex flex-col items-center text-muted-foreground gap-2">
              <ListVideo size={30} strokeWidth={1.5} />
              <p className="text-sm">No videos to show</p>
            </div>
          ) : (
            <div className="max-h-[72vh] overflow-y-auto divide-y divide-border">
              {videos.map((video, index) => (
                <button
                  key={video._id}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-full text-left p-3 flex gap-3 transition-colors ${
                    index === currentIndex
                      ? 'bg-primary/10'
                      : 'hover:bg-secondary/60'
                  }`}
                >
                  <div className="relative w-32 aspect-video rounded-md overflow-hidden bg-secondary shrink-0">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                    {index === currentIndex && (
                      <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                        <Play size={16} className="text-white fill-current" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium line-clamp-2 text-foreground">{video.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {video.owner?.fullName || video.owner?.username}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}