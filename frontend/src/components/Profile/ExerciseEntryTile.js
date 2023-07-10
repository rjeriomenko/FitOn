import './ExerciseEntryTile.css';

import { formatTwoDigitNumberString } from '../../utils/utils';

const ExerciseEntryTile = ({workout}) => {
// const ExerciseEntryTile = ({photoNum, rating, dateText, note, entry}) => {
	const {imgUrl, rating, date, note} = workout;

	const formattedDate = new Date(date).toLocaleDateString('en-us', { year:"numeric", month:"2-digit", day:"2-digit" });
	const dateParts = formattedDate.split('/').reverse().map(part => {
		return <span>{part}</span>
	})

	// const dateParts = <span>{formattedDate}</span>

	

	const animateOnce = (e) => {
		const workoutContainer = e.currentTarget;
		const workoutImg = workoutContainer.querySelector(".tile-background");
		workoutContainer.classList.add("tile-container-hover");
		workoutImg.classList.add("tile-img-hover");
	}

	const reverseAnimation = (e) => {
		const workoutContainer = e.currentTarget;
		const workoutImg = workoutContainer.querySelector(".tile-background");
		workoutContainer.classList.remove("tile-container-hover");
		workoutImg.classList.remove("tile-img-hover");
	}

	return (
		<div className='exercise-outer-container' onMouseEnter={animateOnce} onMouseLeave={reverseAnimation}>
			<div className={`exercise-entry-tile-container `}>
				{/* <img className="tile-photo" src={require(`../../images/${photoNum}.png`)}/> */}
				{imgUrl ? <img className={`tile-background tile-background-${rating} tile-photo`} src={imgUrl}/> : <div className={`tile-background tile-background-${rating} tile-placeholder`}><i className="fa-solid fa-arrows-to-circle"></i></div>}
			</div>
			<div className={`tile-rating-overlay tile-rating-${rating}`}>
				<div className={`tile-date-text`}>{dateParts}</div>
			</div>
		</div>
	)
}

export default ExerciseEntryTile;