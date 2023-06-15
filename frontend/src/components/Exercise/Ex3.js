import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

function Ex3 () {
  const [exerciseInputs, setExerciseInputs] = useState([{ name: '', sets: '', reps: '', time: '' }]);
  const dispatch = useDispatch();
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [note, setNote] = useState('');
  const [rating, setRating] = useState('');

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const inputs = [...exerciseInputs];
    inputs[index] = { ...inputs[index], [name]: value };
    setExerciseInputs(inputs);
  };

  const addInputFields = (e) => {
    e.preventDefault();
    setExerciseInputs([...exerciseInputs, { name: '', sets: '', reps: '', time: '' }]);
  };

  const removeInputField = (index) => {
    const inputs = [...exerciseInputs];
    inputs.splice(index, 1);
    setExerciseInputs(inputs);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const exercise = { date, note, rating, exercises: exerciseInputs };
    console.log(exercise);
    console.log(exerciseInputs);
  };

  return (
    <>
      <h1>gains for days my brotha</h1>

      <div className="exercise-form-container">
        <form className="exercise-form" onSubmit={handleSubmit}>
            <div className="exercise-entry-form">
                <span>Workout Date</span>
                <input 
                    type="date"
                    value={date}
                    onChange={e => setDate(e.currentTarget.value)}
                    // required
                />

                <span>Note</span>
                <input
                    type="textarea"
                    value={note}
                    onChange={e => setNote(e.currentTarget.value)}
                    placeholder="MUCH SWOLE, MUCH GAINS"
                />
                
                <span>Rating</span>
                <input
                    type="number"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={e => setRating(e.currentTarget.value)}
                    // required
                />
            </div>
          <div className="exercise-input-container">
            {exerciseInputs.map((input, index) => (
              <div key={index} className={`exercise-div-${index}`}>
                <span>Exercise</span>
                <input
                  type="text"
                  name="name"
                  value={input.name}
                  onChange={(e) => handleInputChange(e, index)}
                />

                <span>Sets</span>
                <input
                  type="number"
                  min="1"
                  max="1000000"
                  name="sets"
                  value={input.sets}
                  onChange={(e) => handleInputChange(e, index)}
                />

                <span>Reps</span>
                <input
                  type="number"
                  min="1"
                  max="1000000"
                  name="reps"
                  value={input.reps}
                  onChange={(e) => handleInputChange(e, index)}
                />

                <span>Time (in minutes)</span>
                <input
                  type="text"
                  name="time"
                  value={input.time}
                  onChange={(e) => handleInputChange(e, index)}
                />

                {index > 0 && (
                  <input
                    type="submit"
                    value="Delete"
                    onClick={() => removeInputField(index)}
                  />
                )}
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

export default Ex3;
