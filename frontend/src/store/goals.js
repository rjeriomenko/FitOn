import jwtFetch from './jwt';

const RECEIVE_UPDATED_GOAL = "goals/RECEIVE_UPDATED_GOAL";
const RECEIVE_USER_GOALS = "goals/RECEIVE_USER_GOALS";
const RECEIVE_FOLLOWS_GOALS = "goals/RECEIVE_FOLLOWS_GOALS";
const RECEIVE_DISCOVERS_GOALS = "goals/RECEIVE_DISCOVERS_GOALS";
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

export const receiveFollowsGoals = (goals) => ({
    type: RECEIVE_FOLLOWS_GOALS,
    goals
});

export const receiveDiscoversGoals = (goals) => ({
    type: RECEIVE_DISCOVERS_GOALS,
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

export const fetchFollowsGoals = () => async dispatch => {  
    try {
        const res = await jwtFetch(`/api/goals/followed`);
        const followsGoals = await res.json();
        dispatch(receiveFollowsGoals(followsGoals));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveGoalErrors(resBody.errors));
        }
    }
};

export const fetchDiscoversGoals = () => async dispatch => {  
    try {
        const res = await jwtFetch(`/api/goals/sample`);
        const discoversGoals = await res.json();
        dispatch(receiveDiscoversGoals(discoversGoals));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveGoalErrors(resBody.errors));
        }
    }
};

export const createGoal = (goal) => async dispatch => {
    const { image, title, description, deadline } = goal;
    const formData = new FormData();
    formData.append("title", title)
    formData.append("description", description)
    formData.append("deadline", deadline)
    if (image) formData.append("image", image);

    try {
        const res = await jwtFetch(`/api/goals`, {
            method: 'POST',
            body: formData
        });
        const responseGoal = await res.json();
        dispatch(receiveNewGoal(responseGoal));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            return dispatch(receiveGoalErrors(resBody.errors));
        }
    }
};

export const updateGoal = (goal) => async dispatch => {
    const { image, title, description, completionDate } = goal;
    const formData = new FormData();
    formData.append("title", title)
    formData.append("description", description)
    formData.append("completionDate", completionDate)
    
    if (image) formData.append("image", image);

    try {
        const res = await jwtFetch(`/api/goals/${goal._id}`, {
            method: 'PATCH',
            body: formData
        });
        const responseGoal = await res.json();
        dispatch(receiveUpdatedGoal(responseGoal));
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

export const getFollowsGoals = state => {
    if (state?.goals) {
        return state.goals.follows
    } else {
        return null;
    }
}

export const getDiscoversGoals = state => {
    if (state?.goals) {
        return state.goals.discovers
    } else {
        return null;
    }
}

export const getUpdatedGoal = state => {
    if (state?.goals) {
        return state.goals.updated
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

const goalsReducer = (state = { user: {}, follows: {}, discovers: {}, updated: undefined, new: undefined }, action) => {
    let newState = { ...state };

    switch (action.type) {
        case RECEIVE_UPDATED_GOAL:
            return { ...newState, user: { ...newState.user, ...action.goal }, updated: action.goal, new: undefined };
        case RECEIVE_USER_GOALS:
            // return { ...newState, user: action.goals, updated: undefined, new: undefined };
            
            const updated = { ...newState, user: action.goals, updated: undefined, new: undefined };
            
            return updated
            // newState : user: {1, 2}, follows: {1, 2, 77, 78}, discovers, updated, new, user: {3, 4}
        case RECEIVE_FOLLOWS_GOALS:
            return { ...newState, follows: action.goals, updated: undefined, new: undefined };
        case RECEIVE_DISCOVERS_GOALS:
            return { ...newState, discovers: action.goals, updated: undefined, new: undefined };
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