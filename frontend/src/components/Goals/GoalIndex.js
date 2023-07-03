import GoalIndexItem from './GoalIndexItem';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { deleteGoal, updateGoal, fetchUserGoals, getUserGoals } from '../../store/goals'
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

    const [editable, setEditable] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');


    useEffect(() => {
        dispatch(fetchUser(userId));
        dispatch(fetchUserGoals(userId));
    }, [userId])
    
    const handleDeleteGoal = (goalId) => {
        dispatch(deleteGoal(goalId))
            .then(() => dispatch(fetchUser(userId)));
    }

    const handleDescriptionChange = e => {
        setDescription(e.target.value);
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";
    }

    const handleOpenEditGoal = e => {
        setTitle(currentGoal.title);
        setDescription(currentGoal.description);
        setEditable(oldSetEditable => !oldSetEditable);
    }

    const handleUpdateGoal = e => {
        setEditable(false);
        const updatedGoal = { ...currentGoal, title, description }
        dispatch(updateGoal(updatedGoal))
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
        if (currentGoal) { return renderEditCurrentGoal() }
        else {
            return (
                <div className="grid-item" id="current-goal">
                    <div>
                        <p className="goal-title">No current goal</p>
                    </div>

                    <div className="edit-current-goal" >
                        <Link to={'/feedPosts/newGoal'}>Create a new goal</Link>
                    </div>
                </div>
            )
        }
    }

    const renderEditCurrentGoal = () => {
        if (!editable) {
            return (
                <div className="grid-item" id="current-goal">
                    <div>
                        <p className="goal-title">{currentGoal.title}</p>
                        <p>{currentGoal.description}</p>
                        <p> Deadline: {currentGoal.deadline}</p>
                    </div>

                    <div className="goal-crud">
                        <div className="edit-current-goal" onClick={handleOpenEditGoal}>
                            <i class="far fa-edit"></i>
                        </div>
                        <div className="delete-current-goal" onClick={() => handleDeleteGoal(currentGoalId)}>
                            <i class="fa-solid fa-trash-can"></i>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="grid-item" id="current-goal">
                    <div className="feed-post-content">
                        <label>Title
                            <input
                                className="feed-post-text-edit"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </label>

                        <label>Description
                            <textarea
                                className="feed-post-text-edit"
                                contentEditable={true}
                                value={description}
                                onChange={handleDescriptionChange}
                            />
                        </label>

                        <div className="current-goal-edit-crud-buttons">
                            <div className="current-goal-edit-crud-button" onClick={handleUpdateGoal}>
                                Update
                            </div>
                            
                            <div className="current-goal-edit-crud-button" id="close-edit-current-goal" onClick={handleOpenEditGoal}>
                                <i id="x" class="fa-solid fa-xmark"></i>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
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
                {renderCurrentGoal()}

                <h2>previous goals...</h2>
                <div className="goals-grid-container">
                {renderPrevGoals()}
                </div>

            </div>
        </>
    )}


export default GoalIndex;
