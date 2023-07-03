import "./FeedPost.css"
import { useState } from "react";
import { useSelector } from "react-redux";
import { POST_TYPE_GOAL, POST_TYPE_EXERCISE_ENTRY } from "./Feed";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { deleteGoal, updateGoal, getGoal, fetchUserGoal } from "../../store/goals";
import { Link } from "react-router-dom";
import { fetchUserExerciseEntries,getUserExerciseEntries } from "../../store/exerciseEntries";
import { createFollow, deleteFollow, getFollows } from "../../store/follows";

function FeedPostGoal ({feedPost, triggerRender, setTriggerRender}) {
  // props
	const { title, description, deadline, completionDate, updatedAt } = feedPost;
	const goalId = feedPost._id
	const setter = feedPost.user.username;
	const setterId = feedPost.user._id;
	// let { exerciseEntries } = feedPost;

	const exerciseEntries = Object.values(useSelector(getUserExerciseEntries)).filter(entry => entry.goal?._id === goalId)
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

	// Custom display text
	const latestExerciseText = () => {
		if(!exerciseEntries || exerciseEntries.length === 0) return "No workouts yet";
		const lastEntry = exerciseEntries[exerciseEntries.length - 1];
		const lastDate = formatDate(lastEntry.date);
		const text = `Latest workout: ${lastEntry.note} - ${lastDate}`
		return text;
	}
	// const followButtonText = () => {
	// 	// Should depend on whether we are following a user. Clicking will toggle.
	// 	// Follows slice of state should be populated in the Feed,
	// 	// and listen to updates triggered by buttons on child subcomponent
	// 	// let followButtonText;
	// 	// if (setterId === sessionUser._id) followButtonText = "";
	// 	// else if (followedIds.includes(setterId)) followButtonText = "unfollow"
	// 	// else followButtonText = "follow";
	// 	// debugger
	// 	// return followButtonText;
	// 	console.log(followedIds);
	// 	debugger
	// 	return (setterId === sessionUser._id) ? "" : isFollowing ? "unfollow" : "follow"
	// }

	// controlled inputs
	const [username, setUsername] = useState(setter)
	const [timestamp, setTimeStamp] = useState(new Date(completionDate ? completionDate : updatedAt).toLocaleDateString('en-us', { weekday:"short", month:"short", day:"numeric", hour:"numeric", minute:"numeric", hour12: true}))
	const [formTitle, setFormTitle] = useState(title);
	const [formDescription, setFormDescription] = useState(description);
	// const [followText, setFollowText] = useState(followButtonText());
	// const [isFollowing, setIsFollowing] = useState(followedIds.includes(setterId))
	

	// debugger

	// EVENT HANDLERS
	// Text-area height expands/contracts with input size
	const handleDescriptionChange = e => {
		setFormDescription(e.target.value);
		e.target.style.height = "auto";
		e.target.style.height = e.target.scrollHeight + "px";
	}

	const handleUpdateGoal = e => {
		setEditable(false);
		const updatedGoal = { title:formTitle, description:formDescription, _id:goalId, deadline, completionDate, exerciseEntries, updatedAt }
		dispatch(updateGoal(updatedGoal))
			.then(() => setTriggerRender(triggerRender * Math.random()));
	}

	const handleDeleteGoal = e => {
		dispatch(deleteGoal(goalId))
			.then(() => setTriggerRender(triggerRender * Math.random()));
	}

	const handleToggleFollow = e => {
		if (setterId === sessionUser._id) {} //do nothing, don't follow self
		else if (isFollowing) { //unfollow
			// follower is sessionUser
			// followedUser is post.user._id
			const followId = Object.values(follows).find(follow => follow.follower._id === sessionUser._id && follow.followedUser._id === setterId)._id
			dispatch(deleteFollow(followId))
				.then(() => {
					// setIsFollowing(false)
					// isFollowing = false;
					// setFollowText(followButtonText())
					setTriggerRender(triggerRender * Math.random());

				})
		} 
		else { //follow
			dispatch(createFollow(setterId))
				.then(() => {
					// setIsFollowing(true)
					// isFollowing = true;
					// setFollowText(followButtonText())
					setTriggerRender(triggerRender * Math.random());
				})
		} 
	}

	// useEffect(() => {
	// 	setTriggerChildRender(triggerChildRender + 1);
	// }, [triggerRender])

	// useEffect(() => {
	// 		setTriggerChildRender(triggerChildRender + 1);
	// 		dispatch(fetchUserExerciseEntries(setterId))
	// }, [dispatch, triggerRender])



  return (
		<div className="feed-post-editable-container">
			{/* CONTENT - START */}
			{/* CONTENT - START */}
			<div className="feed-post-content">
				<div className="feed-post-row feed-post-header">
					{isFollowing ? "AM FOLLOWING" : "NOT FOLLOWING"}
					<Link to={`/feed/${setterId}`}><div className="post-username">{username}</div></Link>
					<div onClick={handleToggleFollow} className="post-follow">{(setterId === sessionUser._id) ? "" : isFollowing ? "unfollow" : "follow"}</div>
					<div className="post-timestamp">{timestamp}</div>
				</div>
				<br/>
				<Link to={`/profile`}>{!editable && <div className="feed-post-row">
					<span className="post-goal-title">{formTitle}</span>
					<span>·</span>
					<span className="post-goal-description">{formDescription}</span>
				</div>}</Link>
				
				{editable && <>
					<label>Title
						<input className="feed-post-text-edit"
							type="text"
							value={formTitle}
							onChange={e => setFormTitle(e.target.value)}
						/>
					</label>
					<label>Description
						<textarea className="feed-post-text-edit"
							contentEditable={true}
							value={formDescription}
							onChange={handleDescriptionChange}
						/>
					</label>
					<div className="feed-post-crud-button" onClick={handleUpdateGoal}>Update</div>
				</>}
				<div className="post-divider"></div>
				<div className="latest-exercise-text">
					{latestExerciseText()}
				</div>
			</div>
			{/* CONTENT - END */}
			{/* CONTENT - END */}

			{/* CRUD BUTTONS - START */}
			{/* CRUD BUTTONS - START */}
			<div className="feed-post-crud-controls">
				{(sessionUser._id === setterId) &&
					<>
						<div className="feed-post-crud-button" onClick={e => setEditable(oldSetEditable => !oldSetEditable)}>
							{/* {editable ? "Cancel" : "Update"} */}
							<i class="far fa-edit"></i>
						</div>
						<div className="feed-post-crud-button" onClick={handleDeleteGoal}>
							<i class="fa-solid fa-trash-can"></i>
						</div>
					</>
				}
			</div>
			{/* CRUD BUTTONS - END */}
			{/* CRUD BUTTONS - END */}
		</div>
  );
}

export default FeedPostGoal;