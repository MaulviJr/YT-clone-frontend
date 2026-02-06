import React from 'react';
import { motion } from 'framer-motion';

const VideoCard = ({ video, index }) => {
    // Utility to format seconds into HH:MM:SS
    const formatDuration = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        const parts = [h > 0 ? h : null, m, s].filter(x => x !== null);
        return parts.map((v, i) => (i === 0 && h === 0 ? v : v.toString().padStart(2, '0'))).join(':');
    };

    // Simple view count formatter
    const formatViews = (views) => {
        if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
        if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
        return views;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="flex flex-col gap-3 group cursor-pointer"
        >
            {/* Thumbnail */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-[#272727]">
                <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[11px] font-medium px-1.5 py-0.5 rounded">
                    {formatDuration(video.duration)}
                </div>
            </div>

            {/* Meta Data */}
            <div className="flex gap-3">
                <div className="flex-shrink-0">
                    <img 
                        src={video.owner.avatar} 
                        alt={video.owner.username} 
                        className="h-9 w-9 rounded-full object-cover border border-white/10"
                    />
                </div>
                <div className="flex flex-col gap-1 overflow-hidden">
                    <h3 className="text-sm font-bold line-clamp-2 leading-snug text-[#f1f1f1]">
                        {video.title}
                    </h3>
                    <div className="text-[12px] text-[#aaaaaa]">
                        <p className="hover:text-white transition-colors">{video.owner.fullName}</p>
                        <p>{formatViews(video.views)} views • {new Date(video.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default VideoCard;