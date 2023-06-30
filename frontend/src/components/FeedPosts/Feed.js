import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { clearFeedPostErrors, fetchFeedPosts, fetchUserFeedPosts } from '../../store/feedPosts';
import { fetchAllUserGoals, fetchUserGoals } from '../../store/goals';
import { fetchUserExerciseEntries, getUserKeyExerciseEntries } from '../../store/exerciseEntries';
import FeedPostWorkout from './FeedPostWorkout';
import FeedPostGoal from './FeedPostGoal';
import './Feed.css';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

export const POST_TYPE_GOAL = "feedPost/GOAL"
export const POST_TYPE_EXERCISE_ENTRY = "feedPost/EXERCISE_ENTRY"

// Sort posts by most recent.
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
    return (types ? types.includes(post.type) : true) && (ownerIds ? ownerIds.includes(post.user._id) : true);
  })
  return fitleredArray;
}

function Feed ({options = {}}) {
  const dispatch = useDispatch();
  const goalPosts = useSelector(state => state.goals?.user ? Object.values(state.goals.user) : {});
  const workoutPosts = Object.values(useSelector(getUserKeyExerciseEntries))
  const sessionUser = useSelector(state => state.session.user);
  const userId = useParams().userId || sessionUser._id; //NEED TO CHANGE THE DEFAULT OR BEHAVIOR
  const filterOptions = {...options};
	const [triggerRender, setTriggerRender] = useState(0);
  // debugger
  useEffect(() => {
    dispatch(fetchUserGoals(userId))
    dispatch(fetchUserExerciseEntries(userId))
    // dispatch(fetchAllUserGoals()) - do not use this thunk it will not work. Use updated thunks
    // return () => dispatch(clearFeedPostErrors());
  }, [dispatch])

  if(userId) {
    filterOptions.ownerIds ||= [userId];
    // filterOptions.ownerIds.push(userId);
  }

  // Filter each GOAL and WORKOUT posts by desired userIds then combine them and sort by options (usually last updated)
  const filteredGoalPosts = filterPostsBy(goalPosts, filterOptions);
  const filteredWorkoutPosts = filterPostsBy(workoutPosts, filterOptions);
  const combinedPosts = [...filteredGoalPosts, ...filteredWorkoutPosts];
  const sortedCombinedPosts = sortFeedPostsBy(combinedPosts, "updatedAt");
  debugger
  // const sortedGoalPosts = sortFeedPostsBy(filteredGoalPosts, "updatedAt");
  // const sortedWorkoutPosts = sortFeedPostsBy(filteredWorkoutPosts, "updatedAt");

  // Conditional header text
  // const headerText = (userId ? sessionUser.username + "..." : "everyone")
  // const headerText = (userId ? "just you..." : "everyone...")
  let headerText;
  if(userId){
    if(userId === sessionUser._id) headerText = "just you..."
    // else headerText = `${sortedGoalPosts ? sortedGoalPosts[0].setter.concat(`...`) : "nothing here..."}`
    else headerText = `${sortedCombinedPosts ? sortedCombinedPosts[0].setter.concat(`...`) : "nothing here..."}`
  } else {
    headerText = "everyone..."
  }

  if (sortedCombinedPosts.length === 0) return (
    <>
    <div className='feed-posts-container'>
      <h2>Welcome to the beginning of time!</h2>
    </div>
    </> 
  )
  // debugger
  return (
    <>
      <div className='feed-posts-container'>
        <h2>{headerText}</h2>
        {sortedCombinedPosts.map(goalPost => goalPost.deadline ? 
          <FeedPostGoal key={goalPost.goalId} feedPost={goalPost} triggerRender={triggerRender} setTriggerRender={setTriggerRender}/>
          : <FeedPostWorkout key={goalPost.goalId} feedPost={goalPost} triggerRender={triggerRender} setTriggerRender={setTriggerRender}/>
        )}
      </div>
    </>
  );
}

export default Feed;