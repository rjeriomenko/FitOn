import jwtFetch from './jwt';

const RECEIVE_UPDATED_EXERCISE_ENTRY = "exerciseEntries/RECEIVE_UPDATED_EXERCISE_ENTRY";
const RECEIVE_USER_EXERCISE_ENTRIES = "exerciseEntries/RECEIVE_USER_EXERCISE_ENTRIES";
const RECEIVE_GOAL_EXERCISE_ENTRIES = "exerciseEntries/RECEIVE_GOAL_EXERCISE_ENTRIES";
const RECEIVE_FOLLOWS_EXERCISE_ENTRIES = "exerciseEntries/RECEIVE_FOLLOWS_EXERCISE_ENTRIES";
const RECEIVE_DISCOVERS_EXERCISE_ENTRIES = "exerciseEntries/RECEIVE_DISCOVERS_EXERCISE_ENTRIES";
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

export const receiveFollowsExerciseEntries = (exerciseEntries) => ({
    type: RECEIVE_FOLLOWS_EXERCISE_ENTRIES,
    exerciseEntries
});

export const receiveDiscoversExerciseEntries = (exerciseEntries) => ({
    type: RECEIVE_DISCOVERS_EXERCISE_ENTRIES,
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

export const fetchGoalExerciseEntries = (goalId) => async dispatch => {  //pre-emptive thunk
    try {
        const res = await jwtFetch(`/api/exerciseEntries/byGoal/${goalId}`);
        const goalEntries = await res.json();
        dispatch(receiveGoalExerciseEntries(goalEntries));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveExerciseEntryErrors(resBody.errors));
        }
    }
};

export const fetchFollowsExerciseEntries = () => async dispatch => {  //pre-emptive thunk
    try {
        const res = await jwtFetch(`/api/exerciseEntries/byFollows`);
        const followsExerciseEntries = await res.json();
        dispatch(receiveFollowsExerciseEntries(followsExerciseEntries));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveExerciseEntryErrors(resBody.errors));
        }
    }
};

export const fetchDiscoversExerciseEntries = () => async dispatch => {  //pre-emptive thunk
    try {
        const res = await jwtFetch(`/api/exerciseEntries/byDiscovers`);
        const discoversExerciseEntries = await res.json();
        dispatch(receiveDiscoversExerciseEntries(discoversExerciseEntries));
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

export const updateExerciseEntry = (exerciseEntryId, exerciseEntry) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/exerciseEntries/${exerciseEntryId}`, {
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

export const deleteExerciseEntry = (exerciseEntryId) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/exerciseEntries/${exerciseEntryId}`, {
            method: 'DELETE'
        });
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

export const getUserExerciseEntries = state => {
    if (state?.exerciseEntries) {
        return state.exerciseEntries.user
    } else {
        return null;
    }
}

export const getGoalExerciseEntries = state => {
    if (state?.exerciseEntries) {
        return state.exerciseEntries.goal
    } else {
        return null;
    }
}

export const getFollowsExerciseEntries = state => {
    if (state?.exerciseEntries) {
        return state.exerciseEntries.follows
    } else {
        return null;
    }
}

export const getDiscoversExerciseEntries = state => {
    if (state?.exerciseEntries) {
        return state.exerciseEntries.discovers
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

const exerciseEntriesReducer = (state = { user: {}, goal: {}, follows: {}, discovers: {}, updated: undefined, new: undefined }, action) => {
    let newState = { ...state };

    switch (action.type) {
        case RECEIVE_UPDATED_EXERCISE_ENTRY:
            return { ...newState, updated: action.exerciseEntry, new: undefined };
        case RECEIVE_USER_EXERCISE_ENTRIES:
            return { ...newState, user: action.exerciseEntries, updated: undefined, new: undefined };
        case RECEIVE_GOAL_EXERCISE_ENTRIES:
            return { ...newState, goal: action.exerciseEntries, updated: undefined, new: undefined };
        case RECEIVE_FOLLOWS_EXERCISE_ENTRIES:
            return { ...newState, follows: action.exerciseEntries, updated: undefined, new: undefined };
        case RECEIVE_DISCOVERS_EXERCISE_ENTRIES:
            return { ...newState, discovers: action.exerciseEntries, updated: undefined, new: undefined };
        case RECEIVE_NEW_EXERCISE_ENTRY:
            return { ...newState, updated: undefined, new: action.exerciseEntry }; //might be tricky to see dynamic changes
        default:
            return newState;
    }
};

export default exerciseEntriesReducer;