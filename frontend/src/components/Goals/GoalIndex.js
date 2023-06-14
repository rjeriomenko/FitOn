import GoalIndexItem from './GoalIndexItem';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from "react-redux";
import './GoalIndex.css'

import { fetchUserGoals, getUserKeyGoals } from '../../store/goals'

function GoalShow () {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const sessionUserId = sessionUser._id;
    const userGoalsObj = useSelector(getUserKeyGoals);
    const userGoals = userGoalsObj[`${sessionUserId}`];
    
    useEffect(() => {
        dispatch(fetchUserGoals(sessionUser._id))
    }, [])
    
    
    if (!userGoals) {
        return <div> Loading... </div>
    }
    
    const currentGoal = userGoals.slice(-1)[0];
    const goalItems = userGoals.slice(0,-1).map(goal => <GoalIndexItem goal={goal} />)

    return (
        <>
            <div className="goals-container">
                <h2>My Current Goal</h2>
                <div className="grid-item" id="current-goal">
                    <div>
                        <p>{currentGoal.description}</p>
                        <p> Deadline: {currentGoal.deadline}</p>     
                    </div> 
                    <div>
                        <input 
                            className="edit-current-goal" 
                            type="submit" 
                            value="Edit Current Goal" 
                            // onClick={handleClick}
                        />
                    </div>          
                </div>
                
                <br></br>
                <br></br>

                <h2>Previous Goals</h2>
                <div className="goals-grid-container">
                    {goalItems}
                </div>

            </div>
        </>
    )
};

export default GoalShow;
