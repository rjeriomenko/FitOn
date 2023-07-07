import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createExerciseEntry, clearExerciseEntryErrors } from '../../store/exerciseEntries';
import { createExercise } from '../../store/exercises';
import './ExerciseEventForm.css'

function ExerciseEventForm ({headerQuote, setShowExerciseEntry}) {
    const dispatch = useDispatch();
    const today = new Date();
    const currentDate = new Date().toLocaleDateString('en-us', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric', hour12: true });
    const [date, setDate] = useState(today);
    const [note, setNote] = useState('');
    const [rating, setRating] = useState('');
    const [exerciseInputs, setExerciseInputs] = useState([{ name: '', sets: '', reps: '', time: '', weight: '' }]);
    const errors = useSelector(state => state.errors.exerciseEntries)

    const sessionUser = useSelector(state => state.session.user);
    const currentGoal = sessionUser?.currentGoal;
    const currentGoalId = currentGoal?._id;

    useEffect(() => {
        return () => dispatch(clearExerciseEntryErrors());
    }, [dispatch])

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const inputs = [...exerciseInputs];
        inputs[index] = { ...inputs[index], [name]: value };
        setExerciseInputs(inputs);
    };

    const addInputFields = (e) => {
        e.preventDefault();
        setExerciseInputs([...exerciseInputs, { name: '', sets: '', reps: '', time: '', weight: '' }]);
    };

    const removeInputField = (index) => {
        const inputs = [...exerciseInputs];
        inputs.splice(index, 1);
        setExerciseInputs(inputs);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(createExerciseEntry( currentGoalId, { date, note, rating: Number(rating) }))
            .then((res) => {
                setShowExerciseEntry(false)

                const exerciseEntryId = Object.keys(res)[0];
                const createExercisePromises = exerciseInputs.map((exercise) =>
                    dispatch(createExercise(exerciseEntryId, exercise))
                );

                Promise.all(createExercisePromises)
            })
    };

    return (
        <div className="exercise-form-container">
            <h4 className="header-quote">{headerQuote}</h4>
            {currentGoal ? <h2>· {currentGoal.title} ·</h2> : null }
            <br></br>
            <div className="workout-form-line" id="line-one"></div>
            <form className="exercise-form" onSubmit={handleSubmit}>
                <div className="exercise-entry-form">
                    <span>Today's Workout for <span id="exercise-form-date">{currentDate}</span></span>
                    <span>Rating</span>
                    <input
                        type="number"
                        min="1"
                        max="5"
                        value={rating}
                        onChange={e => setRating(e.currentTarget.value)}
                        required
                    />
                    <div className="errors">{errors?.rating}</div>
                    
                    <span>Notes</span>
                    <input
                        type="textarea"
                        value={note}
                        onChange={e => setNote(e.currentTarget.value)}
                        placeholder="How was your workout?"
                        required
                    />
                    <div className="errors">{errors?.note}</div>

                </div>
                
                <div className="exercise-input-container">
                    {exerciseInputs.map((input, index) => (
                        <>
                            <div className="workout-form-line"></div>
                            <div id="exercise-input-div" key={index} className={`exercise-div-${index}`}>
                                <span id="exercise-input-span">Exercise</span>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Push-ups, jogging..."
                                    value={input.name}
                                    onChange={(e) => handleInputChange(e, index)}
                                    required
                                />
                                <div className="errors">{errors?.name}</div>

                                <span id="exercise-input-span">Sets</span>
                                <input
                                    type="number"
                                    min="1"
                                    max="1000000"
                                    name="sets"
                                    value={input.sets}
                                    onChange={(e) => handleInputChange(e, index)}
                                />
                                <div className="errors">{errors?.sets}</div>

                                <span id="exercise-input-span">Reps</span>
                                <input
                                    type="number"
                                    min="1"
                                    max="1000000"
                                    name="reps"
                                    value={input.reps}
                                    onChange={(e) => handleInputChange(e, index)}
                                />
                                <div className="errors">{errors?.reps}</div>

                                <span id="exercise-input-span">Weight (lbs)</span>
                                <input
                                    type="number"
                                    min="1"
                                    max="1000000"
                                    name="weight"
                                    value={input.weight}
                                    onChange={(e) => handleInputChange(e, index)}
                                />
                                <div className="errors">{errors?.weight}</div>

                                <span id="exercise-input-span">Time (minutes)</span>
                                <input
                                    type="number"
                                    min="1"
                                    max="1000000"
                                    name="time"
                                    value={input.time}
                                    onChange={(e) => handleInputChange(e, index)}
                                    required
                                />
                                <div className="errors">{errors?.time}</div>

                                {index > 0 && (
                                <button
                                    type="submit"
                                    value="Delete"
                                    className="exercise-input-delete-btn"
                                    onClick={() => removeInputField(index)}>
                                    <i className="fa-solid fa-trash-can"></i>
                            </button>
                                )}
                            </div>
                    </>
                    ))}
                </div>
                <div className="exercise-event-form-btn-container">
                    <input className="exercise-event-form-btn" type="submit" value="Add Exercise" onClick={addInputFields} />
                    <input className="exercise-event-form-btn" type="submit" value="Submit" />
                </div>
            </form>
        </div>
    );
}

export default ExerciseEventForm;
