import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// import clear and create from exercise entry/exercise from store
// prob want to pull sessionUser??

function ExerciseCreateForm () {
    const dispatch = useDispatch();
    const today = new Date().toISOString().split('T')[0];
    const [ date, setDate ] = useState(today);
    const [ note, setNote ] = useState('');
    const [ rating, setRating ] = useState(''); // 1-5
    
    let inputCount = 1;

    const createDeleteButton = () => {
        const removeButton = document.createElement("input");
        removeButton.type = "submit"
        removeButton.value = "Delete"
        return removeButton;
    }

    const createNumberInput = () => {
        const numInput = document.createElement("input");
        numInput.type = "number"
        numInput.min = "1"
        numInput.max = "1000000"
        return numInput;
    }

    const createTimeInput = () => {
        const timeInput = document.createElement("input");
        timeInput.type = "text"
        timeInput.placeholder = "time stuff"
        return timeInput;
    }

    const createSpan = () => {
        const span = document.createElement("span");
        return span;
    }

    console.log('WHY NOT')
    const addInputFields = e => {
        e.preventDefault();
        
        const removeStep = createDeleteButton();
        removeStep.id = `del-btn-${inputCount}`;

        const setSpan = createSpan();
        setSpan.innerHTML = "Sets";
        const setInput = createNumberInput();
        setInput.id = `set-${inputCount}`;

        const repSpan = createSpan();
        repSpan.innerHTML = "Reps";
        const repInput = createNumberInput();
        repInput.id = `rep-${inputCount}`;

        const timeSpan = createSpan();
        timeSpan.innerHTML = "Time";
        const timeInput = createTimeInput();
        timeInput.id = `time-${inputCount}`;


        const createExerciseDiv = document.querySelector("div.exercise-input-container");
        const exerciseDiv = document.createElement("div");
        exerciseDiv.className = `exercise-div-${inputCount}`;

    
        
        createExerciseDiv.append(exerciseDiv)
        exerciseDiv.append(setSpan)
        exerciseDiv.append(setInput)

        exerciseDiv.append(repSpan)
        exerciseDiv.append(repInput)

        exerciseDiv.append(timeSpan)
        exerciseDiv.append(timeInput)
        
        exerciseDiv.append(removeStep);
        

        removeStep.addEventListener("click", e => {
            // const targetDiv = document.querySelector("div.exercise-input-container");
            e.target.remove()
            console.log("button")
            console.log(e)
        })
      
        inputCount ++
    }

    return (
        <>
            <h1>gains for days my brotha</h1>

            <div className="exercise-form-container">
                <form className="exercise-form">
                    <div lassName="exercise-entry-form">
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
                            // required
                        />
                    </div>

                    <div className="exercise-input-container">
                    </div>

                    <input 
                        type="submit" 
                        value="Add Exercise"
                        onClick={addInputFields}
                    />

                    <input 
                        type="submit" 
                        value="Submit"
                    />

                </form>
            </div>
        </>
    )
}

export default ExerciseCreateForm;