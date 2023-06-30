import "./FollowNavBar.css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const FollowNavBar = () => {
	const sessionUser = useSelector(state => state.session.user);
	return (
		<div className="follow-nav-bar-container">
			<ul>
				<li><Link to={`/feed`}>Follows</Link></li>
				<li><Link to={`/feed`}>Discover</Link></li>
				<li><Link to={`/feed/${sessionUser._id}`}>{sessionUser.username}</Link></li>
			</ul>
		</div>
	)
}

export default FollowNavBar;