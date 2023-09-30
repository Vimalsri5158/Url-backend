/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { backendUrl } from '../config';
import { Navigate } from 'react-router-dom';


const Register = () => {
  const [firstName, setFirstName] = useState(''); 
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleReset = () => { 
    setEmail('');
    setFirstName('');
    setLastName(''); 
    setPassword('');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
      firstName,
      lastName, 
    };

    await fetch(`${backendUrl}/auth/register`, 
    {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    handleReset();
  };

  if (localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))) 
  {
    return <Navigate to={'/'} replace={true} />;
  }


  return (
    <div style={{
      marginLeft:'15rem',
      marginTop:'-50px',
      textAlign:'center'
    }}>
      <h2 style=
      {{
        marginLeft:'20rem', 
        color:'maroon'
      }}>
      Sign up
      </h2>

      <form onSubmit={handleSubmit} 
      style={{marginLeft:'20rem'}}
      >

        
        <div style={{ color: 'darkblue', padding: '10px' }}>
          <label><b>First Name:</b></label>
          <input
            type="text"
            placeholder="Enter your First Name"
            value={firstName}
            onChange={handleFirstNameChange}
            required
          />
        </div>

        <div style={{ color: 'darkblue', padding: '10px' }}>
          <label><b>Last Name:</b></label>
          <input
            type="text"
            placeholder="Enter your Last Name"
            value={lastName}
            onChange={handleLastNameChange}
            required
          />
        </div>

        <div style={{color:'darkblue',padding:'10px'}}>
          <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;<b>Email:</b></label>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>

        <div style=
        {{
          color:'darkblue',
          padding:'10px',
          marginLeft:'-25px'
        }}>
          <label><b>&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;Password:</b></label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>

        <div style={{margin:'20px'}}>
          <button type="submit" 
              style=
              {{
                backgroundColor:'green', 
                color:'white'
              }}>
              <b>Sign in</b>
          </button>
        </div>
        </form>
    </div>
  );
};

export default Register;