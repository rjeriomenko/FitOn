import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearFeedPostErrors, createFeedPost } from '../../store/feedPosts';
import FeedPostBlock from './FeedPostBlock';
import './GoalCreate.css';

function GoalCreate () {
  const today = new Date().toISOString().split('T')[0];
  const [text, setText] = useState('');
  const [date, setDate] = useState(today);

  const [steps, setSteps] = useState({});
  
  const dispatch = useDispatch();
  const author = useSelector(state => state.session.user);
  const newFeedPost = useSelector(state => state.feedPosts.new);
  const errors = useSelector(state => state.errors.feedPosts);

  useEffect(() => {
    return () => dispatch(clearFeedPostErrors());
  }, [dispatch]);

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(createFeedPost({ text, date })); 
    setText('');
    setDate(today);

    // console.log('')
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

    const stepsDiv = document.querySelector("div.goal-create-step-inputs");
    const input = document.createElement("input");
    const span = document.createElement("span");

    span.innerHTML = "Step/Placeholder"
    input.type = "text";
    input.className = "newInput";
    input.placeholder = `Step ${inputCount}`
    input.id = `step-${inputCount ++}`
    
    const removeStep = createDeleteButton();

    removeStep.addEventListener("click", e => {
      console.log('deleted')
    })
    
    // stepsDiv.append(span)
    stepsDiv.append(input)
    stepsDiv.append(removeStep)
  
  }


  return (
    <>
      <div className="create-feed-post-container">
        <form className="create-feed-post" onSubmit={handleSubmit}>
          <span>Title</span>
          <input 
            className="feed-post-form-text"
            type="textarea"
            value={text}
            onChange={e => setText(e.currentTarget.value)}
            placeholder={`Set your next goal, ${author.username}!`}
            required
          />
          <div className="errors">{errors?.text}</div>
          
          <span>Target Deadline</span>
          <input 
            type="date"
            className="feed-post-form-date"
            value={date}
            onChange={e => setDate(e.currentTarget.value)}
          />
          
          <span>Description</span>
          <input 
            className="feed-post-form-text"
            type="text" 
            placeholder="Tell me more about your goal"
          />
          <span>Step/Placeholder</span>
            <input
              className="step"
              id="step-1"
              type="text"
              // value={step}
              // onChange={e => setStep(e.currentTarget.value)}
              placeholder="Step one towards achieving your goals"
            />

          <div className="goal-create-step-inputs">
          </div>

          <input 
            className="create-feed-post-submit"
            onClick={addInputField} 
            value="Add Step"
          />

          <input 
            className="create-feed-post-submit"
            type="submit" 
            value="Submit"
          />

        </form>

        {/* <div className="feed-post-preview">
          <h3>Feed Post Preview</h3>
          {text ? <FeedPostBlock feedPost={{text, author}} /> : undefined}
        </div> */}

        {/* <div className="previous-feed-post">
          <h3>Previous Feed Post</h3>
          {newFeedPost ? <FeedPostBlock feedPost={newFeedPost} /> : undefined}
        </div> */}
      </div>
    </>
  )
}

export default GoalCreate;