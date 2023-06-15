import { Redirect } from 'react-router-dom/cjs/react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './ExerciseEventForm.css'

import { createExerciseEntry } from '../../store/exerciseEntries';
import { clearExerciseEntryErrors, receiveExerciseEntryErrors } from '../../store/exerciseEntries';
import { getUserKeyGoals, getGoals } from '../../store/goals';


function ExerciseEventForm ({setShowExerciseEntry}) {
    const dispatch = useDispatch();
    const today = new Date().toISOString().split('T')[0];
    const [date, setDate] = useState(today);
    const [note, setNote] = useState('');
    const [rating, setRating] = useState('');
    const [exerciseInputs, setExerciseInputs] = useState([{ name: '', sets: '', reps: '', time: '' }]);
    const [submit, setSubmit] = useState(false);

    const errors = useSelector(state => state.errors.exerciseEntries) // is this where errors live?

    const sessionUser = useSelector(state => state.session.user);
    const sessionUserId = sessionUser._id;
    const userGoalsObj = useSelector(getUserKeyGoals);
    const userGoals = userGoalsObj ? userGoalsObj[`${sessionUserId}`] : null;
    const currentGoal = userGoals ? userGoals.slice(-1)[0] : null;

    const currentGoalId = currentGoal?._id;

    useEffect(() => {
        return () => dispatch(clearExerciseEntryErrors());
    }, [dispatch])

    if ( !userGoalsObj ) {
        <div> Loading... </div>
    }


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
        // const exercise = { date, note, rating, exercises: exerciseInputs };
        const exercise = { date, note, rating };

        dispatch(createExerciseEntry( sessionUserId, currentGoalId, { date, note, rating: Number(rating) }))
            .then(() => {
                setShowExerciseEntry(false)
            })

        // setDate(today);
        // setNote('');
        // setRating('');

        console.log(exercise);
        // console.log(exerciseInputs);

        setSubmit(true)

    };


    if (submit === true) {
        return <Redirect to="/feedPosts/myGoal" />
    }

    return (
        <div className="exercise-form-container">
            <h2>Add Your Workout</h2>
            <br></br>
            {/* <h2>gigachad lookin monka swole</h2> */}
            <form className="exercise-form" onSubmit={handleSubmit}>
                <div className="exercise-entry-form">
                    <span>Workout Date</span>
                    <input 
                        type="date"
                        value={date}
                        onChange={e => setDate(e.currentTarget.value)}
                        required
                    />
                    <div className="errors">{errors?.date}</div>

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
                        placeholder="How was your workout? o.o"
                    />
                    <div className="errors">{errors?.note}</div>

                </div>

                <div className="exercise-input-container">
                    {exerciseInputs.map((input, index) => (
                    <div id="exercise-input-div" key={index} className={`exercise-div-${index}`}>
                        <span id="exercise-input-span">Exercise:</span>
                        <input
                            type="text"
                            name="name"
                            placeholder="Push-ups, jogging..."
                            value={input.name}
                            onChange={(e) => handleInputChange(e, index)}
                        />
                        <div className="errors">{errors?.name}</div>

                        <span id="exercise-input-span">Sets:</span>
                        <input
                            type="number"
                            min="1"
                            max="1000000"
                            name="sets"
                            value={input.sets}
                            onChange={(e) => handleInputChange(e, index)}
                        />
                        <div className="errors">{errors?.sets}</div>

                        <span id="exercise-input-span">Reps:</span>
                        <input
                            type="number"
                            min="1"
                            max="1000000"
                            name="reps"
                            value={input.reps}
                            onChange={(e) => handleInputChange(e, index)}
                        />
                        <div className="errors">{errors?.reps}</div>

                        <span id="exercise-input-span">Time (in minutes):</span>
                        <input
                            type="text"
                            name="time"
                            value={input.time}
                            onChange={(e) => handleInputChange(e, index)}
                        />
                        <div className="errors">{errors?.time}</div>

                        {index > 0 && (
                        <button
                            type="submit"
                            value="Delete"
                            className="exercise-input-delete-btn"
                            onClick={() => removeInputField(index)}>
                            <i class="fa-solid fa-trash-can"></i>
                       </button>
                        )}
                    </div>
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
