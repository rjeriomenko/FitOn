import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// import clear and create from exercise entry/exercise from store
// prob want to pull sessionUser??

function Exercise2 () {
    const dispatch = useDispatch();
    const today = new Date().toISOString().split('T')[0];
    const [ date, setDate ] = useState(today);
    const [ note, setNote ] = useState('');
    const [ rating, setRating ] = useState(''); // 1-5

    const createDeleteButton = () => {
        const removeButton = document.createElement("input");
        removeButton.type = "submit";
        removeButton.value = "Delete";
        return removeButton;
    }

    const createNumberInput = () => {
        const numInput = document.createElement("input");
        numInput.type = "number";
        numInput.min = "1";
        numInput.max = "1000000";
        return numInput;
    }

    const createTextInput = () => {
        const textInput = document.createElement("input");
        textInput.type = "text";
        return textInput;
    }
    

    const createSpan = () => {
        const span = document.createElement("span");
        return span;
    }

    let inputCount = 1;
    
    const addInputFields = e => {
        e.preventDefault();

        // creating 
        const removeBtn = createDeleteButton();
        removeBtn.id = `del-btn-${inputCount}`;

        const nameSpan = createSpan();
        nameSpan.innerHTML = "Exercise"
        const nameInput = createTextInput();
        nameInput.id = `name-${inputCount}`;

        const setSpan = createSpan();
        setSpan.innerHTML = "Sets";
        const setInput = createNumberInput();
        setInput.id = `set-${inputCount}`;

        const repSpan = createSpan();
        repSpan.innerHTML = "Reps";
        const repInput = createNumberInput();
        repInput.id = `rep-${inputCount}`;

        const timeSpan = createSpan();
        timeSpan.innerHTML = "Time(in minutes)";
        const timeInput = createTextInput();
        timeInput.id = `time-${inputCount}`;
        

        const createExerciseDiv = document.querySelector("div.exercise-input-container");
        const exerciseDiv = document.createElement("div");
        exerciseDiv.className = `exercise-div-${inputCount}`;


        // appending
        createExerciseDiv.append(exerciseDiv);

        exerciseDiv.append(nameSpan);
        exerciseDiv.append(nameInput);

        exerciseDiv.append(setSpan);
        exerciseDiv.append(setInput);

        exerciseDiv.append(repSpan);
        exerciseDiv.append(repInput);

        exerciseDiv.append(timeSpan);
        exerciseDiv.append(timeInput);
        
        exerciseDiv.append(removeBtn);
        
        removeBtn.addEventListener("click", e => {
            const num = e.target.id.slice(-1)
            const targetDiv = document.querySelector(`div.exercise-div-${num}`);    
            targetDiv.remove();
        })
      
        inputCount ++
    }

    const handleSubmit = e => {
        e.preventDefault();
        const exercise = { date, note, rating}
        console.log(exercise)
    }

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

export default Exercise2;