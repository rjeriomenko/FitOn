import "./FeedPost.css"
import { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { deleteGoal, updateGoal, getGoal, fetchUserGoal } from "../../store/goals";
import { Link } from "react-router-dom";
import { fetchUserExerciseEntries,getUserExerciseEntries } from "../../store/exerciseEntries";
import { createFollow, deleteFollow, getFollows } from "../../store/follows";

function FeedPostWorkout ({feedPost, triggerRender, setTriggerRender}) {
  // props
	const { date, goal, note, rating, user } = feedPost;
	const goalId = goal?._id
	const setter = feedPost.user.username;
	const setterId = feedPost.user._id;
	const formatDate = (dateText) => {
		return new Date(dateText).toLocaleDateString('en-us', { weekday:"short", month:"short", day:"numeric", hour:"numeric", minute:"numeric", hour12: true})
	}

	// Redux
	const dispatch = useDispatch();
	
	// useSelectors
	const sessionUser = useSelector(state => state.session.user);
	const follows = useSelector(getFollows);
	const followedIds = Object.values(follows).map(followObj => followObj?.followedUser?._id);
	let isFollowing = followedIds.includes(setterId)

	// component logic states
	const [editable, setEditable] = useState(false);

	// controlled inputs
	const [formNote, setFormNote] = useState(note);
	const [formRating, setFormRating] = useState(rating);
	const [formDate, setFormDate] = useState(date);
	const [timestamp, setTimeStamp] = useState(new Date(date).toLocaleDateString('en-us', { weekday:"short", month:"short", day:"numeric", hour:"numeric", minute:"numeric", hour12: true}))

	// internal state to trigger rerender - does not display or get used elsewhere

	// const handleUpdateWorkout = e => {
	// 	setEditable(false);
	// 	const updatedWorkout = { note:formNote, rating:formRating, date:formDate, goal, user }
	// 	dispatch(updateGoal(updatedGoal)) //NEED NEW THUNK!!!!!!!!
	// 		.then(res => {
	// 			setTriggerRender(triggerRender + 1)
	// 		})
	// }

	// const handleDeleteWorkout = e => {
	// 	dispatch(deleteGoal(goalId)) //NEED NEW THUNK!!!!!!!!
	// 		.then(() => setTriggerRender(triggerRender + 1));
	// }

	// useEffect(() => {
	// 		setTriggerChildRender(triggerChildRender + 1);
	// 		dispatch(fetchUserExerciseEntries(setterId))
	// }, [dispatch, triggerRender])

	const handleToggleForm = e => {
		setEditable(oldSetEditable => {
			if(oldSetEditable){
				setFormNote(note);
				setFormRating(rating);
				setFormDate(date);
			}
			return !oldSetEditable
		})
	}

	const handleToggleFollow = e => {
		if (setterId === sessionUser._id) {} //do nothing, don't follow self
		else if (isFollowing) { //unfollow
			const followId = Object.values(follows).find(follow => follow.follower._id === sessionUser._id && follow.followedUser._id === setterId)._id
			dispatch(deleteFollow(followId))
				.then(() => {
					// setIsFollowing(false)
					// isFollowing = false;
					// setFollowText(followButtonText())
					setTriggerRender(triggerRender * Math.random());

				})
		} else { //follow
			dispatch(createFollow(setterId))
				.then(() => {
					// setIsFollowing(true)
					// isFollowing = true;
					// setFollowText(followButtonText())
					setTriggerRender(triggerRender * Math.random());
				})
		} 
	}

  return (
		<div className="feed-post-editable-container">
			{/* CONTENT - START */}
			{/* CONTENT - START */}
			<div className="feed-post-content">
				<div className="feed-post-row feed-post-header">
					<Link to={`/feed/${setterId}`}><div className="post-username">{setter}</div></Link>
					<div onClick={handleToggleFollow} className="post-follow">{(setterId === sessionUser._id) ? "" : isFollowing ? "unfollow" : "follow"}</div>
					<div className="post-timestamp">{timestamp}</div>
				</div>
				<br/>
				<Link to={`/profile`}>{!editable && <div className="feed-post-row">
					<span className="post-goal-title">{formNote}</span>
					<span className="post-workout-rating">{formRating}</span>
				</div>}</Link>
				
				{editable && <>
					<label>Note: 
						<input className="feed-post-text-edit"
							type="text"
							value={formNote}
							onChange={e => setFormNote(e.target.value)}
						/>
					</label>
					{/* <div className="feed-post-crud-button" onClick={handleUpdateWorkout}>Update</div> */}
					<div className="feed-post-crud-button">Update</div>
				</>}
				<div className="post-divider"></div>
			</div>
			{/* CONTENT - END */}
			{/* CONTENT - END */}

			{/* CRUD BUTTONS - START */}
			{/* CRUD BUTTONS - START */}
			<div className="feed-post-crud-controls">
				{(sessionUser._id === setterId) &&
					<>
						<div className="feed-post-crud-button" onClick={e => setEditable(oldSetEditable => !oldSetEditable)}>
							<i className="far fa-edit"></i>
						</div>
						{/* <div className="feed-post-crud-button" onClick={handleDeleteWorkout}> */}
						<div className="feed-post-crud-button">
							<i className="fa-solid fa-trash-can"></i>
						</div>
					</>
				}
			</div>
			{/* CRUD BUTTONS - END */}
			{/* CRUD BUTTONS - END */}
		</div>
  );
}

export default FeedPostWorkout;