import GoalIndexItem from './GoalIndexItem';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from "react-redux";
import './GoalIndex.css'

function GoalShow () {
    const dispatch = useDispatch()
    const sessionUser = useSelector(state => state.session.user)
    // placeholder: needs to be modified with how reducer is set up
    // const goal = useSelector(state => state.feedPosts.new[0])

    // useEffect(() => {
    //     dispatch()
    //     // add thunk action and dependency
    // }, [])

    const goal1 = {
        "description": "leg day is every day my brotherrr",
        "deadline": "2023-06-14",
        "exerciseEntries": [],
        "_id": "6489187db95d355acc07a120"
    }

    const goal2 = {
        "description": "gains 4 lyfe",
        "deadline": "2023-06-14",
        "exerciseEntries": [],
        "_id": "64891366b95d355acc07a0c8"
    }

    const goal3 = {
        "description": "monka gain$monka gain$monka gain$",
        "deadline": "2023-06-14",
        "exerciseEntries": [],
        "_id": "6488da02b95d355acc07a058"
    }   

    const goal4 = {
        "description": "monka gains",
        "deadline": "2023-06-14",
        "exerciseEntries": [],
        "_id": "6488d99eb95d355acc07a04a"
    }

    const goals = [goal2, goal3, goal4, goal3, goal4, goal3, goal4]

    const goalItems = goals.map(goal => <GoalIndexItem goal={goal} />)

    return (
        <>
            <div className="goals-container">
                <h2>My Current Goal</h2>
                <div className="grid-item" id="current-goal">
                    <div>
                        <p>{goal1.description}</p>
                        <p> Deadline: {goal1.deadline}</p>     
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
