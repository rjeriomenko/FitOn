import jwtFetch from './jwt';

const RECEIVE_USERS = "users/RECEIVE_USERS";
const RECEIVE_USER = "users/RECEIVE_USER";
const RECEIVE_USER_ERRORS = "users/RECEIVE_USER_ERRORS";
const CLEAR_USER_ERRORS = "users/CLEAR_USER_ERRORS";

export const receiveUsers = (users) => ({
    type: RECEIVE_USERS,
    users
});

export const receiveUser = (user) => ({
    type: RECEIVE_USER,
    user
});

export const receiveUserErrors = errors => ({
    type: RECEIVE_USER_ERRORS,
    errors
});

export const clearUserErrors = errors => ({
    type: CLEAR_USER_ERRORS,
    errors
});

//Thunks

export const fetchUsers = () => async dispatch => {
    try {
        const res = await jwtFetch(`/api/users`);
        const users = await res.json();
        dispatch(receiveUsers(users));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveUserErrors(resBody.errors));
        }
    }
};

export const fetchUser = userId => async dispatch => {
    try {
        const res = await jwtFetch(`/api/users/${userId}`);
        const user = await res.json();
        dispatch(receiveUser(user));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveUserErrors(resBody.errors));
        }
    }
};

// export const updateGoal = (userId, goal) => async dispatch => {     ----USE THIS AS A BASIS FOR updateUser THUNK
//     try {
//         console.log("userId-", userId, "goal._id-", goal._id)
//         const res = await jwtFetch(`/api/users/${userId}/goals/${goal._id}`, {
//             method: 'PATCH',
//             body: JSON.stringify(goal)
//         });
//         const responseGoal = await res.json();
//         dispatch(receiveUpdatedGoal({ [goal._id]: { goalId: goal._id, goal: responseGoal, setter: goal.setter, setterId: userId } }));
//     } catch (err) {
//         const resBody = await err.json();
//         if (resBody.statusCode === 400) {
//             return dispatch(receiveGoalErrors(resBody.errors));
//         }
//     }
// };

//Selectors
export const getUser = (userId) => state => {
    if (state?.users.individual[userId]) {
        return state.users.individual[userId];
    } else if (state?.users.all[userId]) {
        return (state?.users.all[userId])
    } else {
        return null;
    }
}

export const getUsers = state => {
    if (state?.users) {
        return state.users.all
    } else {
        return null;
    }
}

const nullErrors = null;

//What other RECEIVE constants belong here?
export const userErrorsReducer = (state = nullErrors, action) => {
    switch (action.type) {
        case RECEIVE_USER_ERRORS:
            return action.errors;
        case CLEAR_USER_ERRORS:
            return nullErrors;
        default:
            return state;
    }
};

const usersReducer = (state = { individual: {}, all: {}, subscribed: {} }, action) => {
    let newState = { ...state };

    switch (action.type) {
        case RECEIVE_USERS:
            return { ...newState, all: action.users };
        case RECEIVE_USER:
            return { ...newState, user: action.user };
        default:
            return newState;
    }
};

export default usersReducer;