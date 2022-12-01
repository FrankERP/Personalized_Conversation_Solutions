import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
import { useNavigate } from 'react-router-dom';

function Message() {

  const navigate = useNavigate();
  
  const[userResponse, setUserResponse] = useState('');
  const[nlpResponse, setNlpResponse] = useState('Bienvenid@ a nuestro sistema de asistente virtual. En esta conversación se van a recopilar todos los datos para mejorar el servicio. Ingrese el tema o la pregunta que desee solucionar.');
  const[inputValue, setInputValue] = useState('');
  const[userInput, setUserInput] = useState('');

  const handleReturn = () => {
    navigate('/');
  }

  const handleSubmit = () => {
    //Aquí modificamos los hooks de la respuesta del NLP y la pregunta del usuario y se borra el input
    setUserResponse(userInput);
  }

  return (
    <div className='Wrapper mt-5 pt-5 pb-5'>
      <Navbar/>
      <div className='Container'>
        <h1 className='fw-bold display-4 text-secondary'>Atención por mensaje</h1>
        <p className='mb-0 text-muted'>Ingrese en el apartado bla bla.</p>
        <div className='d-flex flex-wrap mt-5 pt-5 justify-content-around'>
          <div className='card border border-warning border-3 py-3 mb-2' style={{width: '40rem'}}>
            <form onSubmit={handleSubmit}>
              <div className='card-body'>
                <div className='w-80 text-justify mb-2'>
                  <h5 className='card-title text-secondary'>{nlpResponse}</h5>
                </div>
                <div className='w-80 text-justify mb-2'>
                  <h5 className='card-title text-muted'>{userResponse}</h5>
                </div>
                <input type='text' className='form-control mb-5' placeholder='¿Tu pregunta?' onChange={e => setUserInput(e.target.value)}/>
                <div className='d-flex flex-row justify-content-center align-items-center'>
                  <button type='submit' class='btn btn-primary fw-bolder px-4 py-2'>Submit</button>
                  <div className='m-1'></div>
                  <button type='button' class='btn btn-primary fw-bolder px-4 py-2' onClick={handleReturn} >Terminar atención y regresar</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Message;