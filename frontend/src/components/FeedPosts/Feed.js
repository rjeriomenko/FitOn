import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { fetchAllUserGoals, fetchUserGoals, fetchFollowsGoals, fetchDiscoversGoals, getFollowsGoals, getDiscoversGoals } from '../../store/goals';
import { fetchFollowsExerciseEntries, fetchUserExerciseEntries, getFollowsExerciseEntries, getUserExerciseEntries, fetchDiscoversExerciseEntries, getDiscoversExerciseEntries } from '../../store/exerciseEntries';
import { fetchFollows, getFollows } from '../../store/follows';
import FollowNavBar from './FollowNavBar';
import FeedPostWorkout from './FeedPostWorkout';
import FeedPostGoal from './FeedPostGoal';
import './Feed.css';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import TestProps from './TestProps';
import { useLocation } from 'react-router-dom';

// Sort posts by most recent.
export const sortFeedPostsBy = (postsArray, sortRule) => {
  
  let sortedArray;
  switch(sortRule) {
    case "date":
      sortedArray = postsArray.toSorted((a, b) => {
        return new Date(b.date ? b.date : b.updatedAt) - new Date(a.date ? a.date : a.updatedAt)
      })    
      break;
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
  
  const filteredArray = postsArray.filter(post => {
    return (types ? types.includes(post.type) : true) && (ownerIds ? ownerIds.includes(post.user?._id) : true);
  })
  
  return filteredArray;
}

function Feed ({discoverMode, options = {}}) {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  // const goalPosts = Object.values(useSelector(getUserGoals)); - preferred way
  const goalPosts = useSelector(state => state.goals?.user ? Object.values(state.goals.user) : []); // -- less preferred way
  const workoutPosts = Object.values(useSelector(getUserExerciseEntries))
  const follows = useSelector(getFollows);
  const followsGoalsBase = Object.values(useSelector(getFollowsGoals))
  const followsGoals = followsGoalsBase.flat()
  const followsWorkoutsBase = Object.values(useSelector(getFollowsExerciseEntries));
  const followsWorkouts = followsWorkoutsBase.flat()
  const discoverGoals = Object.values(useSelector(getDiscoversGoals));
  const discoverWorkouts = Object.values(useSelector(getDiscoversExerciseEntries));
  
  const userId = useParams().userId
  
  const filterOptions = {...options};
	// const [triggerRender, setTriggerRender] = useState(1);
  // const [testPropNum, setTestPropNum] = useState(1);

  // If discoverMode, pull random number to always rerender component if navigate to it from within component.
  // This is added to dependency array to trigger rerender if we click on "Discover"
  const {discoverTriggerRerender} = useLocation();

  useEffect(() => {
    // If only want feed items for a specific user
    if(userId) {
      dispatch(fetchUserGoals(userId))
      dispatch(fetchUserExerciseEntries(userId))
      dispatch(fetchFollows(userId))
    }

    // Otherwise want "megafeed" consisting of:
    else {
      // Session user's items
      dispatch(fetchUserGoals(sessionUser._id))
      dispatch(fetchUserExerciseEntries(sessionUser._id))
      dispatch(fetchFollows(sessionUser._id))
      
      // Follows items
      dispatch(fetchFollowsGoals())
      dispatch(fetchFollowsExerciseEntries())

      // Discover items
      if(discoverMode) {
        dispatch(fetchDiscoversGoals()) // doesn't do anything yet - pending backend route
        dispatch(fetchDiscoversExerciseEntries()) // doesn't do anything yet - pending backend route

      }
    }

    // dispatch(fetchAllUserGoals()) - do not use this thunk it will not work. Use updated thunks

    // Cleanup:
    // return () => dispatch(clearFeedPostErrors());
  }, [dispatch, discoverTriggerRerender, userId])
  // }, [dispatch, testPropNum])

  if(userId) {
    filterOptions.ownerIds ||= [userId];
  }

  // Filter each GOAL and WORKOUT posts by desired userIds then combine them and sort by options (usually last updated)
  const filteredGoalPosts = filterPostsBy(goalPosts, filterOptions);
  const filteredWorkoutPosts = filterPostsBy(workoutPosts, filterOptions);
  const filteredFollowGoalPosts = filterPostsBy(followsGoals, filterOptions);
  const filteredFollowWorkoutPosts = filterPostsBy(followsWorkouts, filterOptions);
  const filteredDiscoversGoalPosts = filterPostsBy(discoverGoals, filterOptions);
  const filteredDiscoversWorkoutPosts = filterPostsBy(discoverWorkouts, filterOptions);

  const combinedPosts = 
    userId ? [...filteredGoalPosts, ...filteredWorkoutPosts] : 
    discoverMode ? [...filteredGoalPosts, ...filteredWorkoutPosts, ...filteredFollowGoalPosts, ...filteredFollowWorkoutPosts, ...filteredDiscoversGoalPosts, ...filteredDiscoversWorkoutPosts]
      : [...filteredGoalPosts, ...filteredWorkoutPosts, ...filteredFollowGoalPosts, ...filteredFollowWorkoutPosts];
  // const combinedPosts = [...filteredDiscoversGoalPosts, ...filteredDiscoversWorkoutPosts];

  // Temporary fix to remove any possible duplicates:
  const uniquePosts = [];
  const map = new Map();
  for (const post of combinedPosts) {
    if(!map.has(post._id)){
      map.set(post._id, true);
      uniquePosts.push(post);
    }
  }

  // const sortedCombinedPosts = sortFeedPostsBy(combinedPosts, "date");
  const sortedCombinedPosts = sortFeedPostsBy(uniquePosts, "date");

  
  // Conditional header text
  let headerText;
  if(userId){
    if(userId === sessionUser._id) headerText = "your goals and workouts"
    // else headerText = `${sortedGoalPosts ? sortedGoalPosts[0].setter.concat(`...`) : "nothing here..."}`
    else {
      headerText = `${sortedCombinedPosts?.length ? sortedCombinedPosts[0].user.username?.concat("'s goals and workouts") : "nothing here..."}`
    }
  } else if(discoverMode){
    headerText = "other amazing goalgetters";
  } else {
    headerText = "together is better"
  }

  if (sortedCombinedPosts.length === 0) {
    return (
      <>
      <div className='feed-posts-container'>
        <h2>No posts yet. Create a goal or checkout what others have been up to in Discover!</h2>
      </div>
      </> 
    )
  }

  const renderHeaderText = () => {
    const headerLetters = headerText.split("").map((char, idx) => {
      return <span style={{animationDelay: `${(idx + 1) * 0.015}s`}} className='feed-header-letter'>{char}</span>
    })
    return headerLetters;
  }

  const renderPosts = () => {
    
    return sortedCombinedPosts.map((goalPost, index) => goalPost.deadline ?
      <FeedPostGoal key={goalPost._id} feedPost={goalPost} />
      : <FeedPostWorkout key={goalPost._id} feedPost={goalPost} />
    )
  }

  return (
    <>
      <h2 className='feed-header'>{renderHeaderText()}</h2>
      <div className='feed-posts-container'>
        <FollowNavBar />
        <div className='inner-feed-posts-container'>
          {/* <div onClick={e => setTestPropNum(old => old + 1)}>CLICK</div> */}
          {/* {testPropNum} */}
          {/* <TestProps testPropNum={testPropNum}/> */}
          {renderPosts()}
        </div>
      </div>
    </>
  );
}

export default Feed;