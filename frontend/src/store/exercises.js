import jwtFetch from './jwt';

const RECEIVE_EXERCISES = "exercises/RECEIVE_EXERCISES";
const RECEIVE_UPDATED_EXERCISE = "exercises/RECEIVE_UPDATED_EXERCISE";
const RECEIVE_USER_EXERCISE = "exercises/RECEIVE_USER_EXERCISE";
const RECEIVE_USER_EXERCISES = "exercises/RECEIVE_USER_EXERCISES";
const RECEIVE_GOAL_EXERCISES = "exercises/RECEIVE_GOAL_EXERCISES";
const RECEIVE_NEW_EXERCISE = "exercises/RECEIVE_NEW_EXERCISE";
const REMOVE_EXERCISE = "exercises/REMOVE_EXERCISE";
const RECEIVE_EXERCISE_ERRORS = "exercises/RECEIVE_EXERCISE_ERRORS";
const CLEAR_EXERCISE_ERRORS = "exercises/CLEAR_EXERCISE_ERRORS";

export const receiveExercises = (exercises) => ({
    type: RECEIVE_EXERCISES,
    exercises
});

export const receiveUpdatedExercise = (exercise) => ({
    type: RECEIVE_UPDATED_EXERCISE,
    exercise
});

export const receiveUserExercise = (exercise) => ({
    type: RECEIVE_USER_EXERCISE,
    exercise
});

export const receiveUserExercises = (exercises) => ({
    type: RECEIVE_USER_EXERCISES,
    exercises
});

export const receiveGoalExercises = (exercises) => ({
    type: RECEIVE_GOAL_EXERCISES,
    exercises
});

export const receiveNewExercise = (exercise) => ({
    type: RECEIVE_NEW_EXERCISE,
    exercise
});

export const removeExercise = (userId, exerciseId) => ({
    type: REMOVE_EXERCISE,
    userId,
    exerciseId
});

export const receiveExerciseErrors = errors => ({
    type: RECEIVE_EXERCISE_ERRORS,
    errors
});

export const clearExerciseErrors = errors => ({
    type: CLEAR_EXERCISE_ERRORS,
    errors
});

//Thunks
//Fetches formatted exercises
export const fetchAllUserExercises = () => async dispatch => {
    try {
        const res = await jwtFetch('/api/exercises');
        const exercises = await res.json();
        dispatch(receiveExercises(exercises));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveExerciseErrors(resBody.errors));
        }
    }
};

//Fetches formatted exercises
export const fetchUserExercises = userId => async dispatch => {
    try {
        const res = await jwtFetch(`/api/exercises/${userId}`);
        const userExercises = await res.json();
        dispatch(receiveUserExercises(userExercises));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveExerciseErrors(resBody.errors));
        }
    }
};

//BUILT AND TESTED ABOVE
export const createExercise = (exercise) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/exercises`, {
            method: 'POST',
            body: JSON.stringify(exercise)
        });
        const responseExercise = await res.json();
        dispatch(receiveNewExercise(responseExercise));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            return dispatch(receiveExerciseErrors(resBody.errors));
        }
    }
};

//Stores error message in user key exercises array
export const fetchUserExercise = (userId, goalId, exerciseId) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/users/${userId}/goals/${goalId}/entries/${exerciseId}`);
        const userExercise = await res.json();
        dispatch(receiveUserExercise(userExercise));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveExerciseErrors(resBody.errors));
        }
    }
};

export const fetchGoalExercises = (userId, goalId) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/users/${userId}/goals/${goalId}/entries`);
        const goalEntries = await res.json();
        dispatch(receiveGoalExercises(goalEntries));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveExerciseErrors(resBody.errors));
        }
    }
};

export const updateExercise = (userId, goalId, exercise) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/users/${userId}/goals/${goalId}/entries/${exercise._id}`, {
            method: 'PATCH',
            body: JSON.stringify(exercise)
        });
        const responseExercise = await res.json();
        dispatch(receiveUpdatedExercise(responseExercise));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            return dispatch(receiveExerciseErrors(resBody.errors));
        }
    }
};

export const deleteExercise = (userId, goalId, exerciseId) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/users/${userId}/goals/${goalId}/entries/${exerciseId}`, {
            method: 'DELETE'
        });
        dispatch(removeExercise(userId, exerciseId));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            return dispatch(receiveExerciseErrors(resBody.errors));
        }
    }
};

//Selectors

export const getExercise = (exerciseId) => state => {
    if (state?.exercises.all[exerciseId]) {
        return state.exercises.all[exerciseId];
    } else {
        return null;
    }
}

export const getExercises = state => {
    if (state?.exercises) {
        return state.exercises.all
    } else {
        return null;
    }
}

export const getUserKeyExercises = state => {
    if (state?.exercises) {
        return state.exercises.user
    } else {
        return null;
    }
}
export const getGoalKeyExercises = state => {
    if (state?.exercises) {
        return state.exercises.goal
    } else {
        return null;
    }
}

export const getNewExercise = state => {
    if (state?.exercises) {
        return state.exercises.new
    } else {
        return null;
    }
}

const nullErrors = null;

//What other RECEIVE constants belong here?
export const exerciseErrorsReducer = (state = nullErrors, action) => {
    switch (action.type) {
        case RECEIVE_EXERCISE_ERRORS:
            return action.errors;
        case RECEIVE_NEW_EXERCISE:
        case CLEAR_EXERCISE_ERRORS:
            return nullErrors;
        default:
            return state;
    }
};

const exercisesReducer = (state = { all: {}, user: {}, goal: {}, updated: undefined, new: undefined }, action) => {
    let newState = { ...state };

    switch (action.type) {
        case RECEIVE_EXERCISES:
            return { ...newState, all: action.exercises, updated: undefined, new: undefined };
        case RECEIVE_UPDATED_EXERCISE:
            return { ...newState, all: { ...newState.all, ...action.exercise }, updated: action.exercise, new: undefined };
        case RECEIVE_USER_EXERCISE:
            return { ...newState, user: action.exercise, updated: undefined, new: undefined };
        case RECEIVE_USER_EXERCISES:
            return { ...newState, user: action.exercises, updated: undefined, new: undefined };
        case RECEIVE_GOAL_EXERCISES:
            return { ...newState, goal: action.exercises, updated: undefined, new: undefined };
        case RECEIVE_NEW_EXERCISE:
            return { ...newState, updated: undefined, new: action.exercise };
        case REMOVE_EXERCISE:
            const cloneStateAll = { ...newState.all };
            delete cloneStateAll[action.exerciseId];
            return { ...newState, all: cloneStateAll, updated: undefined, new: undefined };
        default:
            return newState;
    }
};

export default exercisesReducer;