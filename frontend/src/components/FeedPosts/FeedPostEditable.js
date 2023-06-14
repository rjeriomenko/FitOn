import "./FeedPostEditable.css"
import { useState } from "react";
import { useSelector } from "react-redux";
import { POST_TYPE_GOAL, POST_TYPE_EXERCISE_ENTRY } from "./Feed";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { deleteGoal, updateGoal } from "../../store/goals";

function FeedPostEditable ({feedPost, type}) {
  // props
	const { goalId, setter, setterId, title, description, deadline, completionDate, exerciseEntries, updatedAt } = feedPost;
	exerciseEntries ||= [];

	// Redux
	const dispatch = useDispatch();
	
	// useSelectors
	const sessionUser = useSelector(state => state.session.user);
	
	// component logic states
	const [editable, setEditable] = useState(false);

	// controlled inputs
	const [username, setUsername] = useState("undefined-user")
	const [timestamp, setTimeStamp] = useState('')
	const [content, setContent] = useState('');
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
		const updatedGoal = { title:formTitle, description:formDescription, deadline, completionDate, exerciseEntries, updatedAt }
		dispatch(updateGoal(setterId, updatedGoal));
	}

	const handleDeleteGoal = e => {
		dispatch(deleteGoal(setterId, goalId))
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
				const contentString = 
					(title ? title + " " : "") + 
					(description ? description + " " : "") + 
					(exerciseEntries[exerciseEntries.length - 1] ? exerciseEntries[exerciseEntries.length - 1] + " " : "")
					;
				setContent(contentString);
				break;
			default: 
				break;
		}
	}, [])

  return (
		<div className="feed-post-editable-container">
			{/* CONTENT - START */}
			{/* CONTENT - START */}
			<div className="feed-post-content">
				<div className="feed-post-row feed-post-header">
					<div className="post-username">{username}</div>
					<div>{timestamp}</div>
				</div>
				<br/>
				{!editable && <div className="feed-post-row">
					<span className="post-goal-title">{formTitle}</span>
					<span>·</span>
					<span className="post-goal-description">{formDescription}</span>
				</div>}
				
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
				<div>
					{exerciseEntries[exerciseEntries.length - 1] ? exerciseEntries[exerciseEntries.length - 1] + " " : "No workouts yet"}
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

export default FeedPostEditable;