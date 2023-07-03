import './MainPageWrapper.css';
import { useSelector } from 'react-redux';

// Component to wrap full-page subcomponents to standardize page padding/margin style
const MainPageWrapper = ({children}) => {
	const loggedIn = useSelector(state => !!state.session.user);
	return (
		<div className={`main-page-wrapper ${loggedIn ? "main-fade" : ""}`}>
			{children}
		</div>
	)
}

export default MainPageWrapper;