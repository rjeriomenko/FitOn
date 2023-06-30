import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import session from './session';
import errors from './errors';
import feedPosts from './feedPosts';
import goals from './goals';
import exerciseEntries from './exerciseEntries';
import exercises from './exercises';
import users from './users';
import follows from './follows';

const rootReducer = combineReducers({
  session,
	errors,
  feedPosts,
  goals,
  exerciseEntries,
  exercises,
  users,
  follows
});

let enhancer;

if (process.env.NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require('redux-logger').default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;