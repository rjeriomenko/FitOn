import GoalIndexItem from './GoalIndexItem';
import GoalCreate from './GoalCreate';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { deleteGoal, updateGoal, fetchUserGoals, getUserGoals } from '../../store/goals';
import { getUser, fetchUser } from '../../store/users'
import { getCurrentUser } from '../../store/session';
import { Modal } from '../../context/Modal';
import { Redirect } from 'react-router-dom';
import './GoalIndex.css'

function GoalIndex () {
    const dispatch = useDispatch();
    const { userId } = useParams();
    const userGoalsObj = useSelector(getUserGoals);
    const user = useSelector(getUser(userId));
    const currentGoal = user ? user.currentGoal : null;
    const currentGoalId = currentGoal ? currentGoal._id : null;
    const sessionUserId = useSelector(state => state.session.user._id)

    const [editable, setEditable] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');

    const [showCreateGoalForm, setShowCreateGoalForm] = useState(false);

    useEffect(() => {
        dispatch(fetchUser(userId));
        dispatch(fetchUserGoals(userId));
    }, [userId])
    
    if (sessionUserId !== userId) {
        return <Redirect to={`/users/${sessionUserId}/goals`} />
    }

    const handleDeleteGoal = (goalId) => {
        dispatch(deleteGoal(goalId))
            .then(() => dispatch(fetchUser(userId)))
            .then(() => dispatch(getCurrentUser()));
    }

    const handleCompleteGoal = (goalId) => {
        const currentDate = new Date().toLocaleDateString('en-us', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric', hour12: true });
        const updatedGoal = { ...currentGoal, completionDate: currentDate };
        dispatch(updateGoal(updatedGoal))
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
        setDeadline(currentGoal.deadline);
        setEditable(oldSetEditable => !oldSetEditable);
    }

    const handleCloseCreateGoalModal = () => {
        dispatch(fetchUser(userId))
            .then(() => setShowCreateGoalForm(false));
    }

    const handleUpdateGoal = e => {
        setEditable(false);
        const updatedGoal = { ...currentGoal, title, description, deadline }
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

                    <div className="create-current-goal" onClick={() => setShowCreateGoalForm(true)}>
                        <div>Create a new goal</div>
                    </div>
                </div>
            )
        }
    }
    
    const renderGoalCrud = () => {
        if (!currentGoal.completionDate) {
            return (
                <div className="goal-crud">
                    <div className="edit-current-goal" onClick={handleOpenEditGoal}>
                        <i className="far fa-edit"></i>
                    </div>
                    <div className="delete-current-goal" onClick={() => handleDeleteGoal(currentGoalId)}>
                        <i className="fa-solid fa-trash-can"></i>
                    </div>
                    <div className="delete-current-goal" onClick={() => handleCompleteGoal(currentGoalId)}>
                        <i className="fa-solid fa-check"></i>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="goal-crud">
                    <div className="edit-current-goal" onClick={handleOpenEditGoal}>
                        <i className="far fa-edit"></i>
                    </div>
                    <div className="delete-current-goal" onClick={() => handleDeleteGoal(currentGoalId)}>
                        <i className="fa-solid fa-trash-can"></i>
                    </div>
                    <div className="create-current-goal" onClick={() => setShowCreateGoalForm(true)}>
                        <i class="fas fa-calendar-plus"></i>
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
                        <p>{currentGoal.completionDate ? `Completed: ${currentGoal.completionDate}` : "Not Completed" }</p>
                    </div>
                    {renderGoalCrud()}
                </div>
            )
        } else {
            const deadlineInput = (
                <label>Deadline
                    <input
                        className="feed-post-text-edit"
                        id="date"
                        type="date"
                        value={deadline}
                        onChange={e => setDeadline(e.currentTarget.value)}
                        required
                    />
                </label>
            )
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
                        
                        {!currentGoal.completionDate ? deadlineInput : null}

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

    const renderCreateGoalForm = () => {
        if(showCreateGoalForm) {
            return (
                <Modal onClose={handleCloseCreateGoalModal}>
                    <GoalCreate setShowCreateGoalForm={setShowCreateGoalForm} userId={userId}/>
                </Modal>
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
            {renderCreateGoalForm()}
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
