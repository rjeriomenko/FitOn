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
import GoalCreate from './components/Goals/GoalCreate';
import GoalIndex from './components/Goals/GoalIndex';
import GoalEdit from './components/Goals/GoalEdit';
import ExerciseEventForm from './components/Exercise/ExerciseEventForm';

import Test from './components/Test/Test';

import { getCurrentUser } from './store/session';
import FloatingMenu from './components/FloatingMenu/FloatingMenu';
import MainPageWrapper from './components/MainPageWrapper/MainPageWrapper';
import Footer from './components/Footer/Footer';


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
      {/* <div className='nav-bar-offset'/> */}
      <NavBar />
      <FloatingMenu />
        <Switch>
          <AuthRoute exact path="/login" component={LoginForm} />
          <AuthRoute exact path="/signup" component={SignupForm} />
          
          <AuthRoute exact path="/" component={LandingPage} />
      <MainPageWrapper>

          <ProtectedRoute exact path="/feed" component={Feed} />
          <ProtectedRoute exact path="/discover" component={Feed} discoverMode={true} />
          <ProtectedRoute exact path="/feed/:userId" component={Feed} />
          <ProtectedRoute exact path="/profile" component={Profile} />
          <ProtectedRoute exact path="/feedPosts/newGoal" component={GoalCreate} />
          <ProtectedRoute exact path="/feedPosts/editGoal" component={GoalEdit} />
          <ProtectedRoute exact path="/users/:userId/goals" component={GoalIndex} />
          <ProtectedRoute exact path="/gains" component={ExerciseEventForm} />

      </MainPageWrapper>
      
        </Switch>
      <div className='footer-offset'/>
      <Footer />
    </div>
  );
}


export default App;
