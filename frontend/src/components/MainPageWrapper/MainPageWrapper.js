import './MainPageWrapper.css';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Component to wrap full-page subcomponents to standardize page padding/margin style
const MainPageWrapper = ({children}) => {
	const loggedIn = useSelector(state => !!state.session.user);
	const location = useLocation();

	useEffect(() => {
		const navBarHeight = document.querySelector(".nav-bar-container")?.offsetHeight;
		const footerHeight = document.querySelector(".site-footer-outer-container")?.offsetHeight;
		const topBotHeight = navBarHeight + footerHeight
		const mainPageWrapper = document.querySelector(".main-page-wrapper")
		if(loggedIn) {
			mainPageWrapper.style.height = `100%`
			mainPageWrapper.style.minHeight = `calc(100vh - ${topBotHeight}px)`

			// Hardcoded - find a way to do get the height of an element AFTER css transition
			mainPageWrapper.style.marginTop = `${125}px`
		} else {
			mainPageWrapper.style.height = `calc(100vh - ${topBotHeight}px)`
			mainPageWrapper.style.marginTop = `${navBarHeight}px`
			mainPageWrapper.style.minHeight = `calc(100vh - ${topBotHeight}px)`
		}
			
	}, [loggedIn, location.pathname])

	return (
		<div className={`main-page-wrapper ${loggedIn ? "main-fade" : "logged-out"}`}>
			{children}
		</div>
	)
}

export default MainPageWrapper;