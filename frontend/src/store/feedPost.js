import jwtFetch from './jwt';
import { RECEIVE_USER_LOGOUT } from './session';

const RECEIVE_FEED_POSTS = "feedPosts/RECEIVE_FEED_POSTS";
const RECEIVE_USER_FEED_POSTS = "feedPosts/RECEIVE_USER_FEED_POSTS";
const RECEIVE_NEW_FEED_POST = "feedPosts/RECEIVE_NEW_FEED_POST";
const RECEIVE_FEED_POST_ERRORS = "feedPosts/RECEIVE_FEED_POST_ERRORS";
const CLEAR_FEED_POST_ERRORS = "feedPosts/CLEAR_FEED_POST_ERRORS";

const receiveFeedPosts = feedPosts => ({
  type: RECEIVE_FEED_POSTS,
  feedPosts
});

const receiveUserFeedPosts = feedPosts => ({
  type: RECEIVE_USER_FEED_POSTS,
  feedPosts
});

const receiveNewFeedPost = feedPost => ({
  type: RECEIVE_NEW_FEED_POST,
  feedPost
});

const receiveFeedPostErrors = errors => ({
  type: RECEIVE_FEED_POST_ERRORS,
  errors
});

export const clearFeedPostErrors = errors => ({
    type: CLEAR_FEED_POST_ERRORS,
    errors
});

export const fetchFeedPosts = () => async dispatch => {
  try {
    const res = await jwtFetch ('/api/feedPosts');
    const feedPosts = await res.json();
    dispatch(receiveFeedPosts(feedPosts));
  } catch (err) {
    const resBody = await err.json();
    if (resBody.statusCode === 400) {
      dispatch(receiveErrors(resBody.errors));
    }
  }
};

export const fetchUserFeedPosts = id => async dispatch => {
  try {
    const res = await jwtFetch(`/api/feedPosts/user/${id}`);
    const feedPosts = await res.json();
    dispatch(receiveUserFeedPosts(feedPosts));
  } catch(err) {
    const resBody = await err.json();
    if (resBody.statusCode === 400) {
      return dispatch(receiveFeedPostErrors(resBody.errors));
    }
  }
};

export const createFeedPost = data => async dispatch => {
  try {
    const res = await jwtFetch('/api/feedPosts/', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    const feedPost = await res.json();
    dispatch(receiveNewFeedPost(feedPost));
  } catch(err) {
    const resBody = await err.json();
    if (resBody.statusCode === 400) {
      return dispatch(receiveFeedPostErrors(resBody.errors));
    }
  }
};

const nullErrors = null;

export const feedPostErrorsReducer = (state = nullErrors, action) => {
  switch(action.type) {
    case RECEIVE_FEED_POST_ERRORS:
      return action.errors;
    case RECEIVE_NEW_FEED_POST:
    case CLEAR_FEED_POST_ERRORS:
      return nullErrors;
    default:
      return state;
  }
};

const feedPostsReducer = (state = { all: {}, user: {}, new: undefined }, action) => {
  switch(action.type) {
    case RECEIVE_FEED_POSTS:
      return { ...state, all: action.tweets, new: undefined};
    case RECEIVE_USER_FEED_POSTS:
      return { ...state, user: action.tweets, new: undefined};
    case RECEIVE_NEW_FEED_POST:
      return { ...state, new: action.tweet};
    case RECEIVE_USER_LOGOUT:
      return { ...state, user: {}, new: undefined }
    default:
      return state;
  }
};

export default feedPostsReducer;