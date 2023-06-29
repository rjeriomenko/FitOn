import { Redirect } from 'react-router-dom/cjs/react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearGoalErrors, createGoal  } from '../../store/goals';
// import FeedPostEditable from './FeedPostEditable';
import './GoalCreate.css';

function GoalCreate () {
  const dispatch = useDispatch();
  const today = new Date().toISOString().split('T')[0];
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState(today);
  const [submit, setSubmit] = useState(false);
  
  const sessionUser = useSelector(state => state.session.user);
  const errors = useSelector(state => state.errors.goals);
  const id = sessionUser._id;

  useEffect(() => {
    return () => dispatch(clearGoalErrors());
  }, [dispatch]);

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(createGoal({ title, description, deadline })); 
    setTitle('');
    setDescription('');
    setDeadline(today);
    setSubmit(true);
  };

  if (submit === true) {
    return <Redirect to={`/users/${id}/goals`} />
  }

  return (
    <>
      <div className="create-feed-post-container">
        <div>Goal pls</div>
        <form className="create-feed-post" onSubmit={handleSubmit}>
          <span>Title</span>
          <input 
            className="feed-post-form-text"
            type="textarea"
            value={title}
            onChange={e => setTitle(e.currentTarget.value)}
            placeholder={`Set your next goal, ${sessionUser.username}!`}
            required
          />
          <div className="errors">{errors?.text}</div>
          
          <span>Description</span>
          <input 
            className="feed-post-form-text"
            type="textarea" 
            value={description}
            onChange={e => setDescription(e.currentTarget.value)}
            placeholder="Tell me more about your goal"
          />

          <span>Target Deadline</span>
            <input 
              type="date"
              className="feed-post-form-date"
              value={deadline}
              onChange={e => setDeadline(e.currentTarget.value)}
            />
          <input 
            className="create-feed-post-submit"
            type="submit" 
            value="Submit"
          />

        </form>

        {/* <div className="feed-post-preview">
          <h3>Feed Post Preview</h3>
          {text ? <FeedPostBlock feedPost={{text, sessionUser}} /> : undefined}
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