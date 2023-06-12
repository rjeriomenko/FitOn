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

  return (
    <div className='session-form-container'>
      <form className="session-form" onSubmit={handleSubmit}>
        
        <h2>Login</h2>
        {/* <div className="errors"></div> */}

        <div>
          <label className='text-input-container'>
            {/* <span>Email</span> */}
            <span></span>
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
            {/* <span>Password</span> */}
            <span></span>
            <input type="password"
              className='text-input'
              value={password}
              onChange={update('password')}
              placeholder="Password"
            />
          </label>
          <div className="errors">{errors?.password}</div>
        </div>

        <input
          className='session-form-submit'
          type="submit"
          value="Login"
          disabled={!email || !password}
        />
      </form>
    </div>
  );
}

export default LoginForm;