import './LandingPage.css';
import { useEffect } from 'react';

function LandingPage() {
  // const { pathname } = useLocation();
	useEffect(() => {
		// window.scrollTo(0,100);
	}, [])

  return (
    <>
      <div className="landing-page-container">
        <div className="background-gif-container">
          <img className="landing-gif" src={require(`../../images/lunges.gif`)}/>
          {/* <div className='blur-overlay'></div> */}
        </div>
        <div className="text-overlay">
          <p>focus on one goal at a time</p>
          <p>share your journey</p>
          <p>fitOn</p>
        </div>
      </div>
    </>
  );
}

export default LandingPage;