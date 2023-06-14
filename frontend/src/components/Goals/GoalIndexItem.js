function GoalIndexItem ({goal}) {

    return (
        <>
            <div className="grid-item" id="previous-goal">
                <p className="goal-title">{goal.title}</p>
                <p>{goal.description}</p>
                <p>Completed: {goal.deadline}</p>   
            </div>
        </>
    )
};

export default GoalIndexItem;