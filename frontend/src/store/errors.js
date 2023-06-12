import { combineReducers } from 'redux';
import { sessionErrorsReducer } from './session';
import { feedPostErrorsReducer } from './feedPost';

export default combineReducers({
  session: sessionErrorsReducer,
  feedPosts: feedPostErrorsReducer
});