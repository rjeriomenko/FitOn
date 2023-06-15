import jwtFetch from './jwt';

const RECEIVE_EXERCISE_ENTRIES = "exerciseEntries/RECEIVE_EXERCISE_ENTRIES";
const RECEIVE_UPDATED_EXERCISE_ENTRY = "exerciseEntries/RECEIVE_UPDATED_EXERCISE_ENTRY";
const RECEIVE_USER_EXERCISE_ENTRY = "exerciseEntries/RECEIVE_USER_EXERCISE_ENTRY";
const RECEIVE_USER_EXERCISE_ENTRIES = "exerciseEntries/RECEIVE_USER_EXERCISE_ENTRIES";
const RECEIVE_GOAL_EXERCISE_ENTRIES = "exerciseEntries/RECEIVE_GOAL_EXERCISE_ENTRIES";
const RECEIVE_NEW_EXERCISE_ENTRY = "exerciseEntries/RECEIVE_NEW_EXERCISE_ENTRY";
const REMOVE_EXERCISE_ENTRY = "exerciseEntries/REMOVE_EXERCISE_ENTRY";
const RECEIVE_EXERCISE_ENTRY_ERRORS = "exerciseEntries/RECEIVE_EXERCISE_ENTRY_ERRORS";
const CLEAR_EXERCISE_ENTRY_ERRORS = "exerciseEntries/CLEAR_EXERCISE_ENTRY_ERRORS";

export const receiveExerciseEntries = (exerciseEntries) => ({
    type: RECEIVE_EXERCISE_ENTRIES,
    exerciseEntries
});

export const receiveUpdatedExerciseEntry = (exerciseEntry) => ({
    type: RECEIVE_UPDATED_EXERCISE_ENTRY,
    exerciseEntry
});

export const receiveUserExerciseEntry = (exerciseEntry) => ({
    type: RECEIVE_USER_EXERCISE_ENTRY,
    exerciseEntry
});

export const receiveUserExerciseEntries = (exerciseEntries) => ({
    type: RECEIVE_USER_EXERCISE_ENTRIES,
    exerciseEntries
});

export const receiveGoalExerciseEntries = (exerciseEntries) => ({
    type: RECEIVE_GOAL_EXERCISE_ENTRIES,
    exerciseEntries
});

export const receiveNewExerciseEntry = (exerciseEntry) => ({
    type: RECEIVE_NEW_EXERCISE_ENTRY,
    exerciseEntry
});

export const removeExerciseEntry = (userId, exerciseEntryId) => ({
    type: REMOVE_EXERCISE_ENTRY,
    userId,
    exerciseEntryId
});

export const receiveExerciseEntryErrors = errors => ({
    type: RECEIVE_EXERCISE_ENTRY_ERRORS,
    errors
});

export const clearExerciseEntryErrors = errors => ({
    type: CLEAR_EXERCISE_ENTRY_ERRORS,
    errors
});

//Thunks

export const fetchAllUserExerciseEntries = () => async dispatch => {
    try {
        const res = await jwtFetch('/api/users');
        const users = await res.json();
        const usersExerciseEvents = {};
        users.forEach(user => {
            if (user.goals.length) {
                user.goals.forEach(goal => {
                    if (goal.exerciseEntries.length) {
                        goal.exerciseEntries.forEach(exerciseEntry => {
                            usersExerciseEvents[exerciseEntry._id] = { exerciseEntry: exerciseEntry, goalId: goal._id, goal: goal.title, setter: user.username, setterId: user._id }
                        })
                    }
                })
            }
        });
        dispatch(receiveExerciseEntries(usersExerciseEvents));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveExerciseEntryErrors(resBody.errors));
        }
    }
};

//Fetches formatted exercise entries
export const fetchUserExerciseEntries = userId => async dispatch => {
    try {
        const res = await jwtFetch(`/api/users/${userId}/entries`);
        const userEntries = await res.json();
        dispatch(receiveUserExerciseEntries(userEntries));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveExerciseEntryErrors(resBody.errors));
        }
    }
};

