import "./FeedPost.css"
import { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { deleteGoal, updateGoal, getGoal, fetchUserGoal } from "../../store/goals";
import { Link } from "react-router-dom";
import { fetchUserExerciseEntries, getUserExerciseEntries, getGoalExerciseEntries } from "../../store/exerciseEntries";
import { createFollow, deleteFollow, getFollows } from "../../store/follows";

function FeedPostGoal ({feedPost}) {
  // props
	const { title, description, deadline, completionDate, imgUrl, updatedAt, user } = feedPost;
	const goalId = feedPost._id
	const username = feedPost.user?.username;
	const userId = feedPost.user?._id;

	const exerciseEntries = Object.values(useSelector(getGoalExerciseEntries)).filter(entry => entry.goal?._id === goalId)
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
		const lastEntry = exerciseEntries[0];
		const lastDate = formatDate(lastEntry.date);
		const text = `Latest workout: ${lastEntry.note} - ${lastDate}`
		return text;
	}

	// controlled inputs
	const [timestamp, setTimeStamp] = useState(new Date(completionDate ? completionDate : updatedAt).toLocaleDateString('en-us', { weekday:"short", month:"short", day:"numeric", hour:"numeric", minute:"numeric", hour12: true}))
	const [formTitle, setFormTitle] = useState(title);
	const [formDescription, setFormDescription] = useState(description);
	const [image, setImage] = useState(null);

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
		// setEditable(false)
		const updatedGoal = { title:formTitle, description:formDescription, _id:goalId, image, deadline, completionDate, exerciseEntries, updatedAt }
		dispatch(updateGoal(updatedGoal))
			.then(() => setEditable(false))
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
		// const title = document
		post.classList.add("post-hover-animation");
		setTimeout(() => {
			post.classList.remove("post-hover-animation");
		}, 500)
	}

	const updateFile = e => setImage(e.target.files[0]);

  return (
		<div className="feed-post-editable-container" onMouseEnter={animateOnce}>
			{/* CONTENT - START */}
			{/* CONTENT - START */}
			<div className="feed-post-content">
				<div className="feed-post-row feed-post-header">
					<Link to={`/feed/${userId}`}>
					  <img className="feed-profile-picture" src={user?.imgUrl || "https://www.lightsong.net/wp-content/uploads/2020/12/blank-profile-circle.png"} />
					</Link>
					<div className="feed-post-header-container">
						<div className="feed-post-header-text-row">
							<Link to={`/feed/${userId}`}>
								<div className={`post-username ${sessionUser._id === userId ? "display-session-username":""}`}>{username}</div>
							</Link>
							
							{!(userId === sessionUser._id) && <>
								·
								<div onClick={handleToggleFollow} className={`post-follow ${isFollowing ? "following" : "not-following"} `}>{isFollowing ? "following" : "follow"}</div>
							</>}
							·
							<div className="post-timestamp">{timestamp}</div>
						</div>
						<div className="feed-post-header-text-row">
							<div className="feed-post-goal-target">{`Goal Target: ${deadline}`}</div>
						</div>
					</div>
					{(sessionUser._id === userId) && <div className="post-ellipsis" onClick={openMenu}>
						<i className="fa-solid fa-ellipsis"></i>
						{showMenu && 
							<>
								{/* RECYCLED FROM GOALINDEX - START */}
								{/* RECYCLED FROM GOALINDEX - START */}
								{/* RECYCLED FROM GOALINDEX - START */}
								<ul className="post-dropdown">
									<li onClick={e => setEditable(oldSetEditable => !oldSetEditable)}>
										<i className="far fa-edit"></i>
									</li>
									<div id="goal-dropdown-line"></div>
									<li onClick={handleDeleteGoal}>
										<i className="fa-solid fa-trash-can"></i>
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
				<div className="post-toprow">
					<Link to={`/profile/${userId}`}>{!editable && <div className="feed-post-row feed-goal-text-box">
						<div className="post-title post-goal-title">{formTitle}</div>
						{/* <div>·</div> */}
						<div className="post-goal-description">{formDescription}</div>
					</div>}</Link>
				</div>
				
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
					<label>Update Photo
						<input type="file" accept=".jpg, .jpeg, .png" id="imageInput" onChange={updateFile} />
					</label>
					<div className="feed-post-update-button" onClick={handleUpdateGoal}>Update</div>
					<div className="feed-post-update-button" onClick={handleToggleForm}>Cancel</div>
				</>}
			  <img className="feed-goal-picture" src={imgUrl || "https://aws-fiton.s3.amazonaws.com/ricardo-arce-cY_TCKr5bek-unsplash.jpg"} />
				<div className="post-divider"></div>
				<div className="latest-exercise-text">
					{latestExerciseText()}
				</div>
			</div>
			{/* CONTENT - END */}
			{/* CONTENT - END */}
		</div>
  );
}

export default FeedPostGoal;