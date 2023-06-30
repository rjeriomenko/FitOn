import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Renders a default route if loggedin to prevent
// navigating to login/signup forms if already signed in
export const AuthRoute = ({ component: Component, path, exact }) => {
  const loggedIn = useSelector(state => !!state.session.user);

  return (
    <Route path={path} exact={exact} render={(props) => (
      !loggedIn ? (
        <Component {...props} />
      ) : (
        <Redirect to="/feed" />
      )
    )} />
  );
};

// Route only accessible if loggedin
export const ProtectedRoute = ({ component: Component, ...rest }) => {
  const loggedIn = useSelector(state => !!state.session.user);
  return (
    <Route
      {...rest}
      render={props =>
        loggedIn ? (
          <Component {...props} discoverMode={rest.discoverMode} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};
