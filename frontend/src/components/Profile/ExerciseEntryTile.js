import './ExerciseEntryTile.css';

const ExerciseEntryTile = ({rating, dateText, note, entry}) => {
	const dateParts = dateText.split('-').map(part => {
		return <span>{part}</span>
	})

	// const displayedRating = rating;
	const displayedRating = Math.floor(Math.random() * 5) + 1;

	return (
		<div className='exercise-outer-container'>
			<div className={`exercise-entry-tile-container `}>
			</div>
			<div className={`tile-rating-overlay tile-rating-${displayedRating}`}>
				<div className={`tile-date-text`}>{dateParts}</div>
			</div>
		</div>
	)
}

export default ExerciseEntryTile;