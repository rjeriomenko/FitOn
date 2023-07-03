import "./FollowNavBar.css";
import { useSelector } from "react-redux";
import { NavLink, Link } from "react-router-dom";

const FollowNavBar = () => {
	const sessionUser = useSelector(state => state.session.user);
	return (
		<div className="follow-nav-bar-container">
			<ul>
				<li><NavLink exact to={`/discover`}>Discover</NavLink></li>
				<li><NavLink exact to={`/feed`}>Follows</NavLink></li>
				<li><NavLink exact to={`/feed/${sessionUser._id}`}>{sessionUser.username}</NavLink></li>
			</ul>
		</div>
	)
}

export default FollowNavBar;