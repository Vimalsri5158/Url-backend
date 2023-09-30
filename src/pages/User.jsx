/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-extra-semi */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { backendUrl } from '../config';
import { Pie } from 'react-chartjs-2';
import {Chart,Tooltip, Legend,  ArcElement } from 'chart.js';
Chart.register( ArcElement,Tooltip, Legend);

const data = {
  datasets: [
    {
      data: [10, 20, 30],
      backgroundColor: ['red', 'yellow', 'green'], 
    },
  ],
  labels: ['Red', 'Yellow', 'Green'],
};


const UserDialog = ({ handleDialog, fetchUsers }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'male',
  });

  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

     {/*User data auth-token post req section*/}
    const { accessToken } = JSON.parse(localStorage.getItem('user'));
    try {
      const response = await fetch(`${backendUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': accessToken,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await response.json();
        await fetchUsers();
        handleDialog();
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (error) {
      console.error('Error submitting user data:', error);
      setError('An error occurred while submitting the form.');
    }
  };

  return (
    <div className="dialog">

      <div className="dialog-root">

        <form
          onSubmit={handleSubmit}
            style={{
              marginLeft: "20px",
              marginTop: "30px",
              color: "white",
              fontSize: "14px",
            }}
        >

          <label htmlFor="name">
            <b>Name:</b>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <br />

          <label htmlFor="age" 
          style={{ 
            marginLeft: '20px' 
          }}>
            <b>Age:</b>
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            required
          />
          <br />

          <label style={{ marginLeft: '-100px' }}>
            <b>Gender:</b>
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <br />

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button
            type="submit"
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "10px",
            }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};


const User=()=> {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [users, setUsers] = useState([]);
  const [userRole, setRole] = useState('normal');
  const [data, setData] = useState({
    datasets: [
      {
        data: [10, 20, 30],
        backgroundColor: ['red', 'yellow', 'green'],
      },
    ],
    labels: ['Red', 'Yellow', 'Green'],
  });

  
  const handleDialog = () => {
    setShowDialog(!showDialog);
  };

  // Access token fetch user get req method
  const { accessToken } = JSON.parse(localStorage.getItem('user'));

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${backendUrl}/users`, {
        headers: {
          'auth-token': accessToken,
        },
      });
  
      if (response.status === 401) {
        console.error('Unauthorized access. Please log in again.');
        localStorage.removeItem('user');
        navigate('/login'); 
      } else if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Failed to fetch user data. Server responded with:', response.status);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  {/*User data delete section*/}
  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`${backendUrl}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'auth-token': accessToken,
        },
      });
      if (response.ok) {
        await response.json();
        setUsers(users.filter((user) => user.id !== userId));
      } else {
        console.error('Failed to delete user. Server responded with:', response.status);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }


  useEffect(() => {
    fetchUsers();
    const { accessToken } = JSON.parse(localStorage.getItem('user'));
    const { role } = jwtDecode(accessToken);
    setRole(role);

     {/*User data fetch with chart section*/}
    const fetchData = async () => {
      const { accessToken } = JSON.parse(localStorage.getItem('user'));
      try {
        const response = await fetch(`${backendUrl}/users`, {
          headers: {
            'auth-token': accessToken,
          },
        });
        
        if (response.ok) {
          const userData = await response.json();
          const labels = [];
          const dataValues = [];

          userData.forEach((user) => {
            labels.push(user.gender);
            dataValues.push(user.id);
          });

          setData({
            datasets: [
              {
                data: dataValues,
                backgroundColor: ['red', 'yellow', 'green'],
              },
            ],
            labels: labels,
          });
        } else {
          console.error('Failed to fetch user data. Server responded with:', response.status);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchData();
  }, [accessToken]);


  return (
    <>

    {/*User Header section*/}
      <div className="user-header">
        <h2 className="font">LIST OF USERS</h2>
        <div className='buttons'>
          {userRole === 'admin' && (
            <button onClick={handleDialog} className="btn btn-danger"
            style={{marginLeft:'20rem'}}
            >
              Add New User
            </button>
          )}
            <button
              className="btn btn-danger"
              onClick={() => {
                localStorage.removeItem('user');
                navigate('/login');
              }}
              style={{marginLeft:'40rem'}}
            >
              Logout
            </button>
        </div>
      </div>


 <div style={{display:'flex',marginLeft:'10rem'}}>

      {/*Chart User data section*/}
      <div className="chart" style={{width:'30%', height:'30%',padding:'20px'}}>
      <h3>Welcome to PieChart</h3>
      <Pie data={data} />
    </div>


 {/*User Data table section*/}
      <div className="user-table">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            {userRole === 'admin' && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.age}</td>
              <td>{user.gender}</td>
              {userRole === 'admin' && (
                <td>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>


  </div>

      {/* Userdialog */}
      {showDialog && 
        <UserDialog 
          handleDialog={handleDialog} 
          fetchUsers={fetchUsers} 
        />
      }
    </>
  );
};
export default User;