import { useAuth } from '../Context/AuthContext';
import { Navigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import './ProtectedRouteStyles.css';

export function ProtectedRoute({children}){
  const { user, loading } = useAuth();

  if(loading){
    return(
      <div className='Wrapper mt-5 pt-5'>
        <Navbar/>
        <div className='Container mt-5 pt-5'>
          <div className='d-flex flex-column justify-content-center align-items-center mt-5 pt-2'>
            <h1 className='fw-bold display-4 text-secondary mb-5'>Loading</h1>
            <div className='Loading'>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if(!user){
    return <Navigate to='/login' />;
  }

  return <>{children}</>
}