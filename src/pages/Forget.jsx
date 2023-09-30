/* eslint-disable react/no-unknown-property */
/* eslint-disable react/jsx-no-undef */
import { useState } from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { backendUrl } from '../config';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // eslint-disable-next-line no-unused-vars
    const userData = {
      email,
    };

    // Send a request to your server to initiate the password reset process
    const forgetResponse = await fetch(`${backendUrl}/auth/forget`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (forgetResponse.ok) {
      setMessage('Password reset instructions sent to your email.');
  
      navigate('/verify'); 
    } else {
      await forgetResponse.json();
      alert('Password reset instructions sent to your email')
      setMessage(message || 'Something went wrong.'); 
    }
  };

  // Check if localStorage value is 'true' (you need to parse it as a boolean)
  if (localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))) {
    navigate('/', { replace: true });
    return null;
  }
  return (
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div>
          <button type="submit" onClick={()=>navigate('/verify')}>Submit</button>
        </div>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default ForgotPassword;