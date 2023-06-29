import jwtFetch from './jwt';

const RECEIVE_UPDATED_GOAL = "goals/RECEIVE_UPDATED_GOAL";
const RECEIVE_USER_GOALS = "goals/RECEIVE_USER_GOALS";
const RECEIVE_NEW_GOAL = "goals/RECEIVE_NEW_GOAL";
const REMOVE_GOAL = "goals/REMOVE_GOAL";
const RECEIVE_GOAL_ERRORS = "goals/RECEIVE_GOAL_ERRORS";
const CLEAR_GOAL_ERRORS = "goals/CLEAR_GOAL_ERRORS";

export const receiveUpdatedGoal = (goal) => ({
    type: RECEIVE_UPDATED_GOAL,
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

export const removeGoal = (goalId) => ({
    type: REMOVE_GOAL,
    goalId
});

export const receiveGoalErrors = errors => ({
    type: RECEIVE_GOAL_ERRORS,
    errors
});

export const clearGoalErrors = errors => ({
    type: CLEAR_GOAL_ERRORS,
    errors
});

//Thunks

export const fetchUserGoals = userId => async dispatch => {
    try {
        const res = await jwtFetch(`/api/goals/all/${userId}`);
        const userGoals = await res.json();
        dispatch(receiveUserGoals(userGoals));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveGoalErrors(resBody.errors));
        }
    }
};

export const createGoal = (goal) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/goals`, {
            method: 'POST',
            body: JSON.stringify(goal)
        });
        const responseGoal = await res.json();
        dispatch(receiveNewGoal({ [responseGoal._id]: [responseGoal] }));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            return dispatch(receiveGoalErrors(resBody.errors));
        }
    }
};

export const updateGoal = (userId, goal) => async dispatch => {
    try {
        console.log("userId-", userId, "goal._id-", goal._id)
        const res = await jwtFetch(`/api/users/${userId}/goals/${goal._id}`, {
            method: 'PATCH',
            body: JSON.stringify(goal)
        });
        const responseGoal = await res.json();
        dispatch(receiveUpdatedGoal({ [goal._id]: { goalId: goal._id, goal: responseGoal, setter: goal.setter, setterId: userId } }));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            return dispatch(receiveGoalErrors(resBody.errors));
        }
    }
};

export const deleteGoal = (goalId) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/goals/${goalId}`, {
            method: 'DELETE'
        });
        dispatch(removeGoal(goalId));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            return dispatch(receiveGoalErrors(resBody.errors));
        }
    }
};

//Selectors
export const getGoal = (goalId) => state => {
    if (state?.goals.user[goalId]) {
        return state.goals.user[goalId];
    } else {
        return null;
    }
}

export const getUserGoals = state => {
    if (state?.goals) {
        return state.goals.user
    } else {
        return null;
    }
}

export const getNewGoal = state => {
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

const goalsReducer = (state = { user: {}, updated: undefined, new: undefined }, action) => {  ///DELETE ALL, UPDATED WHEN READY
    let newState = { ...state };

    switch (action.type) {
        // case RECEIVE_UPDATED_GOAL:
        //     return { ...newState, all: { ...newState.all, ...action.goal }, updated: action.goal, new: undefined };
        case RECEIVE_USER_GOALS:
            return { ...newState, user: action.goals, updated: undefined, new: undefined };
        case RECEIVE_NEW_GOAL:
            return { ...newState, new: action.goal };
        case REMOVE_GOAL:
            const cloneStateUser = { ...newState.user };
            delete cloneStateUser[action.goalId];
            return { ...newState, user: cloneStateUser, updated: undefined, new: undefined };
        default:
            return newState;
    }
};

export default goalsReducer;