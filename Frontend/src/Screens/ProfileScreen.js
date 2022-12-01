import React, { useState } from 'react';
import '../Screens/ContainerStyles.css';
import Navbar from '../Components/Navbar';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Alert } from '../Components/Alert';
import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

function PofileScreen() {

  const[update, setUpdate] = useState({
    name: '',
    client: '',
  });

  const [error, setError] = useState();
  const [imageUpload, setImageUpload] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = ({target: {name,value}}) => {
    setUpdate({...update, [name]: value});
  };

  const handleChangeImage =  async (e) => {
    setImageUpload(e.target.files[0]);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if(update.name === '' || update.client === '') {
        return
      }
      //Procesamos la imagen
      if(imageUpload == null) return; 
      const imageRef = ref(storage, `userPhotos/${imageUpload.name + Math.floor(Math.random() * 100000000)}`);
      await uploadBytes(imageRef, imageUpload);
      const url = await getDownloadURL(imageRef);
      console.log(url);
      //Lo guardamos en firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: update.name,
        image: url,
        client: update.client,
      });
      //Buscamos al usuario con su uid y a partir de su client lo dirigimos a la nueva pestaña
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if(docSnap.data().client === '1') {
        const data = {
          //Guardamos el objeto predeterminado del model
          bertPreentrenamientoPred: true,
          bertPreentrenamientoVal: '',
          sentimentalPreentrenamientoPred: true,
          sentimentalPreentrenamientoVal: '',
          clasificador: true,
          bertPred: true,
          bertVal: 50,
          w2vPred: true,
          pcaPred: true,
          pcaVal: 200,
          noSupervisadoPred: true,
          noSupervisadoOpcion: true,
          noSupervisadoVal: 25,
          s2tPred: true,
          s2tVal: '',
          /********************************************** */
          fileManualName: '',
          fileManualUrl: '',
          fileAutomaticoName: '',
          fileAutomaticoUrl: '',
          llamadasRealizadas: 0,
          llamadasExitosas: 0,
          transcripts: [],
          /********************************************** */
        };
        updateDoc(docRef, data);
        navigate('/profile/model');
      } else if(docSnap.data().client === '2') {
        navigate('/profile/client');
      } else {
        setError('Vuelve a hacer un update');
        navigate('/profile');
      }
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
          <h1 className='fw-bold display-4 text-secondary mb-5'>Update profile</h1>
          <form className='d-flex flex-column w-25' onSubmit={handleSubmit}>
            <label className='pb-2 h5 text-muted fw-normal' htmlFor='name'>Nombre</label>
            <input className='pb-2 mb-3 form-control' type='text' name='name' placeholder='Name Lastname / Compay name' onChange={handleChange}/>
            <label htmlFor='image' className='pb-2 h5 text-muted fw-normal' >Imagen</label>
            <input className='form-control pb-2 mb-3 text-muted' type='file' name='image' onChange={handleChangeImage}/>
            <label className='pb-2 h5 text-muted fw-normal' htmlFor='client'>Usuario</label>
            <div className='d-flex flex-row justify-content-around pb-2 mb-5 text-muted'>
              <div className='form-check'>
                <input className='form-check-input' type='radio' name='client' value='1' onChange={handleChange}/>
                <label className='form-check-label' htmlFor='client'>
                  Empresa
                </label>
              </div>
              <div className='form-check'>
                <input className='form-check-input' type='radio' name='client' value='2' onChange={handleChange}/>
                <label className='form-check-label' htmlFor='client'>
                  Cliente
                </label>
              </div>
            </div>
            <div className='d-flex justify-content-center align-items-center mb-5'>
              <button className='btn btn-primary fw-bolder px-4 py-2'>Update</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PofileScreen;