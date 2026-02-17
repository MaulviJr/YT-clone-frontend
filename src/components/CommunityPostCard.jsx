import React from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, MoreVertical, Share2 } from 'lucide-react';

/**
 * CommunityPostCard Component
 * Designed to look like a YouTube community tab post.
 * * @param {Object} post - The post object from the backend response
 * @param {Number} index - The index in the mapped array
 */
function CommunityPostCard({ post, index }) {
  const { content, owner, createdAt, likesCount = 0 } = post;

  // Simple relative time formatter
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (isNaN(date.getTime())) return 'Some time ago';
    if (diffInSeconds < 60) return 'Just now';
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 mb-4 hover:bg-secondary/5 transition-all duration-200">
      <div className="flex gap-4">
        {/* Left: Author Avatar */}
        <div className="shrink-0">
          <img 
            src={owner?.avatar || 'https://github.com/shadcn.png'} 
            alt={owner?.username} 
            className="w-10 h-10 rounded-full object-cover border border-border hover:opacity-90 transition-opacity cursor-pointer"
          />
        </div>

        {/* Right: Content & Metadata */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header: Name, Username, and Time */}
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="font-bold text-sm text-foreground cursor-pointer hover:underline underline-offset-2">
                {owner?.fullName || owner?.username}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                @{owner?.username} • {getTimeAgo(createdAt)}
              </span>
            </div>
            
            {/* Options Menu Button */}
            <button className="p-1.5 hover:bg-secondary rounded-full transition-colors text-muted-foreground focus:outline-none">
              <MoreVertical size={18} />
            </button>
          </div>

          {/* The Post Content */}
          <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words pr-2">
            {content}
          </div>

          {/* Footer Actions (Like, Dislike, Comment) */}
          <div className="flex items-center gap-4 pt-3">
            {/* Like Action */}
            <div className="flex items-center gap-1.5 group cursor-pointer">
              <div className="p-2 group-hover:bg-primary/10 rounded-full transition-colors">
                <ThumbsUp 
                  size={18} 
                  className="text-muted-foreground group-hover:text-primary transition-transform group-active:scale-125" 
                />
              </div>
              <span className="text-xs font-semibold text-muted-foreground group-hover:text-primary">
                {likesCount > 0 ? likesCount : ''}
              </span>
            </div>

            {/* Dislike Action */}
            <div className="flex items-center group cursor-pointer">
              <div className="p-2 group-hover:bg-secondary rounded-full transition-colors">
                <ThumbsDown 
                  size={18} 
                  className="text-muted-foreground group-active:scale-125 transition-transform" 
                />
              </div>
            </div>

            {/* Comment/Reply Action */}
            <div className="flex items-center gap-1.5 group cursor-pointer">
              <div className="p-2 group-hover:bg-secondary rounded-full transition-colors">
                <MessageSquare size={18} className="text-muted-foreground" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground">
                Reply
              </span>
            </div>

            {/* Share Action */}
            <div className="flex items-center group cursor-pointer ml-auto">
                <div className="p-2 hover:bg-secondary rounded-full transition-colors">
                    <Share2 size={18} className="text-muted-foreground" />
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunityPostCard;