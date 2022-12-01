import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Alert } from '../Components/Alert';
import Navbar from '../Components/Navbar';

function SignupScreen() {

  const[user, setUser] = useState({
    email: '',
    password:'',
  });
  const [error, setError] = useState();
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = ({target: {name,value}}) => {
    setUser({...user, [name]: value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signup(user.email, user.password);
      navigate('/profile');
    } catch(error) {
      //console.log(error.code);
      //if(error.code === 'auth/internal-error') { setError('Correo inválido')};
      setError(error.message);
    }
  };

  return (
    <div className='Wrapper mt-5 pt-5'>
      <Navbar/>
      <div className='Container mt-5 pt-5'>
        <div className='d-flex flex-column justify-content-center align-items-center mt-5 pt-2'>
          {error && <Alert message={error}/>}
          <h1 className='fw-bold display-4 text-secondary mb-5'>Signup</h1>
          <form className='d-flex flex-column w-25' onSubmit={handleSubmit}>
            <label className='pb-2 h5 text-muted fw-normal' htmlFor='email'>Email</label>
            <input className='pb-2 mb-3 form-control' type='email' name='email' placeholder='youremail@email.com' onChange={handleChange}/>
            <label className='pb-2 h5 text-muted fw-normal' htmlFor='password'>Password</label>
            <input  className='pb-2 mb-5 form-control' type='password' name='password' id='password' placeholder='******' onChange={handleChange}/>
            <div className='d-flex justify-content-center align-items-center mb-5'>
              <button class='btn btn-primary fw-bolder px-4 py-2'>Register</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignupScreen;