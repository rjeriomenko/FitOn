import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateGoal, clearGoalErrors, getUserGoals } from '../../store/goals';
import { Redirect } from 'react-router-dom/cjs/react-router-dom';

function GoalEdit () {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const id = sessionUser._id;
    const userGoalsObj = useSelector(getUserGoals);
    const userGoals = userGoalsObj[`${id}`];
    const errors = useSelector(state => state.errors.feedPosts);
    
    useEffect(() => {
        return () => dispatch(clearGoalErrors());
    }, [userGoalsObj]);

    const currentGoal = userGoals?.slice(-1)[0];
    const [title, setTitle] = useState(currentGoal?.title);
    const [description, setDescription] = useState(currentGoal?.description);
    const [deadline, setDeadline] = useState(currentGoal?.deadline);
    const [submit, setSubmit] = useState(false)
    
    if (!userGoals) {
        <div> Loading... </div>
    }

    const handleSubmit = e => {
        e.preventDefault();
        const goal = { ...currentGoal, title, description, deadline }
        dispatch(updateGoal( id, goal ));
        setTitle('');
        setDescription('');
        setDeadline('');
        setSubmit(true)
    };

    if (submit === true) {
      return <Redirect to={`/users/${id}/goals`} />
    }

  return (
    <>
      <div className="create-feed-post-container">
      <div>Goal make better pls</div>
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
      </div>
    </>
  )
}

export default GoalEdit;