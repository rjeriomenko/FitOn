import "./FeedPost.css"
import { useState } from "react";
import { useSelector } from "react-redux";
import { POST_TYPE_GOAL, POST_TYPE_EXERCISE_ENTRY } from "./Feed";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { deleteGoal, updateGoal, getGoal, fetchUserGoal } from "../../store/goals";
import { Link } from "react-router-dom";
import { fetchUserExerciseEntries,getUserKeyExerciseEntries } from "../../store/exerciseEntries";

function FeedPostWorkout ({feedPost, triggerRender, setTriggerRender}) {
  // props
	// const { title, description, deadline, completionDate, updatedAt } = feedPost;
	const { date, goal, note, rating, user } = feedPost;
	const goalId = goal?._id
	const setter = feedPost.user.username;
	const setterId = feedPost.user._id;
	const formatDate = (dateText) => {
		return new Date(dateText).toLocaleDateString('en-us', { weekday:"short", month:"short", day:"numeric", hour:"numeric", minute:"numeric", hour12: true})
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
	const [formNote, setFormNote] = useState(note);
	const [formRating, setFormRating] = useState(rating);
	const [formDate, setFormDate] = useState(date);
	const [timestamp, setTimeStamp] = useState(new Date(date).toLocaleDateString('en-us', { weekday:"short", month:"short", day:"numeric", hour:"numeric", minute:"numeric", hour12: true}))

	// internal state to trigger rerender - does not display or get used elsewhere
	const [triggerChildRender, setTriggerChildRender] = useState(0);

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

	useEffect(() => {
			setTriggerChildRender(triggerChildRender + 1);
			dispatch(fetchUserExerciseEntries(setterId))
	}, [dispatch, triggerRender])



  return (
		<div className="feed-post-editable-container">
			{/* CONTENT - START */}
			{/* CONTENT - START */}
			<div className="feed-post-content">
				<div className="feed-post-row feed-post-header">
					<Link to={`/feed/${setterId}`}><div className="post-username">{setter}</div></Link>
					<div className="post-follow">{followButtonText()}</div>
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
							{/* {editable ? "Cancel" : "Update"} */}
							<i class="far fa-edit"></i>
						</div>
						{/* <div className="feed-post-crud-button" onClick={handleDeleteWorkout}> */}
						<div className="feed-post-crud-button">
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

export default FeedPostWorkout;