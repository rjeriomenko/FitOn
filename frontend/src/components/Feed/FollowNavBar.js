import "./FollowNavBar.css";
import { useSelector } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import { useEffect } from "react";

const FollowNavBar = ({goalsOnly, setGoalsOnly, workoutsOnly, setWorkoutsOnly}) => {
	const sessionUser = useSelector(state => state.session.user);
	const randomNum = () => Math.random();

	const resetMarker = (e) => {
		const marker = document.querySelector(".hover-marker")
		// marker.style.width = "0px"
		const topLink = document.querySelector(".feed-nav-top-link").querySelector("a")
		const midLink = document.querySelector(".feed-nav-mid-link").querySelector("a")
		const botLink = document.querySelector(".feed-nav-bot-link").querySelector("a")
		
		let link;
		const topEdgeY = document.querySelector(".feed-nav-mid-link").offsetTop;
		const botEdgeY = document.querySelector(".feed-nav-mid-link").offsetTop + document.querySelector(".feed-nav-mid-link").offsetHeight;
		const relativeMouseY = e.pageY - e.target.getBoundingClientRect().y
		if(e.type === "mouseenter"){
			marker.style.transition = "all 0s";
		
			if(relativeMouseY <= topEdgeY - 2) {
				link = topLink;
				// marker.style.top = (topEdgeY - topLink.offsetHeight) +"px";
			} else if(relativeMouseY > botEdgeY) {
				link = botLink;
				// marker.style.top = botEdgeY + ("px");
			} else {
				link = midLink;
				// marker.style.top = topEdgeY + ("px");
			}
			
			marker.style.width = (link.offsetWidth + 6)+'px';
			marker.style.top = (link.offsetTop - 2)+'px';
			marker.style.left = (link.offsetLeft - 2)+'px';
			marker.style.height = (link.offsetHeight + 4)+'px';
			// link.classList.contains("active") ? link.style.color = "navy" : link.style.color = "white";
			// link.classList.contains("active") ? marker.style.boxShadow = "2px 2px black" : marker.style.boxShadow = "2px 2px plum";
			marker.style.transition = "transform 0.3s, top 0.3s, left 0.3s, height 0.3s, width 0.3s, color 0.3s, box-shadow 0.3s, opacity 0.3s";
			marker.style.opacity = "1";
			marker.style.transform = "rotateX(0deg)";
		}

		else if(e.type === "mouseleave"){

			if(relativeMouseY < topEdgeY) {
				link = topLink;
			} else if(relativeMouseY > botEdgeY) {
				link = botLink;
			} else {
				link = midLink;
			}

			marker.style.transition = "transform 0.3s, top 0.3s, left 0.3s, height 0.3s, width 0.3s, color 1.3s, background-color 0.3s, box-shadow 0.3s, opacity 0.8s";
			marker.style.opacity = "0";
			marker.style.transform = "rotateX(90deg) skewX(10deg)";
			// link.classList.contains("active") ? link.style.color = "#F2490C" : link.style.color = "black";
			marker.style.boxShadow = ""
			// setTimeout(() => {
			// 	marker.style.transition = "all 0s";
			// }, 1300)
		}
	}

	const shiftMarker = (e) => {
		e.stopPropagation();
		const marker = document.querySelector(".hover-marker")

		// const link = e.currentTarget;
		const link = e.currentTarget.querySelector('a');
		marker.style.opacity = "1";
		if(e.type==="mouseenter") {
			marker.style.top = (link.offsetTop - 2)+'px';
			marker.style.left = (link.offsetLeft - 2)+'px';
			marker.style.height = (link.offsetHeight + 4)+'px';
			marker.style.width = (link.offsetWidth + 6)+'px';
			link.classList.contains("active") ? link.style.color = "navy" : link.style.color = "white";
			link.classList.contains("active") ? marker.style.boxShadow = "2px 2px black" : marker.style.boxShadow = "2px 2px plum";
			
		}
		if(e.type==="mouseleave") {
			marker.style.opacity = "1";
			link.classList.contains("active") ? link.style.color = "#F2490C" : link.style.color = "black";
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
		// const linksBox = document.querySelector(".feed-links-box")
		// const links = linksBox.querySelectorAll("a");
		links.forEach(link => {
			link.addEventListener("mouseenter", shiftMarker)
			link.addEventListener("mouseleave", shiftMarker)
		})
		return () => {
			links.forEach(link => {
				link.removeEventListener("mouseenter", shiftMarker)
				link.removeEventListener("mouseleave", shiftMarker)
			})
		}
	}, [])

	return (
		<div className="follow-nav-bar-container" >
			<div className="hover-marker" ></div>
			<div className="feed-links-box" onMouseEnter={resetMarker} onMouseLeave={resetMarker}>
				<ul className="feed-links-list">
					<li className="feed-nav-top-link"><NavLink exact to={{pathname:`/discover`, discoverTriggerRerender: randomNum()}}>Discover</NavLink></li>
					<li className="feed-nav-mid-link"><NavLink exact to={`/feed`}>Follows</NavLink></li>
					<li className="feed-nav-bot-link"><NavLink exact to={`/feed/${sessionUser._id}`}>{sessionUser.username}</NavLink></li>
				</ul>
			</div>
			<div className="post-type-filter-container">
				<div className={`post-filter-option post-type-filter-goals ${goalsOnly ? "active-filter" : ""}`} onClick={toggleGoalsOnly}>
					<i className="fa-solid fa-arrows-to-circle"></i>
				</div>
				{/* <div className="post-type-filter-container-divider"></div> */}
				<div className={`post-filter-option post-type-filter-workouts ${workoutsOnly ? "active-filter" : ""}`} onClick={toggleWorkoutsOnly}>
					<i className="fa-solid fa-person-running"></i>
				</div>
			</div>
		</div>
	)
}

export default FollowNavBar;