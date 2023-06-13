import './MainPageWrapper.css';

// Component to wrap full-page subcomponents to standardize page padding/margin style
const MainPageWrapper = ({children}) => {
	return (
		<div className='main-page-wrapper'>
			{children}
		</div>
	)
}

export default MainPageWrapper;