import "./FeedPost.css"
import { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { deleteGoal, updateGoal, getGoal, fetchUserGoal } from "../../store/goals";
import { Link } from "react-router-dom";
import { fetchUserExerciseEntries,getUserExerciseEntries } from "../../store/exerciseEntries";
import { createFollow, deleteFollow, getFollows } from "../../store/follows";

function FeedPostGoal ({feedPost}) {
  // props
	const { title, description, deadline, completionDate, updatedAt, user } = feedPost;
	const goalId = feedPost._id
	const username = feedPost.user?.username;
	const userId = feedPost.user?._id;

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
	let isFollowing = followedIds.includes(userId)
	
	// component logic states
	const [editable, setEditable] = useState(false);
	const [showMenu, setShowMenu] = useState(false);

	// Custom display text
	const latestExerciseText = () => {
		if(!exerciseEntries || exerciseEntries.length === 0) return "No workouts yet";
		const lastEntry = exerciseEntries[exerciseEntries.length - 1];
		const lastDate = formatDate(lastEntry.date);
		const text = `Latest workout: ${lastEntry.note} - ${lastDate}`
		return text;
	}

	// controlled inputs
	const [timestamp, setTimeStamp] = useState(new Date(completionDate ? completionDate : updatedAt).toLocaleDateString('en-us', { weekday:"short", month:"short", day:"numeric", hour:"numeric", minute:"numeric", hour12: true}))
	const [formTitle, setFormTitle] = useState(title);
	const [formDescription, setFormDescription] = useState(description);

	// useEffect!
	useEffect(() => {
		if (!showMenu) return;
		const closeMenu = () => {
			setShowMenu(false);
		};

		document.addEventListener('click', closeMenu);
		return () => document.removeEventListener("click", closeMenu);
	}, [showMenu])

	// EVENT HANDLERS
	// Text-area height expands/contracts with input size
	const handleDescriptionChange = e => {
		setFormDescription(e.target.value);
		e.target.style.height = "auto";
		e.target.style.height = e.target.scrollHeight + "px";
	}

	const handleToggleForm = e => {
		setEditable(oldSetEditable => {
			if(oldSetEditable){
				setFormTitle(title);
				setFormDescription(description);
			}
			return !oldSetEditable
		})
	}

	const openMenu = () => {
		if (showMenu) return;
		setShowMenu(true);
	};

	const handleUpdateGoal = e => {
		setEditable(false);
		const updatedGoal = { title:formTitle, description:formDescription, _id:goalId, deadline, completionDate, exerciseEntries, updatedAt }
		dispatch(updateGoal(updatedGoal))
	}

	const handleDeleteGoal = e => {
		dispatch(deleteGoal(goalId))
	}

	const handleToggleFollow = e => {
		if (userId === sessionUser._id) {} //do nothing, don't follow self
		else if (isFollowing) { //unfollow
			const followId = Object.values(follows).find(follow => follow.follower._id === sessionUser._id && follow.followedUser._id === userId)._id
			dispatch(deleteFollow(followId))
		} else { //follow
			dispatch(createFollow(userId))
		} 
	}

	const animateOnce = (e) => {
		const post = e.currentTarget.querySelector(".post-divider");
		post.classList.add("postHoverAnimation");
		setTimeout(() => {
			post.classList.remove("postHoverAnimation");
		}, 500)
	}

  return (
		<div className="feed-post-editable-container" onMouseEnter={animateOnce}>
			{/* CONTENT - START */}
			{/* CONTENT - START */}
			<div className="feed-post-content">
				<div className="feed-post-row feed-post-header">
					<img className="feed-profile-picture" src={user?.imgUrl || "https://aws-fiton.s3.amazonaws.com/vinit-vispute-PO36L2wA8KI-unsplash.jpg"} />
					<Link to={`/feed/${userId}`}><div className={`post-username ${sessionUser._id === userId ? "display-session-username":""}`}>{username}</div></Link>
					<div onClick={handleToggleFollow} className={`post-follow ${isFollowing ? "following" : "not-following"} `}>{(userId === sessionUser._id) ? "" : isFollowing ? "unfollow" : "follow"}</div>
					<div className="post-timestamp">{timestamp}</div>
					{(sessionUser._id === userId) && <div className="post-ellipsis" onClick={openMenu}>
						<i class="fa-solid fa-ellipsis"></i>
						{showMenu && 
							<>
								{/* RECYCLED FROM GOALINDEX - START */}
								{/* RECYCLED FROM GOALINDEX - START */}
								{/* RECYCLED FROM GOALINDEX - START */}
								<ul className="post-dropdown">
									<li onClick={e => setEditable(oldSetEditable => !oldSetEditable)}>
										<i class="far fa-edit"></i>
									</li>
									<div id="goal-dropdown-line"></div>
									<li onClick={handleDeleteGoal}>
										<i class="fa-solid fa-trash-can"></i>
									</li>
								</ul>
								{/* RECYCLED FROM GOALINDEX - END */}
								{/* RECYCLED FROM GOALINDEX - END */}
								{/* RECYCLED FROM GOALINDEX - END */}
							</>
						}
					</div>}
				</div>
				<br/>
				<Link to={`/profile/${userId}`}>{!editable && <div className="feed-post-row">
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
					<div className="feed-post-update-button" onClick={handleUpdateGoal}>Update</div>
					<div className="feed-post-update-button" onClick={handleToggleForm}>Cancel</div>
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
			{/* <div className="feed-post-crud-controls">
				{(sessionUser._id === userId) &&
					<>
						<div className="feed-post-crud-button" onClick={handleToggleForm}>
							<i className="far fa-edit"></i>
						</div>
						<div className="feed-post-crud-button" onClick={handleDeleteGoal}>
							<i className="fa-solid fa-trash-can"></i>
						</div>
					</>
				}
			</div> */}
			{/* CRUD BUTTONS - END */}
			{/* CRUD BUTTONS - END */}
		</div>
  );
}

export default FeedPostGoal;