import "./FollowNavBar.css";
import { useSelector } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import { useEffect } from "react";

const FollowNavBar = () => {
	const sessionUser = useSelector(state => state.session.user);
	const randomNum = () => Math.random();

	const resetMarker = (e) => {
		const marker = document.querySelector(".hoverMarker")
		marker.style.transition = "none";
		marker.style.top = e.target.offsetTop;
		marker.style.transition = "all 0.3s";
	}

	const shiftMarker = (e) => {
		const marker = document.querySelector(".hoverMarker")

		// marker.style.transition = "none";



		const link = e.currentTarget.querySelector('a');
		// const linkATAG = link
		if(e.type==="mouseenter") {
			marker.style.opacity = "1";
			marker.style.top = link.offsetTop+'px';
			marker.style.width = link.offsetWidth+'px';
			
			// link.classList.contains("active") ? link.classList.add("follow-nav-active") : e.currentTarget.style.color = "white";
			link.classList.contains("active") ? link.style.color = "black" : e.currentTarget.style.color = "white";
			// link.classList.contains("active") ? e.currentTarget.style.color = "black" : e.currentTarget.style.color = "white";
		}
		if(e.type==="mouseleave") {
			marker.style.opacity = "0";
			// e.currentTarget.style.color = "black";
			// link.classList.contains("active") ? link.classList.remove("follow-nav-active") : e.currentTarget.style.color = "black";
			link.classList.contains("active") ? link.style.color = "#F2490C" : e.currentTarget.style.color = "black";
			// link.classList.contains("active") ? e.currentTarget.style.color = "#F2490Cblack" : e.currentTarget.style.color = "black";
		}
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
		{/* <div className="follow-nav-bar-container" > */}
			<div className="hoverMarker" ></div>
			<ul>
				<li><NavLink exact to={{pathname:`/discover`, discoverTriggerRerender: randomNum()}}>Discover</NavLink></li>
				<li><NavLink exact to={`/feed`}>Follows</NavLink></li>
				<li><NavLink exact to={`/feed/${sessionUser._id}`}>{sessionUser.username}</NavLink></li>
			</ul>
		</div>
	)
}

export default FollowNavBar;