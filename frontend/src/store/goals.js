import jwtFetch from './jwt';

const RECEIVE_GOALS = "goal/RECEIVE_GOALS";
const RECEIVE_UPDATED_GOAL = "goal/RECEIVE_UPDATED_GOAL";
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

export const receiveUpdatedGoal = (goal) => ({
    type: RECEIVE_UPDATED_GOAL,
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

//Thunks

//Returns all goals ordered by { userId: [userGoals], user2Id: [user2Goals], ...  }
export const fetchAllUserGoals = () => async dispatch => {
    try {
        const res = await jwtFetch('/api/users');
        const users = await res.json();
        const usersGoals = {};
        users.forEach(user => {
            if(user.goals.length) {
                usersGoals[user._id] = user.goals
            }
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
        dispatch(receiveUserGoals({ [userId]: userGoals }));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveGoalErrors(resBody.errors));
        }
    }
};

//Stores error message in user key goals array
export const fetchUserGoal = (userId, goalId) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/users/${userId}/goals/${goalId}`);
        const userGoal = await res.json();
        dispatch(receiveUserGoal({ [userId]: [userGoal] }));
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
        dispatch(receiveNewGoal({ [userId]: [responseGoal] }));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            return dispatch(receiveGoalErrors(resBody.errors));
        }
    }
};

export const updateGoal = (userId, goal) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/users/${userId}/goals/${goal._id}`, {
            method: 'PATCH',
            body: JSON.stringify(goal)
        });
        const responseGoal = await res.json();
        dispatch(receiveUpdatedGoal({ userId: [responseGoal] }));
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

//Selectors

export const getGoal = (userId, goalId) => state => {
    if (state?.goals.all[userId]) {
        const userGoals = state.goals.all[userId];
        const goal = userGoals.filter(goal => goal._id === goalId);
        return goal;
    } else {
        return null;
    }
}

export const getGoals = state => {
    if (state?.goals) {
        return state.goals.all
    } else {
        return null;
    }
}

export const getUserKeyGoals = state => {
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

const goalsReducer = (state = { all: {}, user: {}, updated: undefined, new: undefined }, action) => {
    let newState = {...state};

    switch (action.type) {
        case RECEIVE_GOALS:
            return { ...newState, all: action.goals, updated: undefined, new: undefined };
        case RECEIVE_UPDATED_GOAL:
            return { ...newState, updated: action.goal, new: undefined };
        case RECEIVE_USER_GOAL:
            return { ...newState, user: action.goal, updated: undefined, new: undefined };
        case RECEIVE_USER_GOALS:
            return { ...newState, user: action.goals, updated: undefined, new: undefined };
        case RECEIVE_NEW_GOAL:
            return { ...newState, updated: undefined, new: action.goal };
        //prev state in Redux Console will reflect new state before action reaches store
        case REMOVE_GOAL:
            const oldGoalsArray = newState.all[action.userId];
            const filteredGoalsArray = oldGoalsArray.filter(goal => goal._id !== action.goalId);
            const cloneState = { ...newState };

            cloneState.all[action.userId] = filteredGoalsArray;
            
            return { ...newState, ...cloneState, updated: undefined, new: undefined };
        default:
            return newState;
    }
};

export default goalsReducer;