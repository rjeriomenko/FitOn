import GoalIndexItem from './GoalIndexItem';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { deleteGoal, fetchUserGoals, getUserGoals } from '../../store/goals'
import { getUser, fetchUser } from '../../store/users'
import { Link } from 'react-router-dom';
import './GoalIndex.css'


function GoalIndex () {
    const dispatch = useDispatch();
    const { userId } = useParams();
    const userGoalsObj = useSelector(getUserGoals);
    const user = useSelector(getUser(userId));
    const currentGoal = user ? user.currentGoal : null;
    const currentGoalId = currentGoal ? currentGoal._id : null;

    useEffect(() => {
        dispatch(fetchUser(userId));
        dispatch(fetchUserGoals(userId));
    }, [userId])
    
    const handleDeleteGoal = (goalId) => {
        dispatch(deleteGoal(goalId))
        .then(() => dispatch(fetchUser(userId)));
    }

    const renderPrevGoals = () => {
        const prevGoalItems = [];
        for(let [goalId, goal] of Object.entries(userGoalsObj)) {
            if(goalId != currentGoalId) {
                prevGoalItems.push(<GoalIndexItem key={goalId} goal={goal} />)
            }
        }
        return prevGoalItems.reverse();
    }

    const renderCurrentGoal = () => {
        return (
            <div className="grid-item" id="current-goal">
                <div>
                    <p className="goal-title">{currentGoal.title}</p>
                    <p>{currentGoal.description}</p>
                    <p> Deadline: {currentGoal.deadline}</p>
                </div>

                <div className="goal-crud">
                    <div className="edit-current-goal">
                        <Link to={'/feedPosts/editGoal'}><i class="far fa-edit"></i></Link>
                    </div>
                    <div className="delete-current-goal">
                        <div onClick={() => handleDeleteGoal(currentGoalId)}><i class="fa-solid fa-trash-can"></i></div>
                    </div>
                </div>
            </div>
        )
    }

    if (!userGoalsObj) {
        return (
            <div> Loading... </div>
        )
    }

    return (
        <>
            <div className="goals-container">
                <h2>my current goal...</h2>
                
                {currentGoal ? (renderCurrentGoal()) : (
                        <div className="grid-item" id="current-goal">
                        <div>
                            <p className="goal-title">No current goal</p>   
                        </div> 

                        <div className="edit-current-goal" > 
                            <Link to={'/feedPosts/newGoal'}>Create a new goal</Link>
                        </div>          
                        </div>
                )}
                
                <br></br>
                <br></br>

                <h2>previous goals...</h2>
                <div className="goals-grid-container">
                    {renderPrevGoals()}
                </div>

            </div>
        </>
    )}


export default GoalIndex;
