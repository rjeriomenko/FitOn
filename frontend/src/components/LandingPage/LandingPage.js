import './LandingPage.css';
import { useEffect } from 'react';
import { login, clearSessionErrors } from '../../store/session';
import { useDispatch } from 'react-redux';


function LandingPage() {
  const dispatch = useDispatch();

	useEffect(() => {
		// window.scrollTo(0,100);
	}, [])

  const demoLogin = (e, num) => {
    e.preventDefault();
    let demoEmail;
    let demoPassword;
    switch (num) {
      case 1:
        demoEmail = "demo@user.io"
        demoPassword = "password"
        break;
      case 2:
        demoEmail = "demo2@user.io"
        demoPassword = "password"
        break;
      case 3:
        demoEmail = "test@test.io"
        demoPassword = "password"
        break;
      case 4:
        demoEmail = "uniquerunner@email.com"
        demoPassword = "password"
        break;
      default:
        demoEmail = "demo@user.io"
        demoPassword = "password"
        break;
    }
    dispatch(login({ email:demoEmail, password:demoPassword })); 
  }

  return (
    <>
      <div className="landing-page-container">
        <div className="background-gif-container">
          <img className="landing-gif" src={require(`../../images/narutoirl.gif`)}/>
          {/* <div className='blur-overlay'></div> */}
        </div>
        <div className="text-overlay">
          <p>focus on one goal at a time</p>
          <p>share your journey</p>
          <p onClick={e => demoLogin(e, 1)}><i class="fa-solid fa-arrows-to-circle"></i></p>
          <div className='demo-login-buttons'>
            <button onClick={e => demoLogin(e, 1)}>Demo · 1</button>
            <button onClick={e => demoLogin(e, 2)}>Demo · 2</button>
            <button onClick={e => demoLogin(e, 3)}>Demo · 3</button>
            <button onClick={e => demoLogin(e, 4)}>Demo · 4</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default LandingPage;