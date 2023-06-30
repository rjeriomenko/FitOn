import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { deleteGoal } from '../../store/goals'

import './GoalIndexItem.css'

function GoalIndexItem ({goal}) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
	const [editable, setEditable] = useState(false);
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    const handleUpdate = e => {
        const updatedGoal = { ...goal, title, description}

    }

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    const handleDel = e => {
        e.preventDefault();
        dispatch(deleteGoal(goal._id))
    }

    useEffect(() => {
        if (!showMenu) return;
    
        const closeMenu = () => {
          setShowMenu(false);
        };
    
        document.addEventListener('click', closeMenu);
        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    return (
        <>  
            <div className="grid-item-container">
                <div className="grid-item-previous" id="previous-goal">
                    <p className="goal-title">{goal.title}</p>
                    <p>{goal.description}</p>
                    <p>Completed: {goal.deadline}</p>   
                </div>

                <div className="ellipsis" onClick={openMenu}>
                    <i id="ellipsis" className="fas fa-light fa-ellipsis-vertical"></i>
                </div>

                {showMenu && (
                    <ul className="goal-dropdown">
                        <li>Edit Goal</li>
                        <li onClick={handleDel}>Delete Goal</li>
                    </ul>

                )}

            </div>
        </>
    )
};

export default GoalIndexItem;