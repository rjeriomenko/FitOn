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

  const feedPost2 = {
    text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
    author: {username: "Michele"}
  }

  if (feedPosts.length === 0) return (
    <>
    <div className='feed-posts-container'>
      <div>There are no Feed Posts</div>
      <br/>

      {/* Placeholder */}
      <FeedPostEditable feedPost={feedPost} type={POST_TYPE_EXERCISE_ENTRY}/>
      <FeedPostEditable feedPost={feedPost2} type={POST_TYPE_EXERCISE_ENTRY}/>
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