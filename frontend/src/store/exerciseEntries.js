import jwtFetch from './jwt';

const RECEIVE_EXERCISE_ENTRIES = "exerciseEntries/RECEIVE_EXERCISE_ENTRIES";
const RECEIVE_UPDATED_EXERCISE_ENTRY = "exerciseEntries/RECEIVE_UPDATED_EXERCISE_ENTRY";
const RECEIVE_USER_EXERCISE_ENTRY = "exerciseEntries/RECEIVE_USER_EXERCISE_ENTRY";
const RECEIVE_USER_EXERCISE_ENTRIES = "exerciseEntries/RECEIVE_USER_EXERCISE_ENTRIES";
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
// //NEW
// export const receiveGoalExerciseEntry = (exerciseEntry) => ({
//     type: RECEIVE_USER_EXERCISE_ENTRY,
//     exerciseEntry
// });
// //NEW
// export const receiveGoalExerciseEntries = (exerciseEntries) => ({
//     type: RECEIVE_USER_EXERCISE_ENTRIES,
//     exerciseEntries
// });

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

//Returns all exerciseEntries ordered by { userId: {{ userGoal1Id: [exerciseEntries] }, { userGoal2Id: [exerciseEntries] }}, ...  }
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
        dispatch(receiveGoals(usersExerciseEvents));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveExerciseEventErrors(resBody.errors));
        }
    }
};


//CREATED THUNKS UP UNTIL THIS POINT (LEFT OFF HERE)
export const fetchUserGoals = userId => async dispatch => {
    try {
        const res = await jwtFetch(`/api/users/${userId}/exerciseEntries`);
        const userGoals = await res.json();
        dispatch(receiveUserGoals({ [userId]: userGoals }));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveGoalErrors(resBody.errors));
        }
    }
};

//Stores error message in user key exerciseEntries array
export const fetchUserGoal = (userId, exerciseEntryId) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/users/${userId}/exerciseEntries/${exerciseEntryId}`);
        const userGoal = await res.json();
        dispatch(receiveUserGoal({ [userId]: [userGoal] }));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveGoalErrors(resBody.errors));
        }
    }
};

export const createGoal = (userId, exerciseEntry) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/users/${userId}/exerciseEntries`, {
            method: 'POST',
            body: JSON.stringify(exerciseEntry)
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

export const updateGoal = (userId, exerciseEntry) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/users/${userId}/exerciseEntries/${exerciseEntry._id}`, {
            method: 'PATCH',
            body: JSON.stringify(exerciseEntry)
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

export const deleteGoal = (userId, exerciseEntryId) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/users/${userId}/exerciseEntries/${exerciseEntryId}`, {
            method: 'DELETE'
        });
        dispatch(removeGoal(userId, exerciseEntryId));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            return dispatch(receiveGoalErrors(resBody.errors));
        }
    }
};

//Selectors

export const getGoal = (userId, exerciseEntryId) => state => {
    if (state?.exerciseEntries.all[userId]) {
        const userGoals = state.exerciseEntries.all[userId];
        const exerciseEntry = userGoals.filter(exerciseEntry => exerciseEntry._id === exerciseEntryId);
        return exerciseEntry;
    } else {
        return null;
    }
}

export const getGoals = state => {
    if (state?.exerciseEntries) {
        return state.exerciseEntries.all
    } else {
        return null;
    }
}

export const getUserKeyGoals = state => {
    if (state?.exerciseEntries) {
        return state.exerciseEntries.user
    } else {
        return null;
    }
}

export const getNewGoal = state => {
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

const exerciseEntriesReducer = (state = { all: {}, user: {}, updated: undefined, new: undefined }, action) => {
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
        case RECEIVE_NEW_EXERCISE_ENTRY:
            return { ...newState, updated: undefined, new: action.exerciseEntry };
        //prev state in Redux Console will reflect new state before action reaches store
        case REMOVE_EXERCISE_ENTRY:
            const oldGoalsArray = newState.all[action.userId];
            const filteredGoalsArray = oldGoalsArray.filter(exerciseEntry => exerciseEntry._id !== action.exerciseEntryId);
            const cloneState = { ...newState };

            cloneState.all[action.userId] = filteredGoalsArray;

            return { ...newState, ...cloneState, updated: undefined, new: undefined };
        default:
            return newState;
    }
};

export default exerciseEntriesReducer;