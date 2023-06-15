import './ExerciseEntryTile.css';

export const formatTwoDigitNumberString = (unformattedNum) => {
	// In case listing is not yet defined, and therefore cannot read its id yet until after component initial render
	if(!unformattedNum) return "01";
	const formattedNum = unformattedNum.toString();
	return formattedNum.length < 2 ? "0".concat(formattedNum) : formattedNum;
}

const ExerciseEntryTile = ({rating, dateText, note, entry}) => {
	// debugger
	const dateParts = dateText.split('-').map(part => {
		return <span>{part}</span>
	})

	// Actual 1-5 rating taken from database data
	// const displayedRating = rating;
	// Random 1-5 rating for demo purposes
	const displayedRating = Math.floor(Math.random() * 5) + 1;

	// Random photo for demo purposes
	const numSamplePhotos = 7;
	const randomImageNumber = Math.floor(Math.random() * numSamplePhotos) + 1;
	const twoDigitRandomImageNumber = formatTwoDigitNumberString(randomImageNumber)
	const imagePath = `../../images/${twoDigitRandomImageNumber}.png`
	// debugger

	return (
		<div className='exercise-outer-container'>
			<div className={`exercise-entry-tile-container `}>
				{/* <img className="tile-photo" src={require(imagePath)}/> */}
				<img className="tile-photo" src={require(`../../images/${twoDigitRandomImageNumber}.png`)}/>
			</div>
			<div className={`tile-rating-overlay tile-rating-${displayedRating}`}>
				<div className={`tile-date-text`}>{dateParts}</div>
			</div>
		</div>
	)
}

export default ExerciseEntryTile;