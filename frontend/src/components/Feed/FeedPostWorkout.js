import "./FeedPost.css"
import { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { deleteExerciseEntry, fetchUserExerciseEntries,getUserExerciseEntries, updateExerciseEntry } from "../../store/exerciseEntries";
import { createFollow, deleteFollow, getFollows } from "../../store/follows";
import { fetchWorkoutExercises, getWorkoutKeyExercises } from "../../store/exercises";

function FeedPostWorkout ({feedPost}) {
  // props
	const { date, goal, note, rating, imgUrl, updatedAt, user, _id } = feedPost;
	const goalId = goal?._id
	const username = feedPost.user?.username;
	const userId = feedPost.user?._id;
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
	const exercises = Object.values(useSelector(getWorkoutKeyExercises)).filter(exercise => exercise.workout._id === _id);
	// console.log(exercises);

	// Local variables based on useSelectors
	// const totalTime = BOOKMARK

	// component logic states
	const [editable, setEditable] = useState(false);
	const [showMenu, setShowMenu] = useState(false);

	// helpers to initialize controlled inputs
	// timestamp for workouts default to last updated date if user specified "date" is not valid
	const formatWorkoutDate = () => {
		const userSpecifiedDate = new Date(date).toLocaleDateString('en-us', { weekday:"short", month:"short", day:"numeric", hour:"numeric", minute:"numeric", hour12: true});
		const lastUpdatedDate = new Date(updatedAt).toLocaleDateString('en-us', { weekday:"short", month:"short", day:"numeric", hour:"numeric", minute:"numeric", hour12: true});
		return userSpecifiedDate === "Invalid Date" ? lastUpdatedDate : userSpecifiedDate
	}

	// controlled inputs
	const [formNote, setFormNote] = useState(note);
	const [formRating, setFormRating] = useState(rating);
	const [formDate, setFormDate] = useState(date);
	const [timestamp, setTimeStamp] = useState(formatWorkoutDate())

	// useEffect!
	useEffect(() => {

		dispatch(fetchWorkoutExercises(_id));

		if (!showMenu) return;
		const closeMenu = () => {
			setShowMenu(false);
		};

		document.addEventListener('click', closeMenu);
		return () => document.removeEventListener("click", closeMenu);
	}, [showMenu])

	const handleUpdateWorkout = e => {
		setEditable(false);
		const updatedWorkout = { note:formNote, rating:formRating, date:formDate, goal, user }
		dispatch(updateExerciseEntry(_id, updatedWorkout))
	}

	const handleDeleteWorkout = e => {
		dispatch(deleteExerciseEntry(_id))
	}

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

	const openMenu = () => {
		if (showMenu) return;
		setShowMenu(true);
	};

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
		post.classList.add("post-hover-animation");
		setTimeout(() => {
			post.classList.remove("post-hover-animation");
		}, 500)
	}

  return (
		<div className="feed-post-editable-container" onMouseEnter={animateOnce}>
			{/* CONTENT - START */}
			{/* CONTENT - START */}
			<div className="feed-post-content">
				<div className="feed-post-row feed-post-header">
					<Link to={`/feed/${userId}`}>
						<img className="feed-profile-picture" src={user?.imgUrl || "https://aws-fiton.s3.amazonaws.com/vinit-vispute-PO36L2wA8KI-unsplash.jpg"} />
					</Link>
					<Link to={`/feed/${userId}`}>
						<div className={`post-username ${sessionUser._id === userId ? "display-session-username":""}`}>{username}</div>
					</Link>
					{!(userId === sessionUser._id) && <div onClick={handleToggleFollow} className={`post-follow ${isFollowing ? "following" : "not-following"} `}>{isFollowing ? "unfollow" : "follow"}</div>}
					<div className="post-timestamp">{timestamp}</div>
					{(sessionUser._id === userId) && <div className="post-ellipsis" onClick={openMenu}>
						<i class="fa-solid fa-ellipsis"></i>
						{showMenu && 
							<>
								{/* DROPDOWN - START */}
								{/* DROPDOWN - START */}
								<ul className="post-dropdown">
									<li onClick={e => setEditable(oldSetEditable => !oldSetEditable)}>
										<i class="far fa-edit"></i>
									</li>
									<div id="goal-dropdown-line"></div>
									<li onClick={handleDeleteWorkout}>
										<i class="fa-solid fa-trash-can"></i>
									</li>
								</ul>
								{/* DROPDOWN - END */}
								{/* DROPDOWN - END */}
							</>
						}
					</div>}
				</div>
				<br/>
				<div className="post-toprow">
					<Link to={`/profile/${userId}`}>{!editable && <div className="feed-post-row">
						<span className="post-goal-title">{formNote}</span>
						<div className="post-workout-subtitle">
							<div className="post-workout-time-total">
								<i class="fa-solid fa-clock"></i>&nbsp;{"50 minutes"}
							</div>
							<div className={`post-workout-rating post-rating-${formRating}`}>{formRating}</div>
						</div>
					  <img className="feed-workout-picture" src={imgUrl || "https://aws-fiton.s3.amazonaws.com/mat-kilkeary-kSCmit8eYo0-unsplash.jpg"} />
					</div>}</Link>
				</div>

				<div className="post-exercises-container">
					<div className="workout-exercise-list-header">
						<div><i></i></div>
						<div><i class="fa-solid fa-layer-group"></i></div>
						<div><i class="fa-solid fa-rotate-right"></i></div>
						<div><i class="fa-solid fa-weight-hanging"></i></div>
						<div><i class="fa-solid fa-clock"></i></div>
						<div className="workout-exercise-row"></div>
					</div>
					{exercises.map(exercise => (
						<div className="post-exercise-row">
							<div>{`${exercise.name}`}</div>
							<div className="post-exercise-num">{`${exercise.sets ? exercise.sets : "n/a" }`}</div>
							<div className="post-exercise-num">{`${exercise.reps ? exercise.reps : "n/a" }`}</div>
							<div className="post-exercise-num">{`${exercise.weight ? exercise.weight : "n/a" }`}</div>
							<div className="post-exercise-num">{`${exercise.weight ? exercise.weight+" mins" : "n/a" }`}</div>
						</div>
					))}
					{exercises.length === 0 && <div className="empty-workout">No exercises yet!</div>}
				</div>
				
				{editable && <>
					<form className="post-form" onSubmit={handleUpdateWorkout}>
					<label>Rating: 
						<input className="feed-post-text-edit"
							type="number"
							min="1"
							max="5"
							value={formRating}
							onChange={e => setFormRating(e.target.value)}
							required
						/>
					</label>
					<label>Note: 
						<input className="feed-post-text-edit"
							type="text"
							value={formNote}
							onChange={e => setFormNote(e.target.value)}
						/>
					</label>
					{/* <div className="feed-post-update-button" onClick={handleUpdateWorkout}>Update</div> */}
					<button className="feed-post-update-button" type="submit">Update</button>
					<div className="feed-post-update-button" onClick={handleToggleForm}>Cancel</div>
					</form>
				</>}
				<div className="post-divider"></div>
			</div>
			{/* CONTENT - END */}
			{/* CONTENT - END */}
		</div>
  );
}

export default FeedPostWorkout;