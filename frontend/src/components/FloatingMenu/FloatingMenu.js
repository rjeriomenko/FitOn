import './FloatingMenu.css';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { Modal } from '../../context/Modal';
import { Redirect } from 'react-router-dom/cjs/react-router-dom';
import ExerciseEventForm from '../Exercise/ExerciseEventForm';
import GoalCreate from '../Goals/GoalCreate';

const FloatingMenu = (props) => {
	const dispatch = useDispatch();
	const loggedIn = useSelector(state => !!state.session.user);
	const [showExerciseEntry, setShowExerciseEntry] = useState(false);
	const [hover, setHover] = useState(false);
	const currentGoal = useSelector(state => state.session?.user?.currentGoal);
	const [showCreateGoalForm, setShowCreateGoalForm] = useState(false);

	const headerQuote = () => {
		const quotes = ['"It does not matter how slowly you go as long as you do not stop." - Confucius',
				'"Success is a journey, not a destination. The doing is often more important than the outcome." - Arthur Ashe',
				'"Small daily improvements are the key to staggering long-term results." - Unknown',
				'"The greatest accomplishments are often achieved by taking a series of small steps in the right direction." - Unknown',
				'"Inch by inch, anything\'s a cinch." - Unknown',
				'"Small steps forward are still steps forward." - Unknown',
				'"Success is the sum of small efforts repeated day in and day out." - Robert Collier',
				'"The secret to getting ahead is getting started." - Mark Twain',
				'"Little by little, a little becomes a lot." - Tanzanian Proverb',
				'"Don\'t watch the clock; do what it does. Keep going." - Sam Levenson',
				'"The journey of a thousand miles begins with a single step." - Lao Tzu',
				'"Progress is progress, no matter how small." - Unknown',
				'"The small steps are the ones that eventually lead to great distances." - Unknown',
				'"The only way to achieve great things is by taking small, consistent steps." - Unknown',
				'"Focus on the progress, not the perfection." - Unknown'
		]
		return quotes[Math.floor(Math.random()*quotes.length)]
	}

	const displayExerciseEntryForm = () => {
		return (
			<>
				{loggedIn && currentGoal &&
					<div className="floating-menu-container" onClick={e => setShowExerciseEntry(true)}>
						<ul 
							onMouseEnter={e => setHover(true)} 
							onMouseLeave={e => setHover(false)}
							className='floating-menu-links-list'>

							{!hover && <li><i class="fa-solid fa-plus fa-2xl"></i></li>}
							{hover && <li><i class="fa-solid fa-plus fa-fade fa-2xl"></i></li>}
						</ul>
					</div>
				}
			</>
		)
	}

	const displayCreateGoalForm = () => {
		return (
			<>
				{loggedIn && !currentGoal &&
					<div className="floating-menu-container" onClick={e => setShowCreateGoalForm(true)}>
						<ul 
							onMouseEnter={e => setHover(true)} 
							onMouseLeave={e => setHover(false)}
							className='floating-menu-links-list'>

							{!hover && <li><i class="fa-regular fa-calendar-plus fa-xl"></i></li>}
							{hover && <li><i class="fa-regular fa-calendar-plus fa-fade fa-xl"></i></li>}

						</ul>
					</div>
				}
			</>
		)
	}

	useEffect(() => {

	}, [currentGoal])

	return (
		<>
			{displayExerciseEntryForm()}
			{displayCreateGoalForm()}

			{showExerciseEntry && <Modal onClose={e => setShowExerciseEntry(false)}>
				<ExerciseEventForm headerQuote={headerQuote()} setShowExerciseEntry={setShowExerciseEntry}/>
			</Modal>}


			{showCreateGoalForm && <Modal onClose={e => setShowCreateGoalForm(false)}>
				<GoalCreate setShowCreateGoalForm={setShowCreateGoalForm}/>
			</Modal>}

		</>
	)
}

export default FloatingMenu;