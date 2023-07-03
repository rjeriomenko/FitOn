import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/session';
import { Redirect } from 'react-router-dom';
import { createGoal } from "../../store/goals";
import { useState } from 'react';

import './NavBar.css';

function NavBar () {
  const loggedIn = useSelector(state => !!state.session.user);
  const sessionUser = useSelector(state => state.session.user);
  const dispatch = useDispatch();
  const [mouseOver, setMouseOver] = useState(false);
  
  const logoutUser = e => {
      e.preventDefault();
      dispatch(logout());
  }

  const getLinks = () => {
    if (loggedIn) {
      return (
        <>
          <li className="nav-link-id"><Link to={'/feed'}>Home</Link></li>
          <li className="nav-link-id"><Link to={'/profile'}>Tools</Link></li>
          <li className="nav-link-id"><Link to={'/feedPosts/newGoal'}>Create Goal</Link></li>
          {/* <li><Link to={'/feedPosts/editGoal'}>Edit goal</Link></li> */}
          <li className="nav-link-id"><Link to={`/users/${sessionUser._id}/goals`}>My Goal</Link></li>
          <li className="nav-link-id"><a onClick={logoutUser}>Logout</a></li>
        </>
      );
    } else {
      return (
        <>
          <li className="nav-link-id" ><Link to={'/signup'}>Signup</Link></li>
          <li className="nav-link-id" ><Link to={'/login'}>Login</Link></li>
        </>
      );
    }
  }

  const handleDemoGoal = e => {
    dispatch(createGoal({
      title: Math.random(),
      description: Math.random().toString(),
      deadline: `${Math.floor(9000 * Math.random())}-${Math.floor(12 * Math.random())}-${Math.floor(28 * Math.random())}`
    }))
  }

  const renderTestLinks = () => {
    if (process.env.NODE_ENV !== 'production') {
      return (
        <li className="nav-link-id test-button" onClick={handleDemoGoal}><a>Create Demo Goal</a></li>
      )
    }
  }

  return (
    <>
      {/* <div className={`nav-bar-offset ${loggedIn ? "logged-in-navbar" : ""} `}/> */}
      <div className={`nav-bar-container ${loggedIn ? "logged-in-navbar" : ""}`}>
        {/* <Link to={"/"}><img className="nav-bar-logo" src={require(`../../images/logo-v1-03.png`)}/></Link> */}
        <Link to={"/"}><div className={`text-logo ${loggedIn ? "logged-in-logo" : ""}`}>g<i class="fa-solid fa-arrows-to-circle"></i>algetters</div></Link>
        <div className='nav-bar-divider'></div>
        <div className='links-menu'>
          <ul className="links-auth nav-links">
            { getLinks() }
            { renderTestLinks() }
          </ul>
        </div>
      </div>
    </>
  );
}

export default NavBar;