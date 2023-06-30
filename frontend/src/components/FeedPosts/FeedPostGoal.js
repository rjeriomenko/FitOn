import "./FeedPost.css"
import { useState } from "react";
import { useSelector } from "react-redux";
import { POST_TYPE_GOAL, POST_TYPE_EXERCISE_ENTRY } from "./Feed";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { deleteGoal, updateGoal, getGoal, fetchUserGoal } from "../../store/goals";
import { Link } from "react-router-dom";
import { fetchUserExerciseEntries,getUserKeyExerciseEntries } from "../../store/exerciseEntries";

function FeedPostGoal ({feedPost, triggerRender, setTriggerRender}) {
  // props
	const { title, description, deadline, completionDate, updatedAt } = feedPost;
	const goalId = feedPost._id
	const setter = feedPost.user.username;
	const setterId = feedPost.user._id;
	// let { exerciseEntries } = feedPost;
	const exerciseEntries = Object.values(useSelector(getUserKeyExerciseEntries)).filter(entry => entry.goal?._id === goalId)
	const formatDate = (dateText) => {
		return new Date(dateText).toLocaleDateString('en-us', { weekday:"short", month:"short", day:"numeric", hour:"numeric", minute:"numeric", hour12: true})
	}

	// Custom display text
	const latestExerciseText = () => {
		if(!exerciseEntries || exerciseEntries.length === 0) return "No workouts yet";
		const lastEntry = exerciseEntries[exerciseEntries.length - 1];
		const lastDate = formatDate(lastEntry.date);
		const text = `Latest workout: ${lastEntry.note} - ${lastDate}`
		return text;
	}
	const followButtonText = () => {
		// Should depend on whether we are following a user. Clicking will toggle.
		// Follows slice of state should be populated in the Feed,
		// and listen to updates triggered by buttons on child subcomponent

		// Placeholder:
		return "follow";
	}

	// Redux
	const dispatch = useDispatch();
	
	// useSelectors
	const sessionUser = useSelector(state => state.session.user);
	
	// component logic states
	const [editable, setEditable] = useState(false);

	// controlled inputs
	const [username, setUsername] = useState(setter)
	const [timestamp, setTimeStamp] = useState(new Date(completionDate ? completionDate : updatedAt).toLocaleDateString('en-us', { weekday:"short", month:"short", day:"numeric", hour:"numeric", minute:"numeric", hour12: true}))
	const [formTitle, setFormTitle] = useState(title);
	const [formDescription, setFormDescription] = useState(description);

	// internal state to trigger rerender - does not display or get used elsewhere
	const [triggerChildRender, setTriggerChildRender] = useState(0);

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
					<Link to={`/feed/${setterId}`}><div className="post-username">{username}</div></Link>
					<div className="post-follow">{followButtonText()}</div>
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