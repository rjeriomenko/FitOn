import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function ExerciseCreateForm() {
  const dispatch = useDispatch();
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [note, setNote] = useState('');
  const [rating, setRating] = useState('');
  const [exerciseInputs, setExerciseInputs] = useState([]);
  const [inputCount, setInputCount] = useState(1);

  const createDeleteButton = (index) => (
    <input
      type="submit"
      value="Delete"
      onClick={() => removeInputField(index)}
    />
  );

  const createNumberInput = (id, name, value) => (
    <input
      type="number"
      min="1"
      max="1000000"
      id={id}
      name={name}
      value={value}
      onChange={(e) => handleInputChange(e, id)}
    />
  );
  
  const createTextInput = (id, name, value) => (
    <input
      type="text"
      id={id}
      name={name}
      value={value}
      onChange={(e) => handleInputChange(e, id)}
    />
  );

  const createSpan = (text) => <span>{text}</span>;

  const removeInputField = (index) => {
    setExerciseInputs((prevState) => {
      const updatedInputs = [...prevState];
      updatedInputs.splice(index, 1);
      return updatedInputs;
    });
  };

  const handleInputChange = (e, id) => {
    const { name, value } = e.target;
    setExerciseInputs((prevState) => {
      const updatedInputs = prevState.map((input) => {
        
        if (input.id === id.toString()) {
          return { ...input, [name]: value };
        }
        return input;
      });
      return updatedInputs;
    });
  };

  const addInputFields = (e) => {
    e.preventDefault();

    const newInput = {
      id: inputCount.toString(),
      name: '',
      sets: '',
      reps: '',
      time: '',
    };

    setExerciseInputs((prevState) => [...prevState, newInput]);
    setInputCount((prevCount) => prevCount + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const exercise = { date, note, rating, exercises: exerciseInputs };
    console.log(exercise);
    console.log(exerciseInputs)
  };

  return (
    <>
      <h1>gains for days my brotha</h1>

      <div className="exercise-form-container">
        <form className="exercise-form" onSubmit={handleSubmit}>
          <div className="exercise-entry-form">
            <span>Workout Date</span>
            <input type="date" value={date} onChange={(e) => setDate(e.currentTarget.value)} />

            <span>Note</span>
            <input
              type="textarea"
              value={note}
              onChange={(e) => setNote(e.currentTarget.value)}
              placeholder="MUCH SWOLE, MUCH GAINS"
            />

            <span>Rating</span>
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.currentTarget.value)}
            />
          </div>

          <div className="exercise-input-container">
            {exerciseInputs.map((input, index) => (
              <div key={input.id} className={`exercise-div-${input.id}`}>
                {createSpan('Exercise')}
                {createTextInput(`name-${input.id}`, 'name', input.name)}

                {createSpan('Sets')}
                {createNumberInput(`set-${input.id}`, 'sets', input.sets)}

                {createSpan('Reps')}
                {createNumberInput(`rep-${input.id}`, 'reps', input.reps)}

                {createSpan('Time(in minutes)')}
                {createTextInput(`time-${input.id}`, 'time', input.time)}

                {createDeleteButton(index)}
              </div>
            ))}
          </div>

          <input type="submit" value="Add Exercise" onClick={addInputFields} />
          <input type="submit" value="Submit" />
        </form>
      </div>
    </>
  );
}

export default ExerciseCreateForm;
