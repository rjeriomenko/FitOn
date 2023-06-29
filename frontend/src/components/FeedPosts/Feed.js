import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { clearFeedPostErrors, fetchFeedPosts, fetchUserFeedPosts } from '../../store/feedPosts';
import { fetchAllUserGoals } from '../../store/goals';
import FeedPostEditable from './FeedPostEditable';
import './Feed.css';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

export const POST_TYPE_GOAL = "feedPost/GOAL"
export const POST_TYPE_EXERCISE_ENTRY = "feedPost/EXERCISE_ENTRY"

// Sort posts my most recent.
export const sortFeedPostsBy = (postsArray, sortRule) => {
  let sortedArray;
  switch(sortRule) {
    case "updatedAt":
      sortedArray = postsArray.toSorted((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt)
      })    
      break;
    default:
      sortedArray = "PLEASE SPECIFY SORT FILTER";
      break;
  }
  return sortedArray;
}

// Filter posts by post options object of types:["type1", ...] and/or ownerIds:[id1, ...]
export const filterPostsBy = (postsArray, options = {}) => {
  const { types, ownerIds } = options;
  const fitleredArray = postsArray.filter(post => {
    return (types ? types.includes(post.type) : true) && (ownerIds ? ownerIds.includes(post.setterId) : true);
  })
  return fitleredArray;
}

function Feed ({options = {}}) {
  const {userId} = useParams();
  const dispatch = useDispatch();
  const goalPosts = useSelector(state => state.goals?.all ? Object.values(state.goals.all) : {});
  const sessionUser = useSelector(state => state.session.user);
  const filterOptions = {...options};
  
  useEffect(() => {
    dispatch(fetchAllUserGoals())
    // return () => dispatch(clearFeedPostErrors());
  }, [dispatch])

  if(userId) {
    filterOptions.ownerIds ||= [];
    filterOptions.ownerIds.push(userId);
  }

  // Filter posts by options
  const filteredGoalPosts = filterPostsBy(goalPosts, filterOptions);

  // Sort posts by date
  const sortedGoalPosts = sortFeedPostsBy(filteredGoalPosts, "updatedAt");

  // Conditional header text
  // const headerText = (userId ? sessionUser.username + "..." : "everyone")
  // const headerText = (userId ? "just you..." : "everyone...")

  let headerText;
  if(userId){
    if(userId === sessionUser._id) headerText = "just you..."
    else headerText = `${sortedGoalPosts ? sortedGoalPosts[0].setter.concat(`...`) : "nothing here..."}`
  } else {
    headerText = "everyone..."
  }

  if (sortedGoalPosts.length === 0) return (
    <>
    <div className='feed-posts-container'>
      <h2>Welcome to the beginning of time!</h2>
    </div>
    </> 
  )

  return (
    <>
      <div className='feed-posts-container'>
        <h2>{headerText}</h2>
        {sortedGoalPosts.map(goalPost => (
          <FeedPostEditable key={goalPost.goalId} feedPost={goalPost} type={POST_TYPE_GOAL}/>
        ))}
      </div>
    </>
  );
}

export default Feed;