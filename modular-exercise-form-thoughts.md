//


const ModularInput = () => {
	const [reps, setReps] = useState('');
	return(
		<>
			<input
				value={reps}
				onChange={e => setReps(e.target.value)}
			/>
		</>
	)
}



<!-- Add exercise event -->

const handleSubmit = () => {

	const newExerciseInputs = [];
	const inputsArray = [];

	const handleAddInput = (e) => {
		const [reps, setReps] = useState('');
		newExerciseInputs.push([reps, setReps])
		inputsArray.push(<ModularInput value={reps} setValue={setReps} )
	}


	const newExerciseEvent = [newExercise1, newExercise2, ...];
	dispatch(addExerciseEvent(newExerciseEvent))
}

<form>
	{inputsArray}

	<div onClick={handleSubmit}
</form>