import { combineReducers } from 'redux';
import { sessionErrorsReducer } from './session';
// import { feedPostErrorsReducer } from './feedPosts';
import { goalErrorsReducer } from './goals';
import { exerciseEntryErrorsReducer } from './exerciseEntries';
import { exerciseErrorsReducer } from './exercises';
import { userErrorsReducer } from './users';
import { followErrorsReducer } from './follows';

export default combineReducers({
  session: sessionErrorsReducer,
  // feedPosts: feedPostErrorsReducer,
  goals: goalErrorsReducer,
  exerciseEntries: exerciseEntryErrorsReducer,
  exercises: exerciseErrorsReducer,
  users: userErrorsReducer,
  follows: followErrorsReducer
});