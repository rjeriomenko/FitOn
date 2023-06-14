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
  const goalPosts = useSelector(state => state.goals?.all ? Object.values(state.goals.all) : {});
  
  // Sort posts by date
  const sortedGoalPosts = sortFeedPostsBy(goalPosts, "updatedAt");

  useEffect(() => {
    dispatch(fetchAllUserGoals())
    return () => dispatch(clearFeedPostErrors());
  }, [dispatch])

  if (sortedGoalPosts.length === 0) return (
    <>
    <div className='feed-posts-container'>
      <div>There are no Feed Posts</div>
    </div>
    </> 
  )

  return (
    <>
    
    <div className='feed-posts-container'>
      <h2>everyone...</h2>
      {sortedGoalPosts.map(goalPost => (
        <FeedPostEditable key={goalPost.goalId} feedPost={goalPost} type={POST_TYPE_GOAL}/>
      ))}
    </div>
    </>
  );
}

export default Feed;