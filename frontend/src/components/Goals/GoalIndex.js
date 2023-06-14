import GoalIndexItem from './GoalIndexItem';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserGoals, getUserKeyGoals } from '../../store/goals'
import './GoalIndex.css'
import { Link } from 'react-router-dom';


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
        return (
            <div> Loading... </div>
        )
    }
    
    const currentGoal = userGoals.slice(-1)[0];
    const goalItems = userGoals.slice(0,-1).map(goal => <GoalIndexItem goal={goal} />)

    return (
        <>
            <div className="goals-container">
                <h2>My Current Goal</h2>
                
                {currentGoal ? (
                        <div className="grid-item" id="current-goal">
                            <div>
                                <p className="goal-title">{currentGoal.title}</p>
                                <p>{currentGoal.description}</p>
                                <p> Deadline: {currentGoal.deadline}</p>     
                            </div> 
                            <div className="edit-current-goal">
                                <Link to={'/feedPosts/editGoal'}>Edit Goal</Link>
                            </div>          
                        </div>
                    ) : (
                        <div className="grid-item" id="current-goal">
                        <div>
                            <p className="goal-title">No current goals</p>   
                        </div> 
                        {/* give new className */}
                        {/* give new className */}
                        {/* give new className */}
                        <div className="edit-current-goal" > 
                            <Link to={'/feedPosts/newGoal'}>Create a new goal</Link>
                        </div>          
                        </div>
                )}
                
                <br></br>
                <br></br>

                <h2>Previous Goals</h2>
                <div className="goals-grid-container">
                    {goalItems}
                </div>

            </div>
        </>
    )}


export default GoalShow;
