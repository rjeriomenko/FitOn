import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './SessionForm.css';
import { signup, login, clearSessionErrors } from '../../store/session';

function SignupForm () {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const errors = useSelector(state => state.errors.session);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearSessionErrors());
    };
  }, [dispatch]);

  const update = field => {
    let setState;

    switch (field) {
      case 'email':
        setState = setEmail;
        break;
      case 'username':
        setState = setUsername;
        break;
      case 'password':
        setState = setPassword;
        break;
      case 'password2':
        setState = setPassword2;
        break;
      default:
        throw Error('Unknown field in Signup Form');
    }

    return e => setState(e.currentTarget.value);
  }

  const handleSubmit = e => {
    e.preventDefault();
    const user = {
      email,
      username,
      password
    };

    dispatch(signup(user)); 
  }

  const demoLogin = (e) => {
    e.preventDefault();
    const demoEmail = "demo@demo.io"
    const demoPassword = "password"
    setUsername(demoEmail)
    setEmail(demoEmail)
    setPassword(demoPassword)
    setPassword2(demoPassword)
    dispatch(login({ email:demoEmail, password:demoPassword })); 
  }

  return (
    <div className='session-form-container'>
      
      <form className="session-form" onSubmit={handleSubmit}>

        <h2>Sign Up</h2>

        <div>
          <label className='text-input-container'>
            <input type="text"
              className='text-input'
              value={email}
              onChange={update('email')}
              placeholder="Email"
            />
          </label>
          <div className="errors">{errors?.email}</div>
        </div>

        <div>
          <label className='text-input-container'>
            <input type="text"
              className='text-input'
              value={username}
              onChange={update('username')}
              placeholder="Username"
            />
          </label>
            <div className="errors">{errors?.username}</div>
        </div>
          
        <div>
            <label className='text-input-container'>
              <input type="password"
                className='text-input'
                value={password}
                onChange={update('password')}
                placeholder="Password"
              />
            </label>
          <div className="errors">{errors?.password}</div>
        </div>

        <div>
          <label className='text-input-container'>
            <input type="password"
              className='text-input'
              value={password2}
              onChange={update('password2')}
              placeholder="Confirm Password"
            />
          </label>
          <div className="errors">
            {password !== password2 && 'Confirm Password field must match'}
          </div>
        </div>

        <input
          className='session-form-submit'
          type="submit"
          value="Sign Up"
          disabled={!email || !username || !password || password !== password2}
        />

        <button
          className='session-form-submit'
          onClick={demoLogin}
        >Demo
        </button>
      </form>
    </div>
  );
}

export default SignupForm;