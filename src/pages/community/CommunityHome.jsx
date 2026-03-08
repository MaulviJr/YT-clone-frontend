import CommunityPostCard from '../../components/CommunityPostCard'
import PostComposer from '../../components/PostComposer'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getTweets, createTweet } from '../../store/tweetSlice.js'
import { Search, MessageSquarePlus, Loader2, X } from 'lucide-react'
function CommunityHome() {
    const userData = useSelector(state => state.auth?.userData);
    const { tweets, isLoading, isPosting } = useSelector(
        (state) => state.tweets || { tweets: [], isLoading: false, isPosting: false }
    );
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState('');
    const [postError, setPostError] = useState(null);

    useEffect(() => {
        const userId = userData?.user?._id || userData?._id;
        if (userId) {
            dispatch(getTweets(userId));
        }
    }, [dispatch, userData]);

    const handlePost = async (content) => {
        setPostError(null);
        try {
            await dispatch(createTweet(content)).unwrap();
            // Re-fetch so the new post has full owner details
            const userId = userData?.user?._id || userData?._id;
            if (userId) dispatch(getTweets(userId));
        } catch (err) {
            setPostError('Failed to post. Please try again.');
            console.error('Post failed:', err);
        }
    };

    const filteredTweets = tweets?.filter((post) => {
        if (!searchQuery.trim()) return true;
        const text = post.content?.toLowerCase() || '';
        return text.includes(searchQuery.toLowerCase());
    }) ?? [];

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="animate-spin h-10 w-10 text-muted-foreground" />
                <p className="text-muted-foreground animate-pulse font-medium">Loading community posts...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <div className="max-w-3xl mx-auto px-4 pt-6 md:pt-10">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold mb-1">Community</h1>
                    <p className="text-sm text-muted-foreground">
                        Stay connected with your favorite creators and community members.
                    </p>
                </div>

                {/* Composer */}
                <PostComposer
                    userData={userData}
                    onPost={handlePost}
                    isPosting={isPosting}
                />

                {/* Post Error */}
                {postError && (
                    <div className="mb-4 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center justify-between">
                        <span>{postError}</span>
                        <button onClick={() => setPostError(null)} className="ml-2">
                            <X size={14} />
                        </button>
                    </div>
                )}

                {/* Search */}
                <div className="mb-8 relative group">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                        size={18}
                    />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search posts"
                        className="w-full bg-secondary/30 border border-border rounded-full py-2.5 pl-10 pr-4 text-sm focus:bg-background focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                </div>

                {/* Posts Feed */}
                <div className="space-y-4">
                    {filteredTweets.length > 0 ? (
                        filteredTweets.map((post, index) => (
                            <CommunityPostCard key={post._id} post={post} index={index} />
                        ))
                    ) : (
                        <div className="py-20 text-center flex flex-col items-center">
                            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
                                <MessageSquarePlus className="text-muted-foreground" size={32} />
                            </div>
                            <h3 className="text-lg font-bold">
                                {searchQuery ? 'No posts match your search' : 'No posts yet'}
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-xs mt-2">
                                {searchQuery
                                    ? 'Try a different search term.'
                                    : 'Start the conversation by sharing a thought with your community.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CommunityHome;