//UNTESTED BELOW ----------------------------------------------------------------------------------------
//Stores error message in user key exerciseEntries array
export const fetchUserExerciseEntry = (userId, goalId, exerciseEntryId) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/users/${userId}/goals/${goalId}/entries/${exerciseEntryId}`);
        const userExerciseEntry = await res.json();
        dispatch(receiveUserExerciseEntry(userExerciseEntry));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveExerciseEntryErrors(resBody.errors));
        }
    }
};

export const fetchGoalExerciseEntries = (userId, goalId) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/users/${userId}/goals/${goalId}/entries`);
        const goalEntries = await res.json();
        dispatch(receiveGoalExerciseEntries(goalEntries));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveExerciseEntryErrors(resBody.errors));
        }
    }
};

export const createExerciseEntry = (userId, goalId, exerciseEntry) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/users/${userId}/goals/${goalId}/entries`, {
            method: 'POST',
            body: JSON.stringify(exerciseEntry)
        });
        const responseExerciseEntry = await res.json();
        dispatch(receiveNewExerciseEntry(responseExerciseEntry));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            return dispatch(receiveExerciseEntryErrors(resBody.errors));
        }
    }
};

export const updateExerciseEntry = (userId, goalId, exerciseEntry) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/users/${userId}/goals/${goalId}/entries/${exerciseEntry._id}`, {
            method: 'PATCH',
            body: JSON.stringify(exerciseEntry)
        });
        const responseExerciseEntry = await res.json();
        dispatch(receiveUpdatedExerciseEntry(responseExerciseEntry));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            return dispatch(receiveExerciseEntryErrors(resBody.errors));
        }
    }
};

export const deleteExerciseEntry = (userId, goalId, exerciseEntryId) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/users/${userId}/goals/${goalId}/entries/${exerciseEntryId}`, {
            method: 'DELETE'
        });
        dispatch(removeExerciseEntry(userId, goalId, exerciseEntryId));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            return dispatch(receiveExerciseEntryErrors(resBody.errors));
        }
    }
};

//Selectors

export const getExerciseEntry = (exerciseEntryId) => state => {
    if (state?.exerciseEntries.all[exerciseEntryId]) {
        return state.exerciseEntries.all[exerciseEntryId];
    } else {
        return null;
    }
}

export const getExerciseEntries = state => {
    if (state?.exerciseEntries) {
        return state.exerciseEntries.all
    } else {
        return null;
    }
}

export const getUserKeyExerciseEntries = state => {
    if (state?.exerciseEntries) {
        return state.exerciseEntries.user
    } else {
        return null;
    }
}
export const getGoalKeyExerciseEntries = state => {
    if (state?.exerciseEntries) {
        return state.exerciseEntries.goal
    } else {
        return null;
    }
}

export const getNewExerciseEntry = state => {
    if (state?.exerciseEntries) {
        return state.exerciseEntries.new
    } else {
        return null;
    }
}

const nullErrors = null;

//What other RECEIVE constants belong here?
export const exerciseEntryErrorsReducer = (state = nullErrors, action) => {
    switch (action.type) {
        case RECEIVE_EXERCISE_ENTRY_ERRORS:
            return action.errors;
        case RECEIVE_NEW_EXERCISE_ENTRY:
        case CLEAR_EXERCISE_ENTRY_ERRORS:
            return nullErrors;
        default:
            return state;
    }
};

const exerciseEntriesReducer = (state = { all: {}, user: {}, goal: {}, updated: undefined, new: undefined }, action) => {
    let newState = { ...state };

    switch (action.type) {
        case RECEIVE_EXERCISE_ENTRIES:
            return { ...newState, all: action.exerciseEntries, updated: undefined, new: undefined };
        case RECEIVE_UPDATED_EXERCISE_ENTRY:
            return { ...newState, updated: action.exerciseEntry, new: undefined };
        case RECEIVE_USER_EXERCISE_ENTRY:
            return { ...newState, user: action.exerciseEntry, updated: undefined, new: undefined };
        case RECEIVE_USER_EXERCISE_ENTRIES:
            return { ...newState, user: action.exerciseEntries, updated: undefined, new: undefined };
        case RECEIVE_GOAL_EXERCISE_ENTRIES:
            return { ...newState, goal: action.exerciseEntries, updated: undefined, new: undefined };
        case RECEIVE_NEW_EXERCISE_ENTRY:
            return { ...newState, updated: undefined, new: action.exerciseEntry };
        case REMOVE_EXERCISE_ENTRY:
            const cloneStateAll = { ...newState.all };
            delete cloneStateAll[action.exerciseEntryId];
            return { ...newState, all: cloneStateAll, updated: undefined, new: undefined };
        default:
            return newState;
    }
};

export default exerciseEntriesReducer;