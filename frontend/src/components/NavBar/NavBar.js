import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/session';
import { Redirect } from 'react-router-dom';
import { createGoal } from "../../store/goals";

import './NavBar.css';

function NavBar () {
  const loggedIn = useSelector(state => !!state.session.user);
  const sessionUser = useSelector(state => state.session.user);
  const dispatch = useDispatch();
  
  const logoutUser = e => {
      e.preventDefault();
      dispatch(logout());
  }

  const getLinks = () => {
    if (loggedIn) {
      return (
        <ul className="links-nav nav-links">
          <li id="nav-link-id"><Link to={'/feed'}>Home</Link></li>
          <li id="nav-link-id"><Link to={'/profile'}>Tools</Link></li>
          <li id="nav-link-id"><Link to={'/feedPosts/newGoal'}>Create Goal</Link></li>
          {/* <li><Link to={'/feedPosts/editGoal'}>Edit goal</Link></li> */}
          <li id="nav-link-id"><Link to={`/users/${sessionUser._id}/goals`}>My Goal</Link></li>
          <li id="nav-link-id"><div onClick={logoutUser}>Logout</div></li>
        </ul>
      );
    } else {
      return (
        <ul className="links-auth nav-links">
          <li id="nav-link-id" ><Link to={'/signup'}>Signup</Link></li>
          <li id="nav-link-id" ><Link to={'/login'}>Login</Link></li>
        </ul>
      );
    }
  }

  const handleDemoGoal = e => {
    dispatch(createGoal({
      title: Math.random(),
      description: Math.random(),
      deadline: `${9000 * Math.random()}-${12 * Math.random()}-${28 * Math.random()}`
    }))
  }

  const renderTestLinks = () => {
    if (process.env.NODE_ENV !== 'production') {
      return (
        <li className="test-button" onClick={handleDemoGoal}>Create Demo Goal</li>
      )
    }
  }

  return (
    <div className='nav-bar-container'>
      {/* <h1>FitOn</h1> */}
      {/* Include logo image */}
      <Link to={"/"}><img className="nav-bar-logo" src={require(`../../images/logo-v1-03.png`)}/></Link>
      <div className='nav-bar-divider'></div>
			<div className='links-menu'>
      	{ getLinks() }
			</div>
        { renderTestLinks() }
    </div>
  );
}

export default NavBar;