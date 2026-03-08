import React, { useRef, useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, MoreVertical, Share2, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTweet, updateTweet } from '../store/tweetSlice';
import { Button } from './ui/button';

function CommunityPostCard({ post }) {
  const { _id: tweetId, content, owner, createdAt, likesCount = 0 } = post;
  const dispatch = useDispatch();
  const currentUserId = useSelector((state) => state.auth?.userData?.user?._id);
  const isOwner = currentUserId && owner?._id === currentUserId;

  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef(null);

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

  const handleDelete = async () => {
    setMenuOpen(false);
    setIsDeleting(true);
    try {
      await dispatch(deleteTweet(tweetId)).unwrap();
    } catch (err) {
      console.error('Delete failed:', err);
      setIsDeleting(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim() || editContent.trim() === content) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    try {
      await dispatch(updateTweet({ tweetId, content: editContent.trim() })).unwrap();
      setIsEditing(false);
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isDeleting) {
    return (
      <div className="bg-card border border-border rounded-xl p-4 mb-4 flex items-center justify-center gap-3 text-muted-foreground text-sm">
        <Loader2 size={16} className="animate-spin" /> Deleting post...
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4 mb-4 hover:bg-secondary/5 transition-all duration-200">
      <div className="flex gap-4">
        <div className="shrink-0">
          <img
            src={owner?.avatar || 'https://github.com/shadcn.png'}
            alt={owner?.username}
            className="w-10 h-10 rounded-full object-cover border border-border hover:opacity-90 transition-opacity cursor-pointer"
          />
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="font-bold text-sm text-foreground">
                {owner?.fullName || owner?.username}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                @{owner?.username} • {getTimeAgo(createdAt)}
              </span>
            </div>

            {/* Options menu — only visible to post owner */}
            {isOwner && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="p-1.5 hover:bg-secondary rounded-full transition-colors text-muted-foreground focus:outline-none"
                >
                  <MoreVertical size={18} />
                </button>

                {menuOpen && (
                  <>
                    {/* Backdrop to close on outside click */}
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 top-8 z-20 w-36 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                      <button
                        onClick={() => { setMenuOpen(false); setIsEditing(true); setEditContent(content); }}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Content — view or inline edit */}
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                autoFocus
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={3}
                className="w-full bg-transparent border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none transition-colors"
              />
              <div className="flex items-center gap-2 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="rounded-full h-8 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={isSaving || !editContent.trim()}
                  className="rounded-full h-8 px-4 text-xs font-bold"
                >
                  {isSaving ? <Loader2 size={12} className="animate-spin" /> : 'Save'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words pr-2">
              {content}
            </div>
          )}

          {/* Footer Actions */}
          {!isEditing && (
            <div className="flex items-center gap-4 pt-3">
              <div className="flex items-center gap-1.5 group cursor-pointer">
                <div className="p-2 group-hover:bg-primary/10 rounded-full transition-colors">
                  <ThumbsUp size={18} className="text-muted-foreground group-hover:text-primary transition-transform group-active:scale-125" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground group-hover:text-primary">
                  {likesCount > 0 ? likesCount : ''}
                </span>
              </div>

              <div className="flex items-center group cursor-pointer">
                <div className="p-2 group-hover:bg-secondary rounded-full transition-colors">
                  <ThumbsDown size={18} className="text-muted-foreground group-active:scale-125 transition-transform" />
                </div>
              </div>

              <div className="flex items-center gap-1.5 group cursor-pointer">
                <div className="p-2 group-hover:bg-secondary rounded-full transition-colors">
                  <MessageSquare size={18} className="text-muted-foreground" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground">Reply</span>
              </div>

              <div className="flex items-center group cursor-pointer ml-auto">
                <div className="p-2 hover:bg-secondary rounded-full transition-colors">
                  <Share2 size={18} className="text-muted-foreground" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommunityPostCard;