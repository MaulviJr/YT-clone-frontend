import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import { Loader2, MessageSquarePlus } from 'lucide-react';
import CommunityPostCard from '../CommunityPostCard';
import { getTweets } from '@/store/tweetSlice';

export default function ProfileCommunity() {
  const { channelInfo } = useOutletContext();
  const dispatch = useDispatch();

  const { tweets = [], isLoading = false, error = null } = useSelector(
    (state) => state.tweets || {}
  );

  useEffect(() => {
    const channelId = channelInfo?._id;
    if (!channelId) return;
    dispatch(getTweets(channelId));
  }, [dispatch, channelInfo?._id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="h-9 w-9 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading community posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Could not load posts right now.</p>
      </div>
    );
  }

  if (!tweets.length) {
    return (
      <div className="py-20 text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
          <MessageSquarePlus className="text-muted-foreground" size={32} />
        </div>
        <h3 className="text-lg font-bold">No community posts yet</h3>
        <p className="text-sm text-muted-foreground max-w-xs mt-2">
          Posts from this channel will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h3 className="text-lg font-semibold text-foreground mb-4">Community</h3>
      <div className="space-y-4">
        {tweets.map((post) => (
          <CommunityPostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}