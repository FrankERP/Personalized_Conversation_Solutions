import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Alert } from '../Components/Alert';
import Navbar from '../Components/Navbar';
import { db } from '../firebase';
import { doc, getDoc } from '../../node_modules/firebase/firestore';

function LoginScreen() {

  const[userL, setUserL] = useState({
    email: '',
    password:'',
  });

  const [error, setError] = useState();
  const { login, loginWithGoogle, user, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleChange = ({target: {name,value}}) => {
    setUserL({...userL, [name]: value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(userL.email, userL.password);
      //Buscamos al usuario con su uid y a partir de su client lo dirigimos a la nueva pestaña
      if(user != null) {
        const docRef = await doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if(docSnap.data().client === '1') {
          navigate('/profile/model');
        } else if(docSnap.data().client === '2') {
          navigate('/profile/client');
        } else {
          navigate('/login');
        }
      }
    } catch(error) {
      //console.log(error.code);
      //if(error.code === 'auth/internal-error') { setError('Correo inválido')};
      console.log('se tiene un error');
      setError(error.message);
    }
  };

  const handleGoogleSignin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await loginWithGoogle();
      if(user != null) {
        const docRef = await doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if(docSnap.data().client === '1') {
          navigate('/profile/model');
        } else if(docSnap.data().client === '2') {
          navigate('/profile/client');
        } else {
          navigate('/login');
        }
      }
    } catch(error) {
      setError(error.message);
    }
  }

  const handleResetPassword = async () => {
    if(!userL.email) return setError('Please enter your email.');
    try {
      await resetPassword(userL.email);
      setError('We sent an email with a link to reset your password.');
    } catch(error) {
      setError(error.message);
    }
  }

  return (
    <div className='Wrapper mt-5 pt-5'>
      <Navbar/>
      <div className='Container mt-5 pt-5'>
        <div className='d-flex flex-column justify-content-center align-items-center mt-5 pt-2'>
          {error && <Alert message={error}/>}
          <h1 className='fw-bold display-4 text-secondary mb-5'>Login</h1>
          <form className='d-flex flex-column w-25' onSubmit={handleSubmit}>
            <label className='pb-2 h5 text-muted fw-normal' htmlFor='email'>Email</label>
            <input className='pb-2 mb-3 form-control' type='email' name='email' placeholder='youremail@email.com' onChange={handleChange}/>
            <label className='pb-2 h5 text-muted fw-normal'>Password</label>
            <input className='pb-2 mb-5 form-control' type='password' name='password' placeholder='******' onChange={handleChange}/>
            <div className='d-flex justify-content-center align-items-center mb-3'>
              <button class='btn btn-primary fw-bolder px-4 py-2'>Login</button>
            </div>
            <a className='text-info text-center mb-3' onClick={handleResetPassword} href='#'>Forgot password?</a>
            <button class='btn btn-primary fw-bolder px-4 py-2' onClick={handleGoogleSignin}>Login with google</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginScreen;