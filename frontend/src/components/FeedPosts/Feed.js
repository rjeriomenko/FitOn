import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearFeedPostErrors, fetchFeedPosts, fetchUserFeedPosts } from '../../store/feedPosts';
import FeedPostBlock from './FeedPostBlock';
import FeedPostEditable from './FeedPostEditable';
import { useState } from 'react';

import './Feed.css';

export const POST_TYPE_GOAL = "feedPost/GOAL"
export const POST_TYPE_EXERCISE_ENTRY = "feedPost/EXERCISE_ENTRY"

function FeedPosts () {
  const dispatch = useDispatch();
  const feedPosts = useSelector(state => state.feedPosts?.all ? Object.values(state.feedPosts.all) : []);
  const userFeedPosts = useSelector(state => state.feedPosts?.user ? Object.values(state.feedPosts.user) : []);
  
  useEffect(() => {
    dispatch(fetchFeedPosts());
    dispatch(fetchUserFeedPosts());
    return () => dispatch(clearFeedPostErrors());
  }, [dispatch])

  // Placeholder feedPost data
  const feedPost = {
    text: "Today's upper body workout was dope",
    author: {username: "Carvey"} 
  };

  if (feedPosts.length === 0) return (
    <>
    <div className='feed-posts-container'>
      <div>There are no Feed Posts</div>
      <br/>

      {/* Placeholder */}
      <FeedPostEditable feedPost={feedPost} type={POST_TYPE_EXERCISE_ENTRY}/>
    </div>
    </> 
  )
  
  return (
    <>
    
    <div className='feed-posts-container'>
      <h2>All FeedPosts</h2>
      {feedPosts.map(feedPost => (
        <FeedPostBlock key={feedPost._id} feedPost={feedPost} />
      ))}
    </div>
    </>
  );
}

export default FeedPosts;