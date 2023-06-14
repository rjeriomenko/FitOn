import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from "react-redux";
import './GoalShow.css'

function GoalShow () {
    const sessionUser = useSelector(state => state.session.user)
    // placeholder: needs to be modified with how reducer is set up
    // const goal = useSelector(state => state.feedPosts.new[0])

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

    return (
        <>
            <div className="goals-container">
                <h2>Goal</h2>
                <div className="grid-item" id="current-goal">
                        <h2>{goal1.description}</h2>
                        <h2>{goal1.deadline}</h2>                
                </div>

                <h2>Previous Goals</h2>
                <div className="goals-grid-container">
                    <div className="grid-item" id="previous-goal">
                        <h2>{goal2.description}</h2>
                        <h2>{goal2.deadline}</h2>   
                    </div>

                    <div className="grid-item" id="previous-goal">
                        <h2>{goal3.description}</h2>
                        <h2>{goal3.deadline}</h2>
                    </div>

                    <div className="grid-item" id="previous-goal">
                        <h2>{goal4.description}</h2>
                        <h2>{goal4.deadline}</h2>
                    </div>

                    <div className="grid-item" id="previous-goal">
                        <h2>{goal3.description}</h2>
                        <h2>{goal3.deadline}</h2>
                    </div>

                    <div className="grid-item" id="previous-goal">
                        <h2>{goal4.description}</h2>
                        <h2>{goal4.deadline}</h2>
                    </div>
                </div>

            </div>
        </>
    )
};

export default GoalShow;
