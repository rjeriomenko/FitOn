import "./FollowNavBar.css";
import { useSelector } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import { useEffect } from "react";

const FollowNavBar = ({goalsOnly, setGoalsOnly, workoutsOnly, setWorkoutsOnly}) => {
	const sessionUser = useSelector(state => state.session.user);
	const randomNum = () => Math.random();

	const resetMarker = (e) => {
		const marker = document.querySelector(".hoverMarker")
		marker.style.transition = "none";
		marker.style.top = e.target.style.offsetTop;
		marker.style.transition = "all 0.3s";
	}

	const shiftMarker = (e) => {
		const marker = document.querySelector(".hoverMarker")

		const link = e.currentTarget.querySelector('a');
		if(e.type==="mouseenter") {
			marker.style.opacity = "1";
			marker.style.top = (link.offsetTop - 2)+'px';
			marker.style.left = (link.offsetLeft - 2)+'px';
			marker.style.height = (link.offsetHeight + 4)+'px';
			marker.style.width = (link.offsetWidth + 6)+'px';
			link.classList.contains("active") ? link.style.color = "navy" : e.currentTarget.style.color = "white";
			link.classList.contains("active") ? marker.style.boxShadow = "2px 2px black" : marker.style.boxShadow = "2px 2px plum";
		}
		if(e.type==="mouseleave") {
			marker.style.opacity = "0";
			link.classList.contains("active") ? link.style.color = "#F2490C" : e.currentTarget.style.color = "black";
			marker.style.boxShadow = ""
		}
	}

	const toggleGoalsOnly = (e) => {
		setGoalsOnly(oldval => !oldval)
		if(workoutsOnly) setWorkoutsOnly(false)
	}

	const toggleWorkoutsOnly = (e) => {
		setWorkoutsOnly(oldval => !oldval)
		if(goalsOnly) setGoalsOnly(false)
	}

	useEffect(() => {
		const links = document.querySelector(".follow-nav-bar-container").querySelectorAll("li");
		links.forEach(link => {
			link.addEventListener("mouseenter", shiftMarker)
			link.addEventListener("mouseleave", shiftMarker)
		})
		return () => {
			links.forEach(link => link.removeEventListener("mouseenter", shiftMarker))
			links.forEach(link => link.removeEventListener("mouseleave", shiftMarker))
		}
	}, [])

	return (
		<div className="follow-nav-bar-container" onMouseEnter={resetMarker}>
			<div className="hoverMarker" ></div>
			<ul>
				<li><NavLink exact to={{pathname:`/discover`, discoverTriggerRerender: randomNum()}}>Discover</NavLink></li>
				<li><NavLink exact to={`/feed`}>Follows</NavLink></li>
				<li><NavLink exact to={`/feed/${sessionUser._id}`}>{sessionUser.username}</NavLink></li>
			</ul>
			<div className="post-type-filter-container">
				<div className={`post-filter-option post-type-filter-goals ${goalsOnly ? "active-filter" : ""}`} onClick={toggleGoalsOnly}>
					<i class="fa-solid fa-arrows-to-circle"></i>
				</div>
				{/* <div className="post-type-filter-container-divider"></div> */}
				<div className={`post-filter-option post-type-filter-workouts ${workoutsOnly ? "active-filter" : ""}`} onClick={toggleWorkoutsOnly}>
					<i class="fa-solid fa-person-running"></i>
				</div>
			</div>
		</div>
	)
}

export default FollowNavBar;