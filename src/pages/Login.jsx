/* eslint-disable react/no-unknown-property */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { backendUrl } from '../config';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleReset = () => {
    setEmail('');
    setPassword('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,

    };
  const loginResponse = await fetch(`${backendUrl}/auth/login`, 
    {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    const data = await loginResponse.json();

    if (loginResponse.status === 401) 
      {
        alert('Invalid Email id and password');
      } else {
        alert('Login success');
        localStorage.setItem('user', JSON.stringify(data));
        handleReset();
        navigate('/');
      }
    };

  if (localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))) 
    {
      return <Navigate to={'/'} replace />;
    }

  return (
    <div
      style={{
        marginLeft: '35rem',
        textAlign: 'center',
        padding: '50px',
        paddingTop: '20px',
        fontStyle:'times'
      }}
    >

    <h2 
      style=
        {{
          color:'maroon'
        }}>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
        Login Page
    </h2>

    <form onSubmit={handleSubmit}>

      <div style={{color:'darkblue',padding:'10px'}}>
          <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Email:</b></label>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>

        <div style={{color:'darkblue',padding:'10px'}}>
          <label><b>Password:</b></label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>

        <div style={{fontSize:'12px'}}>
          <a href='#' onClick={() => navigate('/forget')}  >forget password</a>
        </div>

        <div 
          style=
            {{ 
              display: 'grid', 
              gridTemplateColumns:'repeat(2, 1fr)',
              padding:'20px' 
            }}>
          <button 
              type="submit" 
              style=
                {{
                    backgroundColor:'green', 
                    color:'white'
                  }}>
              Login
          </button>

          <button type="button" 
              onClick={() => navigate('/register')}  
              style=
                {{
                  marginLeft:'20px',
                  backgroundColor:'green', 
                  color:'white'
                }}>
              Sign up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;


