import React, { useEffect, useRef, useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, MoreVertical, Share2, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTweet, updateTweet } from '../store/tweetSlice';
import { Button } from './ui/button';
import likeService from '@/api/like.service';
import commentService from '@/api/comment.service';

function CommunityPostCard({ post, onPostDeleted, onPostUpdated }) {
  const { _id: tweetId, content, owner, createdAt, likesCount = 0 } = post;
  const dispatch = useDispatch();
  const currentUserId = useSelector((state) => state.auth?.userData?.user?._id);
  const currentUser = useSelector((state) => state.auth?.userData?.user);
  const isOwner = currentUserId && owner?._id === currentUserId;

  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLiked, setIsLiked] = useState(!!post?.isLiked);
  const [likes, setLikes] = useState(likesCount || 0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentPosting, setCommentPosting] = useState(false);
  const [likedCommentIds, setLikedCommentIds] = useState({});
  const [commentLikesMap, setCommentLikesMap] = useState({});
  const menuRef = useRef(null);

  useEffect(() => {
    setLikes(likesCount || 0);
    setIsLiked(!!post?.isLiked);
  }, [likesCount, post?.isLiked, tweetId]);

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
      onPostDeleted?.(tweetId);
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
      onPostUpdated?.(tweetId, editContent.trim());
      setIsEditing(false);
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const loadComments = async () => {
    try {
      setCommentsLoading(true);
      const response = await commentService.getVideoComments(tweetId);
      const resolvedComments = Array.isArray(response)
        ? response
        : Array.isArray(response?.docs)
          ? response.docs
          : [];
      setComments(resolvedComments);

      const initialLikesMap = {};
      resolvedComments.forEach((comment) => {
        initialLikesMap[comment._id] = comment.likesCount || 0;
      });
      setCommentLikesMap(initialLikesMap);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  const toggleComments = async () => {
    const nextOpen = !showComments;
    setShowComments(nextOpen);
    if (nextOpen && comments.length === 0) {
      await loadComments();
    }
  };

  const handleToggleTweetLike = async () => {
    if (isLikeLoading) return;
    try {
      setIsLikeLoading(true);
      await likeService.ToggleTweetLike(tweetId);
      setIsLiked((prev) => !prev);
      setLikes((prev) => (isLiked ? Math.max(prev - 1, 0) : prev + 1));
    } catch (err) {
      console.error('Failed to toggle tweet like:', err);
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handlePostComment = async () => {
    const trimmed = commentText.trim();
    if (!trimmed || commentPosting) return;

    try {
      setCommentPosting(true);
      const newComment = await commentService.createComment(tweetId, { content: trimmed });
      const optimisticComment = {
        ...newComment,
        content: trimmed,
        owner: {
          _id: currentUser?._id,
          username: currentUser?.username,
          fullName: currentUser?.fullName,
          avatar: currentUser?.avatar,
        },
      };
      setComments((prev) => [optimisticComment, ...prev]);
      setCommentText('');
    } catch (err) {
      console.error('Failed to post comment:', err);
    } finally {
      setCommentPosting(false);
    }
  };

  const handleToggleCommentLike = async (commentId) => {
    try {
      await likeService.ToggleCommentLike(commentId);
      const currentlyLiked = !!likedCommentIds[commentId];
      setLikedCommentIds((prev) => ({
        ...prev,
        [commentId]: !currentlyLiked,
      }));
      setCommentLikesMap((prev) => ({
        ...prev,
        [commentId]: Math.max((prev[commentId] || 0) + (currentlyLiked ? -1 : 1), 0),
      }));
    } catch (err) {
      console.error('Failed to toggle comment like:', err);
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
              <button
                onClick={handleToggleTweetLike}
                disabled={isLikeLoading}
                className="flex items-center gap-1.5 group cursor-pointer disabled:opacity-70"
              >
                <div className={`p-2 rounded-full transition-colors ${isLiked ? 'bg-primary/10' : 'group-hover:bg-primary/10'}`}>
                  <ThumbsUp size={18} className={`transition-transform group-active:scale-125 ${isLiked ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`} />
                </div>
                <span className={`text-xs font-semibold ${isLiked ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`}>
                  {likes > 0 ? likes : ''}
                </span>
              </button>

              <div className="flex items-center group cursor-pointer">
                <div className="p-2 group-hover:bg-secondary rounded-full transition-colors">
                  <ThumbsDown size={18} className="text-muted-foreground group-active:scale-125 transition-transform" />
                </div>
              </div>

              <button onClick={toggleComments} className="flex items-center gap-1.5 group cursor-pointer">
                <div className="p-2 group-hover:bg-secondary rounded-full transition-colors">
                  <MessageSquare size={18} className="text-muted-foreground" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground">
                  {showComments ? 'Hide' : 'Reply'}
                </span>
              </button>

              <div className="flex items-center group cursor-pointer ml-auto">
                <div className="p-2 hover:bg-secondary rounded-full transition-colors">
                  <Share2 size={18} className="text-muted-foreground" />
                </div>
              </div>
            </div>
          )}

          {showComments && !isEditing && (
            <div className="pt-2 border-t border-border/70 space-y-3">
              <div className="flex items-start gap-2">
                <img
                  src={currentUser?.avatar || 'https://github.com/shadcn.png'}
                  alt="user"
                  className="w-8 h-8 rounded-full object-cover border border-border"
                />
                <div className="flex-1 space-y-2">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    rows={2}
                    className="w-full bg-transparent border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={handlePostComment}
                      disabled={commentPosting || !commentText.trim()}
                      className="rounded-full h-8 px-4 text-xs font-semibold"
                    >
                      {commentPosting ? <Loader2 size={12} className="animate-spin" /> : 'Comment'}
                    </Button>
                  </div>
                </div>
              </div>

              {commentsLoading ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                  <Loader2 size={14} className="animate-spin" /> Loading comments...
                </div>
              ) : comments.length === 0 ? (
                <p className="text-xs text-muted-foreground">No comments yet.</p>
              ) : (
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div key={comment._id} className="flex items-start gap-2">
                      <img
                        src={comment.owner?.avatar || 'https://github.com/shadcn.png'}
                        alt={comment.owner?.username}
                        className="w-7 h-7 rounded-full object-cover border border-border"
                      />
                      <div className="flex-1">
                        <div className="text-xs text-muted-foreground mb-0.5">
                          @{comment.owner?.username || 'user'}
                        </div>
                        <p className="text-sm text-foreground whitespace-pre-wrap">{comment.content}</p>
                        <button
                          onClick={() => handleToggleCommentLike(comment._id)}
                          className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                        >
                          <ThumbsUp size={12} />
                          <span>{commentLikesMap[comment._id] > 0 ? commentLikesMap[comment._id] : ''}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommunityPostCard;