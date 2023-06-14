import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function FormAddInput () {
  const [steps, setSteps] = useState({});
  const dispatch = useDispatch();
  const author = useSelector(state => state.session.user);

  useEffect(() => {
    // clear form errors
  }, [dispatch]);

  const handleSubmit = e => {
    e.preventDefault();
    // reset form 
  };

  let inputCount = 2;

  const createDeleteButton = () => {
    const removeButton = document.createElement("input");
    removeButton.type = "submit"
    removeButton.value = "Delete"
    return removeButton;
  }

  const addInputField = e => {
    e.preventDefault();
    const stepNum = `step${inputCount}`
    
    // const [`step${inputCount}`, `setStep${inputCount}`] = useState('')
    
    const removeStep = createDeleteButton();
    const stepsDiv = document.querySelector("div.goal-create-step-inputs");
    const newDiv = document.createElement("div");
    const input = document.createElement("input");

    newDiv.className = "new-goal-div";
    input.type = "text";
    input.className = "newInput";
    input.placeholder = `Step ${inputCount}`;
    input.id = `step-${inputCount ++}`;

    newDiv.append(input);
    newDiv.append(removeStep);

    removeStep.addEventListener("click", e => {
      e.target.remove()
    })
    
    stepsDiv.append(newDiv)
  
  }


  return (
    <>
      <div className="sample-form-container">
        <form className="sample-form" onSubmit={handleSubmit}>
          
          <span>Step/Placeholder</span>
            <input
              className="step"
              id="step-1"
              type="text"
              // value={step}
              // onChange={e => setStep(e.currentTarget.value)}
              placeholder="Step one towards achieving your goals"
            />

            {/* div where input is being added */}
            {/* div where input is being added */}
            {/* div where input is being added */}
          <div className="goal-create-step-inputs">
          </div>

          <input 
            className="sample-form-submit"
            onClick={addInputField} 
            value="Add Step"
          />

          <input 
            className="sample-form-submit"
            type="submit" 
            value="Submit"
          />

        </form>
      </div>
    </>
  )
}

export default FormAddInput;