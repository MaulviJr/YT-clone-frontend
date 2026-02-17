import CommunityPostCard from '../../components/CommunityPostCard'
import React, { useEffect, useState } from 'react'
import { Button } from '../../components/ui/button'
import { useSelector, useDispatch } from 'react-redux'
import { getTweets } from '../../store/tweetSlice.js'
import { Image as ImageIcon, Search, MessageSquarePlus } from 'lucide-react'

/**
 * CommunityHome Component
 * Redesigned to match the YouTube Community Tab feed.
 * Logic and variable names are preserved as per the original request.
 */
function CommunityHome() {
    // Safely accessing auth state
    const userData = useSelector(state => state.auth?.userData);
    
    // Safely accessing tweets state with a fallback to prevent destructuring errors
    const { tweets, isLoading, error } = useSelector((state) => state.tweets || { tweets: [], isLoading: false, error: null });
    const dispatch = useDispatch();

    // Local state for the "fake" input expansion (aesthetic only)
    const [isInputFocused, setIsInputFocused] = useState(false);

    useEffect(() => {
        const userId = userData?.user?._id || userData?._id;
        if (userId) {
            dispatch(getTweets(userId));
        }
    }, [dispatch, userData]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
                <p className="text-muted-foreground animate-pulse font-medium">Loading community posts...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <div className="max-w-3xl mx-auto px-4 pt-6 md:pt-10">
                
                {/* 1. Header & Context */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold mb-1">Community</h1>
                    <p className="text-sm text-muted-foreground">
                        Stay connected with your favorite creators and community members.
                    </p>
                </div>

                {/* 2. Create Post Area (YouTube Style) */}
                <div className="bg-card border border-border rounded-xl p-4 mb-8 shadow-sm">
                    <div className="flex gap-4">
                        <img 
                            src={userData?.user?.avatar || 'https://github.com/shadcn.png'} 
                            className="w-10 h-10 rounded-full object-cover shrink-0 border border-border" 
                            alt="Your avatar"
                        />
                        <div className="flex-1 space-y-3">
                            <div className="relative group">
                                <textarea 
                                    onFocus={() => setIsInputFocused(true)}
                                    placeholder="Post something..." 
                                    className="w-full bg-transparent border-b border-border focus:border-foreground focus:outline-none py-1 text-sm transition-all resize-none min-h-[40px]"
                                    rows={isInputFocused ? 3 : 1}
                                />
                            </div>
                            
                            <div className={`flex items-center justify-between transition-all duration-300 ${isInputFocused ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden'}`}>
                                
                                <div className="flex items-center gap-2">
                                    <Button 
                                        type="button"
                                        variant="ghost" 
                                        onClick={() => setIsInputFocused(false)}
                                        className="rounded-full h-9 text-sm"
                                    >
                                        Cancel
                                    </Button>
                                    <Button className="rounded-full h-9 px-6 text-sm font-bold bg-primary text-primary-foreground"
                                    onClick={() => {
                                        // Here you would typically dispatch an action to create a new post
                                        // For now, we'll just reset the input state

                                        setIsInputFocused(false);
                                        uploadPost();
                                    }}
                                    >
                                        Post
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Search Bar (Minimalist) */}
                <div className="mb-8 relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search posts" 
                        className="w-full bg-secondary/30 border border-border rounded-full py-2.5 pl-10 pr-4 text-sm focus:bg-background focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                </div>

                {/* 4. Posts Feed */}
                <div className="space-y-4">
                    {tweets && tweets.length > 0 ? (
                        tweets.map((post, index) => (
                            <CommunityPostCard key={post._id} post={post} index={index} />
                        ))
                    ) : (
                        <div className="py-20 text-center flex flex-col items-center">
                            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
                                <MessageSquarePlus className="text-muted-foreground" size={32} />
                            </div>
                            <h3 className="text-lg font-bold">No posts yet</h3>
                            <p className="text-sm text-muted-foreground max-w-xs mt-2">
                                Start the conversation by sharing a thought with your community.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CommunityHome;