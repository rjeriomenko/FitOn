import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Switch } from 'react-router-dom';

import { AuthRoute, ProtectedRoute } from './components/Routes/Routes';
import NavBar from './components/NavBar/NavBar';

import LandingPage from './components/LandingPage/LandingPage';
import LoginForm from './components/SessionForms/LoginForm';
import SignupForm from './components/SessionForms/SignupForm';
import FeedPosts from './components/FeedPosts/FeedPosts';
import Profile from './components/Profile/Profile';
import GoalCreate from './components/FeedPosts/GoalCreate';

import { getCurrentUser } from './store/session';
import FloatingMenu from './components/FloatingMenu/FloatingMenu';
import MainPageWrapper from './components/MainPageWrapper/MainPageWrapper';

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCurrentUser()).then(() => setLoaded(true));
  }, [dispatch]);

  return loaded && (
    <div className='app-container'>
      <NavBar />
      <FloatingMenu />
        <Switch>
          <AuthRoute exact path="/login" component={LoginForm} />
          <AuthRoute exact path="/signup" component={SignupForm} />
          
      <MainPageWrapper>
          <AuthRoute exact path="/" component={LandingPage} />

          <ProtectedRoute exact path="/feedPosts" component={FeedPosts} />
          <ProtectedRoute exact path="/profile" component={Profile} />
          <ProtectedRoute exact path="/feedPosts/newGoal" component={GoalCreate} />
      </MainPageWrapper>
      
        </Switch>
    </div>
  );
}


export default App;
