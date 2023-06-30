import jwtFetch from './jwt';

const RECEIVE_FOLLOWS = "follows/RECEIVE_FOLLOWS";
const RECEIVE_NEW_FOLLOW = "follows/RECEIVE_NEW_FOLLOW";
const RECEIVE_FOLLOW_ERRORS = "follows/RECEIVE_FOLLOW_ERRORS";
const CLEAR_FOLLOW_ERRORS = "follows/CLEAR_FOLLOW_ERRORS";

export const receiveFollows = (follows) => ({
    type: RECEIVE_FOLLOWS,
    follows
});

export const receiveNewFollow = (follow) => ({
    type: RECEIVE_NEW_FOLLOW,
    follow
});

export const receiveFollowErrors = errors => ({
    type: RECEIVE_FOLLOW_ERRORS,
    errors
});

export const clearFollowErrors = errors => ({
    type: CLEAR_FOLLOW_ERRORS,
    errors
});

//Thunks

export const fetchFollows = userId => async dispatch => {
    try {
        const res = await jwtFetch(`/api/follows/${userId}`);
        const follows = await res.json();
        dispatch(receiveFollows(follows));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveFollowErrors(resBody.errors));
        }
    }
};

export const createFollow = (followingUserId, followedUserId) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/follows/${followedUserId}`, {
            method: 'POST'
        });
        const responseFollow = await res.json();
        dispatch(receiveNewFollow(responseFollow));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveFollowErrors(resBody.errors));
        }
    }
};

//Selectors
// export const getUser = (userId) => state => {
//     if (state?.users.individual[userId]) {
//         return state.users.individual[userId];
//     } else if (state?.users.all[userId]) {
//         return (state?.users.all[userId])
//     } else {
//         return null;
//     }
// }

export const getFollows = state => {
    if (state?.follows) {
        return state.follows.user
    } else {
        return null;
    }
}

export const getNewFollow = state => {
    if (state?.follows) {
        return state.follows.new
    } else {
        return null;
    }
}

const nullErrors = null;

//What other RECEIVE constants belong here?
export const followErrorsReducer = (state = nullErrors, action) => {
    switch (action.type) {
        case RECEIVE_FOLLOW_ERRORS:
            return action.errors;
        case CLEAR_FOLLOW_ERRORS:
            return nullErrors;
        default:
            return state;
    }
};

const followsReducer = (state = { user: {}, new: undefined }, action) => {
    let newState = { ...state };

    switch (action.type) {
        case RECEIVE_FOLLOWS:
            return { ...newState, user: action.follows, new: undefined };
        case RECEIVE_NEW_FOLLOW:
            return { ...newState, new: action.follow };
        default:
            return newState;
    }
};

export default followsReducer;