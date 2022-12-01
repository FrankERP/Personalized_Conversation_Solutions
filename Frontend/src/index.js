import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';
import './custom.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Screens/HomeScreen';
import Login from './Screens/LoginScreen';
import ModelProfile from './Screens/ModelProfileScreen';
import Signup from './Screens/SignupScreen';
import Profile from './Screens/ProfileScreen';
import ClientProfile from './Screens/ClientProfileScreen';
import { AuthProvider } from './Context/AuthContext';
import { ProtectedRoute } from './Screens/ProtectedRoute';
import Message from './Screens/MessageScreen';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/profile/model' element = {
            <ProtectedRoute>
              <ModelProfile/>
            </ProtectedRoute>
          }/>
          <Route path='/profile' element = {
            <ProtectedRoute>
              <Profile/>
            </ProtectedRoute>
          }/>
          <Route path='/profile/client' element = {
            <ProtectedRoute>
              <ClientProfile/>
            </ProtectedRoute>
          }/>
          <Route path='/' element={<Home/>} />
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/message' element={<Message/>}/>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
