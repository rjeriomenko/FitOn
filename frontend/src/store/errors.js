import { combineReducers } from 'redux';
import { sessionErrorsReducer } from './session';
import { feedPostErrorsReducer } from './feedPosts';

export default combineReducers({
  session: sessionErrorsReducer,
  feedPosts: feedPostErrorsReducer
});