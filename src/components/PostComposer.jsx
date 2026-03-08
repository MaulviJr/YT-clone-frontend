import React, { useState } from 'react';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

function PostComposer({ userData, onPost, isPosting }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [content, setContent] = useState('');
    const MAX_CHARS = 2000;

    const handlePost = async () => {
        if (!content.trim()) return;
        await onPost(content.trim());
        setContent('');
        setIsExpanded(false);
    };

    const handleCancel = () => {
        setContent('');
        setIsExpanded(false);
    };

    return (
        <div className="bg-card border border-border rounded-xl p-4 mb-8 shadow-sm">
            <div className="flex gap-4">
                <img
                    src={userData?.user?.avatar || 'https://github.com/shadcn.png'}
                    className="w-10 h-10 rounded-full object-cover shrink-0 border border-border mt-1"
                    alt="Your avatar"
                />
                <div className="flex-1 min-w-0">
                    {/* Collapsed State */}
                    {!isExpanded && (
                        <button
                            type="button"
                            onClick={() => setIsExpanded(true)}
                            className="w-full text-left py-2 text-sm text-muted-foreground border-b border-border hover:border-foreground transition-colors focus:outline-none"
                        >
                            Post something to your community...
                        </button>
                    )}

                    {/* Expanded State */}
                    {isExpanded && (
                        <div className="space-y-3">
                            <textarea
                                autoFocus
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Write your post here..."
                                rows={4}
                                className="w-full bg-transparent border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none transition-colors"
                            />

                            <div className="flex items-center justify-between">
                                <span className={`text-xs ${
                                    content.length > MAX_CHARS
                                        ? 'text-destructive font-semibold'
                                        : 'text-muted-foreground'
                                }`}>
                                    {content.length} / {MAX_CHARS}
                                </span>

                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={handleCancel}
                                        disabled={isPosting}
                                        className="rounded-full h-9 text-sm"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={handlePost}
                                        disabled={isPosting || !content.trim() || content.length > MAX_CHARS}
                                        className="rounded-full h-9 px-6 text-sm font-bold"
                                    >
                                        {isPosting ? (
                                            <span className="flex items-center gap-2">
                                                <Loader2 size={14} className="animate-spin" />
                                                Posting...
                                            </span>
                                        ) : 'Post'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PostComposer;

