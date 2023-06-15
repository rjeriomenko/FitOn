import './ExerciseEntryTile.css';

import { formatTwoDigitNumberString } from '../../utils/utils';

const ExerciseEntryTile = ({photoNum, rating, dateText, note, entry}) => {
	const dateParts = dateText.split('-').map(part => {
		return <span>{part}</span>
	})

	return (
		<div className='exercise-outer-container'>
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