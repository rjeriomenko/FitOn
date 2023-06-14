import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { clearFeedPostErrors, fetchFeedPosts, fetchUserFeedPosts } from '../../store/feedPosts';
import { fetchAllUserGoals } from '../../store/goals';
import FeedPostEditable from './FeedPostEditable';

import './Feed.css';

export const POST_TYPE_GOAL = "feedPost/GOAL"
export const POST_TYPE_EXERCISE_ENTRY = "feedPost/EXERCISE_ENTRY"

export const sortFeedPostsBy = (postsArray, filter) => {
  let sortedArray;
  
  switch(filter) {
    case "updatedAt":
      sortedArray = postsArray.toSorted((a, b) => {
        return new Date(a.updatedAt) - new Date(b.updatedAt)
      })    
      break;
    default:
      sortedArray =  "PLEASE SPECIFY SORT FILTER";
      break;
  }

  return sortedArray;
}

function Feed () {
  const dispatch = useDispatch();
  const feedPosts = useSelector(state => state.feedPosts?.all ? Object.values(state.feedPosts.all) : []);
  const goalPosts = useSelector(state => state.goals?.all ? Object.values(state.goals.all) : {});
  
  const sortedGoalPosts = sortFeedPostsBy(goalPosts, "updatedAt");

  // console.log(sortedGoalPosts)
  
  useEffect(() => {
    dispatch(fetchAllUserGoals())
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

  if (sortedGoalPosts.length === 0) return (
    <>
    <div className='feed-posts-container'>
      <div>There are no Feed Posts</div>
    </div>
    </> 
  )

  // Sort feedposts by date...

  return (
    <>
    
    <div className='feed-posts-container'>
      <h2>everyone...</h2>
      {/* {feedPosts.map(feedPost => (
        <FeedPostEditable feedPost={feedPost} type={POST_TYPE_GOAL}/>
      ))} */}
      {sortedGoalPosts.map(goalPost => (
        <FeedPostEditable key={goalPost.goalId} feedPost={goalPost} type={POST_TYPE_GOAL}/>
      ))}
    </div>
    </>
  );
}

export default Feed;