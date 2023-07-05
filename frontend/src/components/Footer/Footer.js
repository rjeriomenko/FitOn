import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import './Footer.css';

const Footer = () => {
	// const loggedIn = useSelector(state => !!state.session.user);
	const landing = document.querySelector(".landing-page-container");
	
	return (
		<div className='site-footer-outer-container'>
			<div className='footer-divider'></div>
			{/* <div className={`${landing ? `team-links-light` : `team-links-dark`} site-footer-container`}> */}
			<div className={` site-footer-container`}>
				<div className={`team-links rokas-links`}>
					<a href={`https://github.com/rjeriomenko`}><span className='team-links-text'>Rokas</span></a>
					<a href={`https://github.com/rjeriomenko`}><span><i className="fa-brands fa-github"></i></span></a>
					<a href={`https://www.linkedin.com/in/rokas-jeriomenko-82b312121/`}><span><i className="fa-brands fa-linkedin"></i></span></a>
				</div>
				<div className='team-links michele-links'>
					<a href={`https://github.com/mzhanggg`}><span className='team-links-text'>Michele</span></a>
					<a href={`https://github.com/mzhanggg`}><span><i className="fa-brands fa-github"></i></span></a>
					<a href={`https://www.linkedin.com/in/michele-zhang-380417199/`}><span><i className="fa-brands fa-linkedin"></i></span></a>
				</div>
				<div className='team-links sam-links'>
					<a href={`https://github.com/ohksam`}><span className='team-links-text'>Sam</span></a>
					<a href={`https://github.com/ohksam`}><span><i className="fa-brands fa-github"></i></span></a>
					<a href={`https://github.com/ohksam`}><span><i className="fa-brands fa-linkedin"></i></span></a>
				</div>
				<div className='team-links carvey-links'>
					<a href={`https://github.com/carveyh`}><span className='team-links-text'>Carvey</span></a>
					<a href={`https://github.com/carveyh`}><span><i className="fa-brands fa-github"></i></span></a>
					<a href={`https://www.linkedin.com/in/carvey-hor/`}><span><i className="fa-brands fa-linkedin"></i></span></a>
				</div>
			</div>
			<div className='copyright'>Copyright &copy; 2023 FitOn</div>
		</div>
	)
}

export default Footer;