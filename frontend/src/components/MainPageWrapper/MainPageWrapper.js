import './MainPageWrapper.css';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';


// Component to wrap full-page subcomponents to standardize page padding/margin style
const MainPageWrapper = ({children}) => {
	const loggedIn = useSelector(state => !!state.session.user);

	useEffect(() => {
		const navBarHeight = document.querySelector(".nav-bar-container")?.offsetHeight;
		const footerHeight = document.querySelector(".site-footer-outer-container")?.offsetHeight;
		const topBotHeight = navBarHeight + footerHeight
		const mainPageWrapper = document.querySelector(".main-page-wrapper")
		if(loggedIn) {
			mainPageWrapper.style.height = `100%`
			const loggedInNavHeight = document.querySelector(".logged-in-navbar")?.offsetHeight;
			console.log(loggedInNavHeight)
			// mainPageWrapper.style.marginTop = `${loggedInNavHeight + 30}px`

			// Hardcoded - find a way to do get the height of an element AFTER css transition
			mainPageWrapper.style.marginTop = `${125}px`
		} else {
			mainPageWrapper.style.height = `calc(100vh - ${topBotHeight}px)`
			mainPageWrapper.style.marginTop = `${navBarHeight}px`
		}
			
	}, [loggedIn])

	return (
		<div className={`main-page-wrapper ${loggedIn ? "main-fade" : "logged-out"}`}>
			{children}
		</div>
	)
}

export default MainPageWrapper;