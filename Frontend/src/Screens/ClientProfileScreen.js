import React, { useState } from 'react';
import '../Screens/ContainerStyles.css';
import Navbar from '../Components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { db } from '../firebase';
import { collection, query, getDocs, where, doc, getDoc } from '../../node_modules/firebase/firestore';

function ClientProfileScreen() {

  const {logout, user } = useAuth();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const[userName, setUserName] = useState('');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch(error) {
      console.log(error);
    }
  }

  const before = async () => {
    var comp = [];
    const docRef = query(collection(db, 'users'), where('client', '==', '1'));
    const docSnap = await getDocs(docRef);
    docSnap.forEach((doc) => {
      comp.push(doc.data());
    })
    setCompanies(comp);
    const dR = doc(db, 'users', user.uid);
    const dS = await getDoc(dR);
    await setUserName(dS.data().name);
  }

  const handleCall = () => {

  }

  const handleMessage = () => {
    navigate('/message');
  }

  return (
    <div className='Wrapper mt-5 pt-5 pb-5' onLoad={before}>
      <Navbar/>
      <div className='Container'>
        <h1 className='fw-bold display-4 text-secondary'>{userName}</h1>
        <p className='mb-0 text-muted'>Da clic en la opción que desees para recibir atención por parte del sistema conversacional.</p>
        <div className='d-flex flex-wrap mt-5 pt-5 justify-content-around'>
        {companies.map((c)=>(
          <div className='card border border-warning border-3 py-3 px-3 mb-2' style={{width: '20rem', height: '18rem'}}>
            <div className='d-flex flex-column justify-content-center align-items-center'>
              <img src={c.image} className='card-img-top' style={{height: '10rem'}}alt='companyLogo'/>
              <div className='card-body text-center'>
                <h5 className='card-title'>{c.name}</h5>
                <div className='d-flex flex-row justify-content-around w-100'>
                  <button type='button' class='btn btn-primary fw-bolder px-4 py-2' onClick={handleCall} >Llamar</button>
                  <div className='m-1'></div>
                  <button type='button' class='btn btn-primary fw-bolder px-4 py-2' onClick={handleMessage} >Mensaje</button>
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>
        <div className='d-flex flex-row pt-3'>
          <button onClick={handleLogout} className='btn btn-primary fw-bolder px-4 py-2'>Logout</button>
        </div>
      </div>
    </div>
  )
}

export default ClientProfileScreen;