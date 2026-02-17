import CommunityPostCard from '@/components/CommunityPostCard'
import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import tweetService from '../../api/tweet.service.js'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import {getTweets} from '../../store/tweetSlice.js'

function CommunityHome() {
    
    const userData = useSelector(state => state.auth.userData);
     const { tweets, isLoading, error } = useSelector((state) => state.tweets || { tweets: [], isLoading: false, error: null });
     const dispatch = useDispatch();

        console.log("tweets: ", tweets)
    useEffect(() => {

        dispatch(getTweets(userData?.user?._id));
            
    }, [dispatch])


if (isLoading) {
    return <div>Loading...</div>;
}
  return (
    <>
    <h1>CommunityHome</h1>
    <div>
        <h2>Search Posts</h2> 
        <h2>Post Something</h2>
        <Button>Post</Button>
    <div>
        {
            tweets.map((post) => (
                <CommunityPostCard key={post._id} post={post}/>
            ))
        }
    </div>

    </div>


    </>
  )
}

export default CommunityHome