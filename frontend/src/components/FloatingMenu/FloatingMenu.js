import './FloatingMenu.css';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { Modal } from '../../context/Modal';
import ExerciseEventForm from '../Exercise/ExerciseEventForm';

const FloatingMenu = (props) => {
	const loggedIn = useSelector(state => !!state.session.user);
	const [showExerciseEntry, setShowExerciseEntry] = useState(false);
	const [hover, setHover] = useState(false);

	return (
		<>
			{loggedIn && <div className="floating-menu-container" onClick={e => setShowExerciseEntry(true)}>
					<ul 
						onMouseEnter={e => setHover(true)} 
						onMouseLeave={e => setHover(false)}
						className='floating-menu-links-list'>
						{!hover && <li><i class="fa-solid fa-plus fa-2xl"></i></li>}
						{hover && <li><i class="fa-solid fa-plus fa-fade fa-2xl"></i></li>}
					</ul>
				</div>
			}
			{showExerciseEntry && <Modal onClose={e => setShowExerciseEntry(false)}>
				<ExerciseEventForm setShowExerciseEntry={setShowExerciseEntry}/>
			</Modal>}
		</>
	)
}

export default FloatingMenu;