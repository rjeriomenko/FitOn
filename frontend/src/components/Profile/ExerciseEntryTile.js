import './ExerciseEntryTile.css';

import { formatTwoDigitNumberString } from '../../utils/utils';

const ExerciseEntryTile = ({photoNum, rating, dateText, note, entry}) => {
	const dateParts = dateText.split('-').map(part => {
		return <span>{part}</span>
	})

	const animateOnce = (e) => {
		const workoutContainer = e.currentTarget;
		const workoutImg = workoutContainer.querySelector(".tile-photo");
		workoutContainer.classList.add("tile-container-hover");
		workoutImg.classList.add("tile-img-hover");
		setTimeout(() => {
			// workoutContainer.classList.remove("tile-container-hover");
			workoutContainer.style.transform="scale(0.9)"
		}, 300)
		setTimeout(() => {
			// workoutImg.classList.remove("tile-img-hover");
		}, 500)
	}

	const reverseAnimation = (e) => {
		const workoutContainer = e.currentTarget;
		const workoutImg = workoutContainer.querySelector(".tile-photo");
		// workoutContainer.classList.add("rev-tile-container-hover");
		workoutImg.classList.add("rev-tile-img-hover");
		setTimeout(() => {
			workoutContainer.classList.remove("tile-container-hover");
			// workoutContainer.classList.remove("rev-tile-container-hover");
			workoutContainer.style.transform="scale(1)"
			workoutContainer.style.transition="transform 0.3s"
		}, 300)
		setTimeout(() => {
			workoutImg.classList.remove("tile-img-hover");
			workoutImg.classList.remove("rev-tile-img-hover");
		}, 500)
		
	}

	return (
		<div className='exercise-outer-container' onMouseEnter={animateOnce} onMouseLeave={reverseAnimation}>
			<div className={`exercise-entry-tile-container `}>
				<img className="tile-photo" src={require(`../../images/${photoNum}.png`)}/>
			</div>
			<div className={`tile-rating-overlay tile-rating-${rating}`}>
				<div className={`tile-date-text`}>{dateParts}</div>
			</div>
		</div>
	)
}

export default ExerciseEntryTile;