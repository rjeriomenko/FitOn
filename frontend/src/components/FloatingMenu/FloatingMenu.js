import './FloatingMenu.css';
import { useSelector } from 'react-redux';

const FloatingMenu = (props) => {
	const loggedIn = useSelector(state => !!state.session.user);
	return (
		<>
			{loggedIn && <div className="floating-menu-container">
					<ul className='floating-menu-links-list'>
						<li><i class="fa-solid fa-circle"></i></li>
						<li><i class="fa-solid fa-circle"></i></li>
						<li><i class="fa-solid fa-circle"></i></li>
					</ul>
				</div>
			}
		</>
	)
}

export default FloatingMenu;