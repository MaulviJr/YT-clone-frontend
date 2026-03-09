import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Loader2, ListVideo, Check } from 'lucide-react';
import videoService from '@/api/video.service';
import playlistServiceInstance from '@/api/playlist.service';
import { motion } from 'framer-motion';

const CreatePlaylistDialog = ({ isOpen, onClose, channelInfo, onPlaylistCreated }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [videos, setVideos] = useState([]);
    const [selectedVideos, setSelectedVideos] = useState([]);
    const [isLoadingVideos, setIsLoadingVideos] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && channelInfo?._id) {
            fetchVideos();
        }
        if (!isOpen) {
            setName('');
            setDescription('');
            setSelectedVideos([]);
            setError(null);
        }
    }, [isOpen, channelInfo?._id]);

    const fetchVideos = async () => {
        try {
            setIsLoadingVideos(true);
            const data = await videoService.fetchVideos({
                userId: channelInfo._id,
                sortBy: 'createdAt',
                sortType: 'desc',
                limit: 50,
            });
            setVideos(data || []);
        } catch (err) {
            console.error('Failed to fetch videos:', err);
        } finally {
            setIsLoadingVideos(false);
        }
    };

    const toggleVideoSelection = (videoId) => {
        setSelectedVideos((prev) =>
            prev.includes(videoId)
                ? prev.filter((id) => id !== videoId)
                : [...prev, videoId]
        );
    };

    const handleCreate = async () => {
        if (!name.trim()) {
            setError('Playlist name is required');
            return;
        }
        if (!description.trim()) {
            setError('Playlist description is required');
            return;
        }

        try {
            setIsCreating(true);
            setError(null);

            // 1. Create the playlist
            const playlist = await playlistServiceInstance.createPlaylist({ name: name.trim(), description: description.trim() });

            // 2. Add selected videos to the playlist
            for (const videoId of selectedVideos) {
                await playlistServiceInstance.addVideoToPlaylist(playlist._id, videoId);
            }

            onPlaylistCreated?.();
            onClose();
        } catch (err) {
            console.error('Failed to create playlist:', err);
            setError(err?.message || 'Failed to create playlist');
        } finally {
            setIsCreating(false);
        }
    };

    const formatDuration = (seconds) => {
        seconds = Math.floor(seconds);
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        const parts = [h > 0 ? h : null, m, s].filter((x) => x !== null);
        return parts.map((v, i) => (i === 0 && h === 0 ? v : v.toString().padStart(2, '0'))).join(':');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="bg-background border border-border w-full max-w-4xl max-h-[85vh] rounded-2xl shadow-xl flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <ListVideo size={22} className="text-muted-foreground" />
                        <h2 className="text-xl font-bold">Create New Playlist</h2>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isCreating}
                        className="text-muted-foreground hover:text-foreground transition-colors text-xl leading-none p-1"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Left Side — Playlist Details */}
                    <div className="w-2/5 border-r border-border p-6 flex flex-col gap-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Playlist Name</label>
                            <Input
                                placeholder="Enter playlist name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={isCreating}
                            />
                        </div>
                        <div className="space-y-2 flex-1">
                            <label className="text-sm font-medium text-foreground">Description</label>
                            <textarea
                                placeholder="Describe your playlist..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={isCreating}
                                rows={5}
                                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none resize-none"
                            />
                        </div>

                        <div className="text-sm text-muted-foreground">
                            {selectedVideos.length} video{selectedVideos.length !== 1 ? 's' : ''} selected
                        </div>

                        {error && (
                            <p className="text-sm text-destructive font-medium">{error}</p>
                        )}
                    </div>

                    {/* Right Side — Video Selection */}
                    <div className="w-3/5 p-4 overflow-y-auto">
                        <p className="text-sm font-medium text-muted-foreground mb-3 px-2">
                            Select videos to add to the playlist
                        </p>

                        {isLoadingVideos ? (
                            <div className="flex flex-col items-center justify-center py-16 gap-3">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">Loading videos...</p>
                            </div>
                        ) : videos.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
                                <ListVideo size={40} strokeWidth={1.5} />
                                <p className="text-sm">No videos found</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {videos.map((video) => {
                                    const isSelected = selectedVideos.includes(video._id);
                                    return (
                                        <div
                                            key={video._id}
                                            onClick={() => !isCreating && toggleVideoSelection(video._id)}
                                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                                                isSelected
                                                    ? 'bg-primary/10 border border-primary/30'
                                                    : 'hover:bg-secondary/60 border border-transparent'
                                            }`}
                                        >
                                            {/* Checkbox indicator */}
                                            <div
                                                className={`shrink-0 w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                                                    isSelected
                                                        ? 'bg-primary border-primary text-primary-foreground'
                                                        : 'border-muted-foreground/40'
                                                }`}
                                            >
                                                {isSelected && <Check size={14} />}
                                            </div>

                                            {/* Thumbnail */}
                                            <div className="relative shrink-0 w-28 aspect-video rounded-md overflow-hidden bg-secondary">
                                                <img
                                                    src={video.thumbnail}
                                                    alt={video.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-medium px-1 py-0.5 rounded">
                                                    {formatDuration(video.duration)}
                                                </div>
                                            </div>

                                            {/* Video Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium line-clamp-2 leading-snug">
                                                    {video.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {video.views || 0} views
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
                    <Button variant="ghost" onClick={onClose} disabled={isCreating}>
                        Cancel
                    </Button>
                    <Button onClick={handleCreate} disabled={isCreating}>
                        {isCreating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            'Create Playlist'
                        )}
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

export default CreatePlaylistDialog;
