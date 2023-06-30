import "./FollowNavBar.css";
import { useSelector } from "react-redux";

const FollowNavBar = () => {
	const sessionUser = useSelector(state => state.session.user);
	return (
		<div className="follow-nav-bar-container">
			<ul>
				<li>Follows</li>
				<li>Discover</li>
				<li>{sessionUser.username}</li>
			</ul>
		</div>
	)
}

export default FollowNavBar;