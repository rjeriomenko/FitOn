import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Switch } from 'react-router-dom';

import { AuthRoute, ProtectedRoute } from './components/Routes/Routes';
import NavBar from './components/NavBar/NavBar';

import LandingPage from './components/LandingPage/LandingPage';
import LoginForm from './components/SessionForms/LoginForm';
import SignupForm from './components/SessionForms/SignupForm';
import Feed from './components/FeedPosts/Feed';
import Profile from './components/Profile/Profile';
import GoalCreate from './components/FeedPosts/GoalCreate';
import GoalIndex from './components/Goals/GoalIndex';
import GoalEdit from './components/Goals/GoalEdit';
import ExerciseCreateForm from './components/Exercise/ExerciseCreateForm';
import Test from './components/Test/Test';

import { getCurrentUser } from './store/session';
import FloatingMenu from './components/FloatingMenu/FloatingMenu';
import MainPageWrapper from './components/MainPageWrapper/MainPageWrapper';

import Exercise2 from './components/Exercise/Exercise2';
import ExerciseEventForm from './components/Exercise/ExerciseEventForm';

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCurrentUser()).then(() => setLoaded(true));
  }, [dispatch]);

  const setupTestEnv = () => {
    if (process.env.NODE_ENV !== 'production') { return (<Test />) };
  }


  return loaded && (
    <div className='app-container'>
      {setupTestEnv()}
      <div className='nav-bar-offset'/>
      <NavBar />
      <FloatingMenu />
        <Switch>
          <AuthRoute exact path="/login" component={LoginForm} />
          <AuthRoute exact path="/signup" component={SignupForm} />
          
      <MainPageWrapper>
          <AuthRoute exact path="/" component={LandingPage} />

          <ProtectedRoute exact path="/feed" component={Feed} />
          <ProtectedRoute exact path="/profile" component={Profile} />
          <ProtectedRoute exact path="/feedPosts/newGoal" component={GoalCreate} />
          <ProtectedRoute exact path="/feedPosts/editGoal" component={GoalEdit} />
          <ProtectedRoute exact path="/feedPosts/myGoal" component={GoalIndex} />
          <ProtectedRoute exact path="/gains1" component={ExerciseCreateForm} />

          <ProtectedRoute exact path="/gains2" component={Exercise2} />
          <ProtectedRoute exact path="/gains" component={ExerciseEventForm} />


      </MainPageWrapper>
      
        </Switch>
    </div>
  );
}


export default App;
