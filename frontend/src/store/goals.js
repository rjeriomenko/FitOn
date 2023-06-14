import jwtFetch from './jwt';

const RECEIVE_GOALS = "goal/RECEIVE_GOALS";
const RECEIVE_GOAL = "goal/RECEIVE_GOAL";
const RECEIVE_USER_GOAL = "goal/RECEIVE_USER_GOAL";
const RECEIVE_USER_GOALS = "goal/RECEIVE_USER_GOALS";
const RECEIVE_NEW_GOAL = "goal/RECEIVE_NEW_GOAL";
const REMOVE_GOAL = "goal/REMOVE_GOAL";
const RECEIVE_GOAL_ERRORS = "goal/RECEIVE_GOAL_ERRORS";
const CLEAR_GOAL_ERRORS = "goal/CLEAR_GOAL_ERRORS";

export const receiveGoals = (goals) => ({
    type: RECEIVE_GOALS,
    goals
});

//this needs to account for the fact that goal is an array and you are updating a single goal from a user
export const receiveGoal = (goal) => ({
    type: RECEIVE_GOAL,
    goal
});

export const receiveUserGoal = (goal) => ({
    type: RECEIVE_USER_GOAL,
    goal
});

export const receiveUserGoals = (goals) => ({
    type: RECEIVE_USER_GOALS,
    goals
});

export const receiveNewGoal = (goal) => ({
    type: RECEIVE_NEW_GOAL,
    goal
});

//this needs to account for the fact that goal is an array and you are deleting a single goal from a user
export const removeGoal = (userId, goalId) => ({
    type: REMOVE_GOAL,
    goalId,
    userId
});

export const receiveGoalErrors = errors => ({
    type: RECEIVE_GOAL_ERRORS,
    errors
});

export const clearGoalErrors = errors => ({
    type: CLEAR_GOAL_ERRORS,
    errors
});

//Returns all goals ordered by [{ userId: [userGoals] }]
export const fetchAllUserGoals = () => async dispatch => {
    try {
        const res = await jwtFetch('/api/users');
        const users = await res.json();
        const usersGoals = {};
        users.forEach(user => {
            usersGoals[user.id] = user.goals
        });
        dispatch(receiveGoals(usersGoals));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveGoalErrors(resBody.errors));
        }
    }
};

export const fetchUserGoals = userId => async dispatch => {
    try {
        const res = await jwtFetch(`/api/users/${userId}/goals`);
        const userGoals = await res.json();
        dispatch(receiveUserGoals({ userId: userGoals }));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveGoalErrors(resBody.errors));
        }
    }
};

export const fetchUserGoal = (userId, goalId) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/users/${userId}/goals/${goalId}`);
        const userGoal = await res.json();
        dispatch(receiveUserGoal({ userId: [userGoal] }));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveGoalErrors(resBody.errors));
        }
    }
};

export const createGoal = (userId, goal) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/users/${userId}/goals`, {
            method: 'POST',
            body: JSON.stringify(goal)
        });
        const responseGoal = await res.json();
        dispatch(receiveNewGoal({ userId: [responseGoal] }));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            return dispatch(receiveGoalErrors(resBody.errors));
        }
    }
};

export const updateGoal = (userId, goal) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/users/${userId}/goals/${goal.id}`, {
            method: 'PATCH',
            body: JSON.stringify(goal)
        });
        const responseGoal = await res.json();
        dispatch(receiveGoal({ userId: [responseGoal] }));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            return dispatch(receiveGoalErrors(resBody.errors));
        }
    }
};

export const deleteGoal = (userId, goalId) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/users/${userId}/goals/${goalId}`, {
            method: 'DELETE'
        });
        dispatch(removeGoal(userId, goalId));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            return dispatch(receiveGoalErrors(resBody.errors));
        }
    }
};

const getGoal = (userId, goalId) => state => {
    if (state?.goals.all[userId]) {
        return state.goals.all[userId].goals[goalId];
    } else {
        return null;
    }
}

const getGoals = state => {
    if (state?.goals) {
        return state.goals.all
    } else {
        return null;
    }
}

const getUserGoals = state => {
    if (state?.goals) {
        return state.goals.user
    } else {
        return null;
    }
}

const getNewGoal = state => {
    if (state?.goals) {
        return state.goals.new
    } else {
        return null;
    }
}

const nullErrors = null;

//What other RECEIVE constants belong here?
export const goalErrorsReducer = (state = nullErrors, action) => {
    switch (action.type) {
        case RECEIVE_GOAL_ERRORS:
            return action.errors;
        case RECEIVE_NEW_GOAL:
        case CLEAR_GOAL_ERRORS:
            return nullErrors;
        default:
            return state;
    }
};



// ////////////////////////////////////////////////////////////////////////////////////
// export const receiveGoals = (goals) => ({
//     type: RECEIVE_GOALS,
//     goals
// });

// //this needs to account for the fact that goal is an array and you are updating a single goal from a user
// export const receiveGoal = (goal) => ({
//     type: RECEIVE_GOAL,
//     goal
// });

// export const receiveUserGoal = (goal) => ({
//     type: RECEIVE_USER_GOAL,
//     goal
// });

// export const receiveUserGoals = (goals) => ({
//     type: RECEIVE_USER_GOALS,
//     goals
// });

// export const receiveNewGoal = (goal) => ({
//     type: RECEIVE_NEW_GOAL,
//     goal
// });

// //this needs to account for the fact that goal is an array and you are deleting a single goal from a user
// export const removeGoal = (userId, goalId) => ({
//     type: REMOVE_GOAL,
//     goalId,
//     userId
// });

// export const receiveGoalErrors = errors => ({
//     type: RECEIVE_GOAL_ERRORS,
//     errors
// });

// export const clearGoalErrors = errors => ({
//     type: CLEAR_GOAL_ERRORS,
//     errors
// });
// ////////////////////////////////////////////////////////////////////////////////////


const goalsReducer = (state = { all: {}, user: {}, new: undefined }, action) => {
    switch (action.type) {
        case RECEIVE_FEED_POSTS:
            return { ...state, all: action.tweets, new: undefined };
        case RECEIVE_USER_FEED_POSTS:
            return { ...state, user: action.tweets, new: undefined };
        case RECEIVE_NEW_FEED_POST:
            return { ...state, new: action.tweet };
        case RECEIVE_USER_LOGOUT:
            return { ...state, user: {}, new: undefined }
        default:
            return state;
    }
};

export default goalsReducer;