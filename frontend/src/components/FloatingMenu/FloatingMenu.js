import './FloatingMenu.css';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { Modal } from '../../context/Modal';
import ExerciseEventForm from '../Exercise/ExerciseEventForm';

// Just to test modal popup
import LoginForm from '../SessionForms/LoginForm';

const FloatingMenu = (props) => {
	const loggedIn = useSelector(state => !!state.session.user);
	const [showExerciseEntry, setShowExerciseEntry] = useState(false);
	return (
		<>
			{loggedIn && <div className="floating-menu-container" onClick={e => setShowExerciseEntry(true)}>
					<ul className='floating-menu-links-list'>
						<li><i class="fa-solid fa-circle"></i></li>
						<li><i class="fa-solid fa-circle"></i></li>
						<li><i class="fa-solid fa-circle"></i></li>
					</ul>
				</div>
			}
			{showExerciseEntry && <Modal onClose={e => setShowExerciseEntry(false)}>
				{/* <LoginForm /> */}
				<ExerciseEventForm />
			</Modal>}
		</>
	)
}

export default FloatingMenu;