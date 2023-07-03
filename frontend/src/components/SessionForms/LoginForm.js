import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './SessionForm.css';

import { login, clearSessionErrors } from '../../store/session';

function LoginForm () {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const errors = useSelector(state => state.errors.session);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearSessionErrors());
    };
  }, [dispatch]);

  const update = (field) => {
    const setState = field === 'email' ? setEmail : setPassword;
    return e => setState(e.currentTarget.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password })); 
  }

  const demoLogin = (e) => {
    e.preventDefault();
    const demoEmail = "demo@user.io"
    const demoPassword = "password"
    setEmail(demoEmail)
    setPassword(demoPassword)
    dispatch(login({ email:demoEmail, password:demoPassword })); 
  }

  const demoLogin2 = (e) => {
    e.preventDefault();
    const demoEmail = "demo2@user.io"
    const demoPassword = "password"
    setEmail(demoEmail)
    setPassword(demoPassword)
    dispatch(login({ email:demoEmail, password:demoPassword })); 
  }

  return (
    <div className='session-form-container'>
      <form className="session-form" onSubmit={handleSubmit}>
        
        <h2>Login</h2>

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
            <input type="password"
              className='text-input'
              value={password}
              onChange={update('password')}
              placeholder="Password"
            />
          </label>
          <div className="errors">{errors?.password}</div>
        </div>


        <div className='login-buttons'>
          <input
            className='session-form-submit'
            type="submit"
            value="Login"
            disabled={!email || !password}
          />
          <button
            className='session-form-submit'
            onClick={demoLogin}
          >Demo
          </button>
          <button
            className='session-form-submit'
            onClick={demoLogin2}
          >Demo #2
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;