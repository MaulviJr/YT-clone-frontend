import CommunityPostCard from '../../components/CommunityPostCard'
import PostComposer from '../../components/PostComposer'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getTweets, createTweet } from '../../store/tweetSlice.js'
import { Search, MessageSquarePlus, Loader2, X } from 'lucide-react'
import subscriptionService from '../../api/subscription.service.js'

function CommunityHome() {
    const userData = useSelector(state => state.auth?.userData);
    const { tweets, isLoading, isPosting, error } = useSelector(
        (state) => state.tweets || { tweets: [], isLoading: false, isPosting: false, error: null }
    );
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState('');
    const [postError, setPostError] = useState(null);
    const [subscriptions, setSubscriptions] = useState([]);
    const [subscriptionsLoading, setSubscriptionsLoading] = useState(false);

    const currentUser = userData?.user || userData;
    const currentUserId = currentUser?._id;

    const [selectedChannel, setSelectedChannel] = useState({
        _id: currentUserId,
        fullName: currentUser?.fullName || currentUser?.username,
        username: currentUser?.username,
        avatar: currentUser?.avatar,
        isSelf: true,
    });

    useEffect(() => {
        if (!currentUserId) return;
        setSelectedChannel({
            _id: currentUserId,
            fullName: currentUser?.fullName || currentUser?.username,
            username: currentUser?.username,
            avatar: currentUser?.avatar,
            isSelf: true,
        });
    }, [currentUserId, currentUser?.fullName, currentUser?.username, currentUser?.avatar]);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            if (!currentUserId) return;
            try {
                setSubscriptionsLoading(true);
                const channels = await subscriptionService.getSubscribedChannels(currentUserId);
                setSubscriptions(channels || []);
            } catch (err) {
                // Backend returns 400 if user has no subscriptions.
                if (err?.statusCode === 400) {
                    setSubscriptions([]);
                } else {
                    console.error('Failed to fetch subscriptions:', err);
                }
            } finally {
                setSubscriptionsLoading(false);
            }
        }

        fetchSubscriptions();
    }, [currentUserId]);

    useEffect(() => {
        const targetUserId = selectedChannel?._id;
        if (targetUserId) {
            dispatch(getTweets(targetUserId));
        }
    }, [dispatch, selectedChannel?._id]);

    const handlePost = async (content) => {
        setPostError(null);
        try {
            await dispatch(createTweet(content)).unwrap();
            // Re-fetch so the new post has full owner details
            if (selectedChannel?._id) dispatch(getTweets(selectedChannel._id));
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
            <div className="max-w-7xl mx-auto px-4 pt-6 md:pt-10">
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-8">
                    <div className="max-w-3xl">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold mb-1">Community</h1>
                            <p className="text-sm text-muted-foreground">
                                Viewing @{selectedChannel?.username || 'channel'} posts.
                            </p>
                        </div>

                        {/* Composer: Only for current user's own community */}
                        {selectedChannel?.isSelf && (
                            <PostComposer
                                userData={userData}
                                onPost={handlePost}
                                isPosting={isPosting}
                            />
                        )}

                        {/* Post Error */}
                        {postError && (
                            <div className="mb-4 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center justify-between">
                                <span>{postError}</span>
                                <button onClick={() => setPostError(null)} className="ml-2">
                                    <X size={14} />
                                </button>
                            </div>
                        )}

                        {/* Feed Error */}
                        {error && (
                            <div className="mb-4 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                                Could not load posts for this channel.
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

                    {/* Right Sidebar */}
                    <aside className="lg:sticky lg:top-24 h-fit rounded-2xl border border-border bg-card/60 p-4">
                        <h2 className="text-sm font-semibold text-foreground mb-3">Your Channels</h2>

                        <div className="space-y-2 mb-4">
                            <button
                                onClick={() => setSelectedChannel({
                                    _id: currentUserId,
                                    fullName: currentUser?.fullName || currentUser?.username,
                                    username: currentUser?.username,
                                    avatar: currentUser?.avatar,
                                    isSelf: true,
                                })}
                                className={`w-full text-left flex items-center gap-3 rounded-xl px-3 py-2 transition-colors ${selectedChannel?.isSelf ? 'bg-primary/10 border border-primary/30' : 'hover:bg-secondary/60 border border-transparent'}`}
                            >
                                <img
                                    src={currentUser?.avatar || 'https://github.com/shadcn.png'}
                                    alt={currentUser?.username}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                                <div className="min-w-0">
                                    <p className="text-sm font-medium truncate">{currentUser?.fullName || 'My Channel'}</p>
                                    <p className="text-xs text-muted-foreground truncate">@{currentUser?.username}</p>
                                </div>
                            </button>
                        </div>

                        <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Subscribed</h3>

                        {subscriptionsLoading ? (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                                <Loader2 size={14} className="animate-spin" /> Loading channels...
                            </div>
                        ) : subscriptions.length === 0 ? (
                            <p className="text-xs text-muted-foreground">No subscribed channels yet.</p>
                        ) : (
                            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                                {subscriptions.map((channel) => {
                                    const isActive = selectedChannel?._id === channel._id && !selectedChannel?.isSelf;
                                    return (
                                        <button
                                            key={channel._id}
                                            onClick={() => setSelectedChannel({ ...channel, isSelf: false })}
                                            className={`w-full text-left flex items-center gap-3 rounded-xl px-3 py-2 transition-colors ${isActive ? 'bg-primary/10 border border-primary/30' : 'hover:bg-secondary/60 border border-transparent'}`}
                                        >
                                            <img
                                                src={channel.avatar || 'https://github.com/shadcn.png'}
                                                alt={channel.username}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium truncate">{channel.fullName || channel.username}</p>
                                                <p className="text-xs text-muted-foreground truncate">@{channel.username}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </aside>
                </div>

            </div>
        </div>
    );
}

export default CommunityHome;