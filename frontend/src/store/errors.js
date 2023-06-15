import { combineReducers } from 'redux';
import { sessionErrorsReducer } from './session';
import { feedPostErrorsReducer } from './feedPosts';
import { goalErrorsReducer } from './goals';
import { exerciseEntryErrorsReducer } from './exerciseEntries';

export default combineReducers({
  session: sessionErrorsReducer,
  feedPosts: feedPostErrorsReducer,
  goals: goalErrorsReducer,
  exerciseEntries: exerciseEntryErrorsReducer
});