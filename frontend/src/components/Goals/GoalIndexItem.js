import { useDispatch } from 'react-redux';
import './GoalIndexItem.css'
import { useState, useEffect } from 'react';

function GoalIndexItem ({goal}) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    
    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

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
                    <ul className="goal-dropdowm">
                        <li>Edit Goal</li>
                        <li>Delete Goal</li>
                    </ul>

                )}

            </div>
        </>
    )
};

export default GoalIndexItem;