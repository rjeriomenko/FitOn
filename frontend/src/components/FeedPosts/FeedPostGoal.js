import "./FeedPostGoal.css"
import { useState } from "react";
import { useSelector } from "react-redux";
import { POST_TYPE_GOAL, POST_TYPE_EXERCISE_ENTRY } from "./Feed";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { deleteGoal, updateGoal, getGoal, fetchUserGoal } from "../../store/goals";
import { Link } from "react-router-dom";

function FeedPostGoal ({feedPost, type, triggerRender, setTriggerRender}) {
  // props
	const { title, description, deadline, completionDate, updatedAt } = feedPost;
	const goalId = feedPost._id
	const setter = feedPost.user.username;
	const setterId = feedPost.user._id;
	let { exerciseEntries } = feedPost;

	const formatDate = (dateText) => {
		return new Date(dateText).toLocaleDateString('en-us', { weekday:"short", month:"short", day:"numeric", hour:"numeric", minute:"numeric", hour12: true})
	}

	const latestExerciseText = () => {
		if(!exerciseEntries || exerciseEntries.length === 0) return "No workouts yet";
		const lastEntry = exerciseEntries[exerciseEntries.length - 1];
		const lastDate = formatDate(lastEntry.date);
		const text = `Latest workout: ${lastEntry.note} - ${lastDate}`
		return text;
	}

	// Redux
	const dispatch = useDispatch();
	
	// useSelectors
	const sessionUser = useSelector(state => state.session.user);
	const currentGoal = useSelector(getGoal(goalId));
	
	// component logic states
	const [editable, setEditable] = useState(false);

	// controlled inputs
	const [username, setUsername] = useState("undefined-user")
	const [timestamp, setTimeStamp] = useState('')
	const [formTitle, setFormTitle] = useState('');
	const [formDescription, setFormDescription] = useState('');

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
			.then(res => {
				// setTimeStamp(currentGoal.updatedAt)
				// setTimeStamp(new Date(completionDate ? completionDate : updatedAt).toLocaleDateString('en-us', { weekday:"short", month:"short", day:"numeric", hour:"numeric", minute:"numeric", hour12: true})) 
			})
	}

	const handleDeleteGoal = e => {
		dispatch(deleteGoal(goalId))
			.then(() => setTriggerRender(triggerRender + 1));
	}

	useEffect(() => {
		switch(type){
			case POST_TYPE_EXERCISE_ENTRY:
				break;
			case POST_TYPE_GOAL:
				setUsername(setter)
				setTimeStamp(new Date(completionDate ? completionDate : updatedAt).toLocaleDateString('en-us', { weekday:"short", month:"short", day:"numeric", hour:"numeric", minute:"numeric", hour12: true})) 
				setFormTitle(title)
				setFormDescription(description)
				break;
			default: 
				break;
		}
	}, [dispatch, triggerRender])

  return (
		<div className="feed-post-editable-container">
			{/* CONTENT - START */}
			{/* CONTENT - START */}
			<div className="feed-post-content">
				<div className="feed-post-row feed-post-header">
					<Link to={`/feed/${setterId}`}><div className="post-username">{username}</div></Link>
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
					{/* {`Latest workout: ${exerciseEntries[exerciseEntries.length - 1]?.note} ${new Date(exerciseEntries[exerciseEntries.length - 1]?.date)}`} */}
					{/* <br /> */}
					{/* {exerciseEntries[exerciseEntries.length - 1] ? exerciseEntries[exerciseEntries.length - 1] + " " : "No workouts yet"} */}
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