import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/session';
import './NavBar.css';

function NavBar () {
  const loggedIn = useSelector(state => !!state.session.user);
  const dispatch = useDispatch();
  
  const logoutUser = e => {
      e.preventDefault();
      dispatch(logout());
  }

  const getLinks = () => {
    if (loggedIn) {
      return (
        <div className="links-nav">
          <Link to={'/feedPosts'}>All FeedPosts</Link>
          <Link to={'/profile'}>Profile</Link>
          <Link to={'/feedPosts/newGoal'}>Create a new goal</Link>
          <button onClick={logoutUser}>Logout</button>
        </div>
      );
    } else {
      return (
        <div className="links-auth">
          <Link to={'/signup'}>Signup</Link>
          <Link to={'/login'}>Login</Link>
        </div>
      );
    }
  }

  return (
    <div className='nav-bar-container'>
      <h1>FitOn</h1>
			<div className='links-menu'>
      	{ getLinks() }

			</div>
    </div>
  );
}

export default NavBar;