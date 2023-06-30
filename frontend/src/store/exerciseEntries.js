import jwtFetch from './jwt';

const RECEIVE_UPDATED_EXERCISE_ENTRY = "exerciseEntries/RECEIVE_UPDATED_EXERCISE_ENTRY";
const RECEIVE_USER_EXERCISE_ENTRIES = "exerciseEntries/RECEIVE_USER_EXERCISE_ENTRIES";
const RECEIVE_GOAL_EXERCISE_ENTRIES = "exerciseEntries/RECEIVE_GOAL_EXERCISE_ENTRIES";
const RECEIVE_NEW_EXERCISE_ENTRY = "exerciseEntries/RECEIVE_NEW_EXERCISE_ENTRY";
const REMOVE_EXERCISE_ENTRY = "exerciseEntries/REMOVE_EXERCISE_ENTRY";
const RECEIVE_EXERCISE_ENTRY_ERRORS = "exerciseEntries/RECEIVE_EXERCISE_ENTRY_ERRORS";
const CLEAR_EXERCISE_ENTRY_ERRORS = "exerciseEntries/CLEAR_EXERCISE_ENTRY_ERRORS";

export const receiveUpdatedExerciseEntry = (exerciseEntry) => ({
    type: RECEIVE_UPDATED_EXERCISE_ENTRY,
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

//Fetches formatted exercise entries
export const fetchUserExerciseEntries = userId => async dispatch => {
    try {
        const res = await jwtFetch(`/api/exerciseEntries/byUser/${userId}`);
        const userEntries = await res.json();
        dispatch(receiveUserExerciseEntries(userEntries));
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

export const createExerciseEntry = (goalId, exerciseEntry) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/exerciseEntries/${goalId}`, {
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
        dispatch(removeExerciseEntry(userId, exerciseEntryId));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            return dispatch(receiveExerciseEntryErrors(resBody.errors));
        }
    }
};

//Selectors

// export const getExerciseEntry = (exerciseEntryId) => state => {
//     if (state?.exerciseEntries.all[exerciseEntryId]) {
//         return state.exerciseEntries.all[exerciseEntryId];
//     } else {
//         return null;
//     }
// }

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

export const getUpdatedExerciseEntry = state => {
    if (state?.exerciseEntries) {
        return state.exerciseEntries.updated
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

const exerciseEntriesReducer = (state = { user: {}, goal: {}, updated: undefined, new: undefined }, action) => {
    let newState = { ...state };

    switch (action.type) {
        case RECEIVE_UPDATED_EXERCISE_ENTRY:
            return { ...newState, all: { ...newState.all, ...action.exerciseEntry }, updated: action.exerciseEntry, new: undefined };
        case RECEIVE_USER_EXERCISE_ENTRIES:
            return { ...newState, user: action.exerciseEntries, updated: undefined, new: undefined };
        case RECEIVE_GOAL_EXERCISE_ENTRIES:
            return { ...newState, goal: action.exerciseEntries, updated: undefined, new: undefined };
        case RECEIVE_NEW_EXERCISE_ENTRY:
            return { ...newState, updated: undefined, new: action.exerciseEntry }; //might be tricky to see dynamic changes
        case REMOVE_EXERCISE_ENTRY:
            const cloneStateAll = { ...newState.all };
            delete cloneStateAll[action.exerciseEntryId];
            return { ...newState, all: cloneStateAll, updated: undefined, new: undefined };
        default:
            return newState;
    }
};

export default exerciseEntriesReducer;