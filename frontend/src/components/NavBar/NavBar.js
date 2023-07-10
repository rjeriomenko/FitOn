import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { logout } from '../../store/session';
import { createGoal } from "../../store/goals";
import { useLocation } from 'react-router-dom';

import './NavBar.css';

function NavBar () {
  const loggedIn = useSelector(state => !!state.session.user);
  const sessionUser = useSelector(state => state.session.user);
  const dispatch = useDispatch();
  const [mouseOver, setMouseOver] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const locationPath = useLocation().pathname;

  const onFeed = new RegExp(/^\/feed/i).test(locationPath) || new RegExp(/^\/discover/i).test(locationPath);
  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = () => {
      setShowMenu(false);
    };

    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu, locationPath]);

  const logoutUser = e => {
      e.preventDefault();
      dispatch(logout());
  }

  const getLinks = () => {
    if (loggedIn) {
      return (
        <>
          <li className="nav-link-id"><Link to={'/feed'}>Home</Link></li>
          <li className="nav-link-id"><Link to={`/profile/${sessionUser._id}`}>Stats</Link></li>
          <li className="nav-link-id"><Link to={`/users/${sessionUser._id}/goals`}>My Goal</Link></li>
          {/* <li className="nav-link-id"><a onClick={logoutUser}>Logout</a></li> */}
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

  const renderMiniProfile = () => {
    if (loggedIn) {
      return (
        <>
          <div className="nav-bar-aside">
            <img className="nav-bar-profile-picture" onClick={openMenu} src={sessionUser.imgUrl || "https://www.lightsong.net/wp-content/uploads/2020/12/blank-profile-circle.png"} />
          </div>

          {showMenu && (
            <ul className="profile-dropdown">
              <li className="welcome">
                <p id="greetings">Welcome back,</p>
                <span>{sessionUser.username}</span>
              </li>
            
              <div className="profile-dropdown-line"></div>

              <li className="nav-link-id">
                <Link to={`/profile/${sessionUser._id}`}>
                  <i id="profile-dropdown-icon" class="fa-solid fa-user"></i>My Stats
                </Link>
              </li>

              <li className="nav-link-id">
                <a>
                  <i id="profile-dropdown-icon" class="fa-solid fa-gear"></i>Settings
                </a>
              </li>

              <li className="nav-link-id">
                <a onClick={logoutUser}>
                  <i id="profile-dropdown-icon" class="fa-solid fa-right-from-bracket"></i>Logout
                </a>
              </li>

            </ul>
          )}

        </>
      )
    }
  }

  console.log(onFeed)

  return (
    <>
      <div className={`nav-bar-container ${loggedIn ? "logged-in-navbar" : ""} ${onFeed ? "nav-bar-container-feed" : ""}`}>
        <div className={`nav-bar-main ${loggedIn ? "logged-in-navbar" : ""}`}>
          <div className='upper-nav-bar-padding'>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className='upper-nav-bar'>
            <div className='upper-nav-filler'></div>
            <div className='upper-nav-logo-container'>
            <Link to={"/"}><div className={`text-logo ${loggedIn ? "logged-in-logo" : ""}`}>g<i className="fa-solid fa-arrows-to-circle"></i>algetters</div></Link>
            </div>
            <div className='upper-nav-filler'></div>
          </div>
          <div className='navbar-divider-container'>
            <div className={`nav-bar-divider ${loggedIn ? "logged-in-divider" : ""}`}></div>

          </div>
          <div className='lower-nav-bar'>
            <div className='links-menu'>
              <ul className="links-auth nav-links">
                { getLinks() }
                { loggedIn && renderTestLinks() }
              </ul>
            </div>
          </div>
        </div>

        {renderMiniProfile()}
      </div>

    </>
  );
}

export default NavBar;