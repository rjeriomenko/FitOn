function GoalIndexItem ({goal}) {

    return (
        <>
            <div className="grid-item" id="previous-goal">
                <p>{goal.description}</p>
                <p>Completed: {goal.deadline}</p>   
            </div>
        </>
    )
};

export default GoalIndexItem;