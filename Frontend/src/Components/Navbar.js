import React from 'react';
import logo from '../logo.svg';

function Navbar() {
  
  return (
    <nav className='navbar navbar-expand-sm bg-light navbar-light fixed-top  justify-content-center'>
      <div className='container-md'>
        <a className='navbar-brand' href='/'>
          <img src={logo} width='90' alt='NDSLogo'/>
        </a>
        <div className='collapse navbar-collapse' id='mynavbar'>
          <ul className='navbar-nav me-auto'>
            <li className='nav-item'>
              <a className='nav-link' href='/'>Home</a>
            </li>
            <li className='nav-item'>
              <a className='nav-link' href='/login'>Profile</a>
            </li>
          </ul>
          <div className='d-flex'>
            <div className='collapse navbar-collapse' id='mynavbar'>
              <ul className='navbar-nav me-auto'>
                <li className='nav-item'>
                  <a className='nav-link' href='/login'>Login</a>
                </li>
              </ul>
            </div>
            <button className='btn btn-primary' type='button'><a className='nav-link' href='/signup'>Sign up</a></button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;