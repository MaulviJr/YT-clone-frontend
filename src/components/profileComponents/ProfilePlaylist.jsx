import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Loader2, ListVideo, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import playlistServiceInstance from '@/api/playlist.service';
import { useSelector } from 'react-redux';

export default function ProfilePlaylist() {
  const { channelInfo } = useOutletContext();
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);
  const isOwnProfile = channelInfo?._id === userData?.user?._id;

  const fetchPlaylists = async () => {
    if (!channelInfo?._id) return;
    try {
      setIsLoading(true);
      const data = await playlistServiceInstance.getUserPlaylists(channelInfo._id);
      setPlaylists(data || []);
    } catch (err) {
      if (err?.statusCode === 404) {
        setPlaylists([]);
      } else {
        console.error('Failed to fetch playlists:', err);
        setError('Could not load playlists.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, [channelInfo?._id]);

  const handleDelete = async (playlistId) => {
    try {
      await playlistServiceInstance.deletePlaylist(playlistId);
      setPlaylists((prev) => prev.filter((p) => p._id !== playlistId));
    } catch (err) {
      console.error('Failed to delete playlist:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="h-9 w-9 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading playlists...</p>
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

  if (playlists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground">
        <ListVideo size={48} strokeWidth={1.5} />
        <p className="text-lg font-medium">No playlists yet</p>
        <p className="text-sm">Playlists created by this channel will appear here.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-6">Playlists</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {playlists.map((playlist, index) => (
          <motion.div
            key={playlist._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div
              onClick={() => navigate(`/playlist/${playlist._id}`)}
              className="group cursor-pointer rounded-xl border transition-all overflow-hidden border-border hover:border-muted-foreground/30 bg-secondary/20 hover:bg-secondary/40"
            >
              {/* Playlist Thumbnail Stack */}
              <div className="relative aspect-video bg-secondary flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                <ListVideo size={36} className="text-muted-foreground/50" />
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-2 py-0.5 rounded">
                  {playlist.videos?.length || 0} videos
                </div>
              </div>

              {/* Info */}
              <div className="p-3 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold line-clamp-1">{playlist.name}</h4>
                  {isOwnProfile && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(playlist._id);
                      }}
                      className="shrink-0 text-muted-foreground hover:text-destructive transition-colors p-0.5"
                      title="Delete playlist"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{playlist.description}</p>
                <p className="text-[11px] text-muted-foreground/70">
                  {new Date(playlist.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}