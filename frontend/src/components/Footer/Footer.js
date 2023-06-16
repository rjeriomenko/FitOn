import { Link } from 'react-router-dom';

import './Footer.css';

const Footer = () => {
	return (
		<div className='site-footer-outer-container'>
			<div className='footer-divider'></div>
			<div className="site-footer-container">
				<div className='team-links rokas-links'>
					<a href={`https://github.com/rjeriomenko`}><span className='team-links-text'>Rokas</span></a>
					<a href={`https://github.com/rjeriomenko`}><span><i class="fa-brands fa-github"></i></span></a>
					<a href={`https://www.linkedin.com/in/rokas-jeriomenko-82b312121/`}><span><i class="fa-brands fa-linkedin"></i></span></a>
				</div>
				<div className='team-links michele-links'>
					<a href={`https://github.com/mzhanggg`}><span className='team-links-text'>Michele</span></a>
					<a href={`https://github.com/mzhanggg`}><span><i class="fa-brands fa-github"></i></span></a>
					<a href={`https://www.linkedin.com/in/michele-zhang-380417199/`}><span><i class="fa-brands fa-linkedin"></i></span></a>
				</div>
				<div className='team-links sam-links'>
					<a href={`https://github.com/ohksam`}><span className='team-links-text'>Sam</span></a>
					<a href={`https://github.com/ohksam`}><span><i class="fa-brands fa-github"></i></span></a>
					<a href={`https://github.com/ohksam`}><span><i class="fa-brands fa-linkedin"></i></span></a>
				</div>
				<div className='team-links carvey-links'>
					<a href={`https://github.com/carveyh`}><span className='team-links-text'>Carvey</span></a>
					<a href={`https://github.com/carveyh`}><span><i class="fa-brands fa-github"></i></span></a>
					<a href={`https://www.linkedin.com/in/carvey-hor/`}><span><i class="fa-brands fa-linkedin"></i></span></a>
				</div>
			</div>
		</div>
	)
}

export default Footer;