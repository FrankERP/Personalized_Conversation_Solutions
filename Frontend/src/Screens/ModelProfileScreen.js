import React, {useState} from 'react';
import '../Screens/ContainerStyles.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import Navbar from '../Components/Navbar';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from '../../node_modules/firebase/firestore';
import { Alert } from '../Components/Alert';
import { storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

function Profile() {

  const {user, logout } = useAuth();
  const navigate = useNavigate();

  const[userName, setUserName] = useState('');
  const[error, setError] = useState();

  const[bertPreentrenamientoPred, setBertPreentrenamientoPred] = useState();
  const[bertPreentrenamientoVal, setBertPreentrenamientoVal] = useState(''); //Para el txt
  const[sentimentalPreentrenamientoPred, setSentimentalPreentrenamientoPred] = useState();
  const[sentimentalPreentrenamientoVal, setSentimentalPreentrenamientoVal] = useState(''); //Para el txt
  const[clasificador, setClasificador] = useState();
  /********************************************** */
  const[llamadasRealizadas, setLlamadasRealizadas] = useState(0);
  const[llamadasExitosas, setLlamadasExitosas] = useState(0);
  const[transcripts, setTranscripts] = useState();
  /********************************************** */

  const[bertAutomaticoPred, setBertAutomaticoPred] = useState();
  const[bertAutomaticoVal, setBertAutomaticoVal] = useState(50); //Para el txt automatico
  const[w2vAutomaticoPred, setW2vAutomaticoPred] = useState(); //Para el txt automatico
  const[pcaAutomaticoPred, setPcaAutomaticoPred] = useState();
  const[pcaAutomaticoVal, setPcaAutomaticoVal] = useState(200); //Para el txt automatico
  const[noSupervisadoAutomaticoPred, setNoSupervisadoAutomaticoPred] = useState();
  const[noSupervisadoAutomaticoOpcion, setNoSupervisadoAutomaticoOpcion] = useState();// Para el txt automático (true spectral false k-means)
  const[noSupervisadoAutomaticoVal, setNoSupervisadoAutomaticoVal] = useState(25); //Para el txt automatico
  const[s2tAutomaticoPred, setS2tAutomaticoPred] = useState();
  const[s2tAutomaticoVal, setS2tAutomaticoVal] = useState(''); //Para el txt automático
  /********************************************** */
  const[fileAutomaticoName, setFileAutomaticoName] = useState('');
  const[fileAutomaticoUrl, setFileAutomaticoUrl] = useState(''); //Para el txt automático
  /********************************************** */

  const[bertManualPred, setBertManualPred] = useState();
  const[bertManualVal, setBertManualVal] = useState(50); //Para el txt manual
  const[w2vManualPred, setW2vManualPred] = useState(); //Para el txt manual
  const[pcaManualPred, setPcaManualPred] = useState();
  const[pcaManualVal, setPcaManualVal] = useState(200); //Para el txt manual
  const[s2tManualPred, setS2tManualPred] = useState();
  const[s2tManualVal, setS2tManualVal] = useState(''); //Para el txt manual
  /********************************************** */
  const[fileManualName, setFileManualName] = useState('');
  const[fileManualUrl, setFileManualUrl] = useState(''); //Para el txt manual
  /********************************************** */


  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch(error) {
      console.log(error);
    }
  }

  /********************************************** */
  const[fileUpload, setFileUpload] = useState();
  const handleChangeFile =  async (e) => {
    setFileUpload(e.target.files[0]);
  }
  /********************************************** */
  const before = async () => {
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);
    setUserName(docSnap.data().name);
    //Antes de la clasificación hacemos set de todos los valores pasados
    setBertPreentrenamientoPred(docSnap.data().bertPreentrenamientoPred);
    setBertPreentrenamientoVal(docSnap.data().bertPreentrenamientoVal);
    setSentimentalPreentrenamientoPred(docSnap.data().sentimentalPreentrenamientoPred);
    setSentimentalPreentrenamientoVal(docSnap.data().sentimentalPreentrenamientoVal);
    setClasificador(docSnap.data().clasificador);
    /********************************************** */
    setLlamadasRealizadas(docSnap.data().llamadasRealizadas);
    setLlamadasExitosas(docSnap.data().llamadasRealizadas);
    setTranscripts(docSnap.data().transcripts);
    /********************************************** */
    //Revisamos la clasificación y cambiamos todos los valores dependiendo del caso 
    if(docSnap.data().clasificador) {
      //Variables automáticas
      setBertAutomaticoPred(docSnap.data().bertPred);
      setBertManualPred(true);
      setBertAutomaticoVal(docSnap.data().bertVal);
      setW2vAutomaticoPred(docSnap.data().w2vPred);
      setW2vManualPred(true);
      setPcaAutomaticoPred(docSnap.data().pcaPred);
      setPcaManualPred(true);
      setPcaAutomaticoVal(docSnap.data().pcaVal);
      setNoSupervisadoAutomaticoPred(docSnap.data().noSupervisadoPred);
      setNoSupervisadoAutomaticoOpcion(docSnap.data().noSupervisadoOpcion);
      setNoSupervisadoAutomaticoVal(docSnap.data().noSupervisadoVal);
      setS2tAutomaticoPred(docSnap.data().s2tPred);
      setS2tManualPred(true);
      setS2tAutomaticoVal(docSnap.data().s2tVal);
      /********************************************** */
      setFileAutomaticoName(docSnap.data().fileAutomaticoName);
      setFileAutomaticoUrl(docSnap.data().fileAutomaticoUrl);
      /********************************************** */
    } else {
      //Variables manuales
      setBertManualPred(docSnap.data().bertPred);
      setBertAutomaticoPred(true);
      setBertManualVal(docSnap.data().bertVal);
      setW2vManualPred(docSnap.data().w2vPred);
      setW2vAutomaticoPred(true);
      setPcaManualPred(docSnap.data().pcaPred);
      setPcaAutomaticoPred(true);
      setNoSupervisadoAutomaticoPred(true);
      setNoSupervisadoAutomaticoOpcion(true);
      setPcaManualVal(docSnap.data().pcaVal);
      setS2tManualPred(docSnap.data().s2tPred);
      setS2tAutomaticoPred(true);
      setS2tManualVal(docSnap.data().s2tVal);
      /********************************************** */
      setFileManualName(docSnap.data().fileManualName);
      setFileManualUrl(docSnap.data().fileManualUrl);
      /********************************************** */
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      /********************************************** */
      var url = '';
      var urlName = '';
      //Revisamos si hay un documento que se suba con la función
      if(fileUpload !== undefined) {
        const fileRef = ref(storage, `userFiles/${fileUpload.name + Math.floor(Math.random() * 100000000)}`);
        await uploadBytes(fileRef, fileUpload);
        url = await getDownloadURL(fileRef);
        urlName = fileUpload.name;
      }
      /********************************************** */
      //Buscamos al usuario con su uid y a partir de su client lo dirigimos a la nueva pestaña
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if(docSnap.data().clasificador) {
        const data = {
          //Guardamos el objeto predeterminado del model automático
          bertPreentrenamientoPred: bertPreentrenamientoPred,
          bertPreentrenamientoVal: bertPreentrenamientoVal,
          sentimentalPreentrenamientoPred: sentimentalPreentrenamientoPred,
          sentimentalPreentrenamientoVal: sentimentalPreentrenamientoVal,
          clasificador: clasificador,
          bertPred: bertAutomaticoPred,
          bertVal: bertAutomaticoVal,
          w2vPred: w2vAutomaticoPred,
          pcaPred: pcaAutomaticoPred,
          pcaVal: pcaAutomaticoVal,
          noSupervisadoPred: noSupervisadoAutomaticoPred,
          noSupervisadoOpcion: noSupervisadoAutomaticoOpcion,
          noSupervisadoVal: noSupervisadoAutomaticoVal,
          s2tPred: s2tAutomaticoPred,
          s2tVal: s2tAutomaticoVal,
          /********************************************** */
          fileAutomaticoName: urlName,
          fileAutomaticoUrl: url,
          /********************************************** */
        };
        updateDoc(docRef, data);
        /********************************************** */
        //Lo convierto en un txt y obtengo un URL que se manda al flaskfile
        //const urlTtx = await saveStaticDataToFile(data);
        /********************************************** */
      }else {
        const data = {
          //Guardamos el objeto predeterminado del model automático
          bertPreentrenamientoPred: bertPreentrenamientoPred,
          bertPreentrenamientoVal: bertPreentrenamientoVal,
          sentimentalPreentrenamientoPred: sentimentalPreentrenamientoPred,
          sentimentalPreentrenamientoVal: sentimentalPreentrenamientoVal,
          clasificador: clasificador,
          bertPred: bertManualPred,
          bertVal: bertManualVal,
          w2vPred: w2vManualPred,
          pcaPred: pcaManualPred,
          pcaVal: pcaManualVal,
          noSupervisadoPred: true,
          noSupervisadoOpcion: true,
          noSupervisadoVal: 25,
          s2tPred: s2tManualPred,
          s2tVal: s2tManualVal,
          /********************************************** */
          fileManualName: urlName,
          fileManualUrl: url,
          /********************************************** */
        };
        updateDoc(docRef, data);
        /********************************************** */
        //Lo convierto en un txt y obtengo un URL que se manda al flaskfile
        //const urlTtx = await saveStaticDataToFile(data);
        /********************************************** */
      }
    } catch(error) {
      setError(error.message);
    }
  };

	return (
    <div className='Wrapper mt-5 pt-5 pb-5' onLoad={before}>
      <Navbar/>
      <div className='Container'>
        <h1 className='fw-bold display-4 text-secondary'>{userName}</h1>
        <form onSubmit={handleSubmit}>
          <h4 className='fw-bolder pt-5 text-secondary'>1. Personalice su modelo de conversación</h4>
          <p className='mb-0 text-muted'>En este apatado encontrará los diversos elementos que se pueden modificar con información proveniente de su empresa para que la solución conversacional se adapte de acuerdo a sus necesidades.</p>
          <h5 className='pt-4 fw-bold text-secondary'>1.1 Pre-entrenamiento</h5>
          <p className='mb-0 text-muted' >Personalized Conversation Solutions genera un pre-entrenamiento haciendo uso de <b><i>dos modelos</i></b>, seleccione nuestros predeterminados si se adapta a sus necesidades o agregue enlaces personalizados.</p>
          <h6 className='pt-3 text-secondary fw-bold'><i>1.1.1 BERT</i></h6>
          <p className='mb-0 text-muted'>Este <b><a href='https://bit.ly/3tjUs7q' target='_blank' rel='noreferrer'>modelo</a></b> se entrenó sobre una base de datos de <b><i>preguntas y respuestas</i></b> que se tradujeron automáticamente a <b><i>español</i></b> ya que la solución espera operar en este <b><i>idioma</i></b>, se utiliza para realizar la <b><i>búsqueda</i></b> de la respuesta correcta con la pregunta que realice el usuario.</p>
          <div className='form-check form-switch mt-1'>
            <input className='form-check-input' type='checkbox' onClick={()=>setBertPreentrenamientoPred(!bertPreentrenamientoPred)} value={bertPreentrenamientoPred} defaultChecked={bertPreentrenamientoPred}/>
            {bertPreentrenamientoPred ? <label className='form-check-label text-muted'>Predeterminado</label> : <label className='form-check-label text-muted'>Personalizado</label>}
          </div>
          {bertPreentrenamientoPred ? <p className='mx-0 my-0'></p> : <input type='text' class='form-control' value={bertPreentrenamientoVal} placeholder='https://mimodelo.com' onChange={e => setBertPreentrenamientoVal(e.target.value)}/>}
          <h6 className='pt-3 text-secondary fw-bold'><i>1.1.2 Sentimental analysis</i></h6>
          <p className='mb-0 text-muted'>Este <b><a href='http://bit.ly/3TVuXEp' target='_blank' rel='noreferrer'>modelo</a></b> se entrenó con alrededor de <b><i>5mil tweets</i></b> de varios dialectos en <b><i>español</i></b>, se utiliza para revisar la <b><i>crítica del usuario</i></b> durante la llamada.</p>
          <div className='form-check form-switch mt-1'>
            <input className='form-check-input' type='checkbox' onClick={()=>setSentimentalPreentrenamientoPred(!sentimentalPreentrenamientoPred)} value={sentimentalPreentrenamientoPred} defaultChecked={sentimentalPreentrenamientoPred}/>
            {sentimentalPreentrenamientoPred ? <label className='form-check-label text-muted'>Predeterminado</label> : <label className='form-check-label text-muted'>Personalizado</label>}
          </div>
          {sentimentalPreentrenamientoPred ? <p className='mx-0 my-0'></p> : <input type='text' class='form-control' placeholder='https://mimodelo.com' onChange={e => setSentimentalPreentrenamientoVal(e.target.value)} value={sentimentalPreentrenamientoVal}/>}
          <h5 className='pt-4 fw-bold text-secondary'>1.2 Clasificador</h5>
          <p className='mb-1 text-muted'>La solución conversacional necesita conocer que <b><i>tipo de problemas debe de resolver así como sus respuestas,</i></b> seleccione la opción que más se adapte a su empresa.</p>
          {clasificador ? 
          <div className='d-flex flex-row justify-content-around align-items-center'>
            <div className='btn-group mt-1' role='group'>
              <input type='radio' className='btn-check' name='clasificador' id='clasificador1' autocomplete='off' onClick={()=>setClasificador(true)} defaultChecked/>
              <label className='btn btn-outline-primary' for='clasificador1'>
                <div className='d-flex align-items-center justify-content-center flex-column px-1 py-1 '>
                  <p className='mt-0 mb-0 fw-bold'>Automático</p>
                  <p className='mt-0 mb-0'>Suba un archivo con todas las respuestas y el clasificador las organizará por contextos/temas.</p>
                </div>
              </label>
              <input type='radio' className='btn-check' name='clasificador' id='clasificador2' autocomplete='off' onClick={()=>setClasificador(false)}/>
              <label className='btn btn-outline-primary' for='clasificador2'>
                <div className='d-flex align-items-center justify-content-center flex-column px-1 py-1'>
                  <p className='mt-0 mb-0 fw-bold'>Manual</p>
                  <p className='mt-0 mb-0'>Suba un archivo con dos columnas: la primera para contextos/temas y la segunda para las respuestas esperadas.</p>
                </div>
              </label>
            </div>
          </div>
          :
          <div className='d-flex flex-row justify-content-around align-items-center'>
            <div className='btn-group mt-1' role='group'>
              <input type='radio' className='btn-check' name='clasificador' id='clasificador1' autocomplete='off' onClick={()=>setClasificador(true)}/>
              <label className='btn btn-outline-primary' for='clasificador1'>
                <div className='d-flex align-items-center justify-content-center flex-column px-1 py-1 '>
                  <p className='mt-0 mb-0 fw-bold'>Automático</p>
                  <p className='mt-0 mb-0'>Suba un archivo con todas las respuestas y el clasificador las organizará por contextos/temas.</p>
                </div>
              </label>
              <input type='radio' className='btn-check' name='clasificador' id='clasificador2' autocomplete='off' onClick={()=>setClasificador(false)} defaultChecked/>
              <label className='btn btn-outline-primary' for='clasificador2'>
                <div className='d-flex align-items-center justify-content-center flex-column px-1 py-1'>
                  <p className='mt-0 mb-0 fw-bold'>Manual</p>
                  <p className='mt-0 mb-0'>Suba un archivo con dos columnas: la primera para contextos/temas y la segunda para las respuestas esperadas.</p>
                </div>
              </label>
            </div>
          </div>
          }
          {clasificador ?
          <div className='d-flex flex-column'>
            <h6 className='pt-3 text-secondary fw-bold'><i>1.2.1 Contextos / temas</i></h6>
            <label for='formFile' class='form-label text-muted' >Ingrese un <b><i>archivo de tipo xslx</i></b> con todas las respuestas que satisfagan las preguntas de sus clientes, tomando como referencia la siguiente <b><a href='http://bit.ly/3ii3PCw' target='_blank' rel='noreferrer'>plantilla</a></b>.</label>
            <input className='form-control' type='file' id='formFile' onChange={handleChangeFile}/>
            {fileAutomaticoName !== "" ? <p className='mb-0 text-muted' ><a href={fileAutomaticoUrl} target='_blank' rel='noreferrer'>Current file</a>: {fileAutomaticoName} </p> :  <p className='mx-0 my-0'></p>}
            <h5 className='fw-bold pt-4 text-secondary'>1.3 Variables</h5>
            <p className='mb-0 text-muted' >A continuación se muestran los diversos elementos que se pueden <b><i>modificar</i></b> dentro del modelo para el <b><i>Natural Language Preprocessing.</i></b></p>
            <h6 className='fw-bold pt-3 text-secondary'><i>1.3.1 Bidirectional encoder representation from transformers (BERT)</i></h6>
            <p className='mb-1 text-muted'>Es el <b><i>valor de exactitud</i></b> que se desea aplicar al modelo al momento de realizar la <b><i>búsqueda</i></b> de las <b><i>respuestas</i></b> durante la llamada con el cliente, debe ser un valor entre <b><i>0 y 100</i></b>.</p>
            <div className='form-check form-switch mt-1'>
              <input className='form-check-input' type='checkbox' onClick={()=>setBertAutomaticoPred(!bertAutomaticoPred)} defaultChecked={bertAutomaticoPred} value={bertAutomaticoVal}/>
              {bertAutomaticoPred ? <label  className='form-check-label text-muted'>Predeterminado</label> : <label  className='form-check-label text-muted'>Personalizado</label>}
            </div>
            {bertAutomaticoPred === false ? 
            <div>
              <input type='range' class='form-range' min='0' max='100' step='0.1' value={bertAutomaticoVal} onChange={e => setBertAutomaticoVal(e.target.value)}/>
              <div className='d-flex justify-content-between'>
                <p className='mb-1 text-muted'>0</p>
                <p className='mb-1 text-primary fw-bold'>{bertAutomaticoVal}</p>
                <p className='mb-1 text-muted'>100</p>
              </div>
            </div>
            :
            <p className='mx-0 my-0'></p>
            }
            <h6 className='fw-bold pt-3 text-secondary'><i>1.3.2 Word to vector (W2V)</i></h6>
            <p className='mb-1 text-muted'>Es el proceso que se realiza a partir del <b><i>archivo</i></b> que proporcione su empresa para <b><i>transformar</i></b> las entradas de texto a <b><i>componentes</i></b>, Personalized Conversation Solutions ya contiene un word to vector <b><i>pre-entrenado</i></b> de manera <b><a href='http://bit.ly/3OCtthp' target='_blank' rel='noreferrer'>predeterminada</a></b>, si su archivo cuenta con un corpus inicial de más de <b><i>5000 respuestas/contextos</i></b> deshabilita la opción inicial para que se <b><i>entrene sobre si mismo</i></b>.</p>
            <div className='form-check form-switch mt-1'>
              <input className='form-check-input' type='checkbox' id='modeloSwitchWord' onClick={()=>setW2vAutomaticoPred(!w2vAutomaticoPred)} value={w2vAutomaticoPred} defaultChecked={w2vAutomaticoPred}/>
              {w2vAutomaticoPred ? <label  className='form-check-label text-muted' for='modeloSwitchWord'>Predeterminado</label> : <label  className='form-check-label text-muted' for='modeloSwitchWord'>Entrenamiento personalizado</label>}
            </div>
            <h6 className='fw-bold pt-3 text-secondary'><i>1.3.3 Principal component analysis (PCA)</i></h6>
            <p className='mb-1 text-muted'>Es una <b><i>reducción de componentes</i></b> que surgen del <b><i>W2V</i></b> para que se obtenga lo que se va a <b><i>clasificar</i></b> o las <b><i>variables más relevantes</i></b>, para que funcione correctamente se puede tener <b><i>máximo 400</i></b> componentes.</p>
            <div className='form-check form-switch mt-1'>
              <input className='form-check-input' type='checkbox' onClick={()=>setPcaAutomaticoPred(!pcaAutomaticoPred)} value={pcaAutomaticoPred} defaultChecked={pcaAutomaticoPred}/>
              {pcaAutomaticoPred ? <label  className='form-check-label text-muted'>Predeterminado</label> : <label  className='form-check-label text-muted'>Personalizado</label>}
            </div>
            {pcaAutomaticoPred === false ? 
            <div>
              <input type='range' class='form-range' min='0' max='400' step='1' value={pcaAutomaticoVal} onChange={e => setPcaAutomaticoVal(e.target.value)}/>
              <div className='d-flex justify-content-between'>
                <p className='mb-1 text-muted'>0</p>
                <p className='mb-1 text-primary fw-bold'>{pcaAutomaticoVal}</p>
                <p className='mb-1 text-muted'>400</p>
              </div>
            </div>
            :
            <p className='mx-0 my-0'></p>
            }
            <h6 className='fw-bold pt-3 text-secondary'><i>1.3.4 Modelo no supervisado</i></h6>
            <p className='mb-1 text-muted'>Es la forma en que se van a <b><i>agrupar los datos</i></b> al momento de generar <b><i>clasificaciones</i></b>, seleccione cual <b><i>algoritmo</i></b> desea utilizar para organizar sus respuestas y el <b><i>número</i></b> de <b><i>contextos/temas</i></b> que desea tener.</p>
            <div className='form-check form-switch mt-1'>
              <input className='form-check-input' type='checkbox' onClick={()=>setNoSupervisadoAutomaticoPred(!noSupervisadoAutomaticoPred)} value={noSupervisadoAutomaticoPred} defaultChecked={noSupervisadoAutomaticoPred} />
              {noSupervisadoAutomaticoPred ? <label  className='form-check-label text-muted'>Predeterminado</label> : <label  className='form-check-label text-muted'>Elegir una opción</label>}
            </div>
            {(noSupervisadoAutomaticoPred === false && noSupervisadoAutomaticoOpcion === true) ?
            <div className='d-flex flex-column'>
              <div className='d-flex flex-row justify-content-around align-items-center'>
                <div className='btn-group mt-1' role='group'>
                  <input type='radio' className='btn-check' name='modelonosupervisado' id='spectralclustering' autocomplete='off' onClick={()=>setNoSupervisadoAutomaticoOpcion(true)} defaultChecked/>
                  <label className='btn btn-outline-primary' for='spectralclustering'>
                    <div className='d-flex align-items-center justify-content-center flex-column px-1 py-1 '>
                      <p className='mt-0 mb-0 fw-bold'>Spectral Clustering</p>
                      <p className='mt-0 mb-0'>Las respuestas se tratan como nodos de un gráfico conectado y para dividirlo en el número de contextos/temas proporcionado se generan los cálculos necesarios para minmizar el número de aristas entre los conjuntos y de esta manera ir agrupando de manera recursiva.</p>
                    </div>
                  </label>
                  <input type='radio' className='btn-check' name='modelonosupervisado' id='kmeans' autocomplete='off' onClick={()=>setNoSupervisadoAutomaticoOpcion(false)}/>
                  <label className='btn btn-outline-primary' for='kmeans'>
                    <div className='d-flex align-items-center justify-content-center flex-column px-1 py-1'>
                      <p className='mt-0 mb-0 fw-bold'>K-means</p>
                      <p className='mt-0 mb-0'>Se asignan como centroides de manera aleatoria el número de contextos/temas que fue proporcionado, después se les asignan valores por distancias cortas, luego se desplaza el centroide a la media del grupo actual y se repite el proceso de asignación hasta que los grupos se ajusten.</p>
                    </div>
                  </label>
                </div>
              </div>
              <div className='d-flex flex-column'>
                <input type='range' class='form-range' min='0' max='50' step='1' value={noSupervisadoAutomaticoVal} onChange={e => setNoSupervisadoAutomaticoVal(e.target.value)}/>
                <div className='d-flex justify-content-between'>
                  <p className='mb-1 text-muted'>0</p>
                  <p className='mb-1 text-primary fw-bold'>{noSupervisadoAutomaticoVal}</p>
                  <p className='mb-1 text-muted'>50</p>
                </div>
              </div>
            </div>
            : ((noSupervisadoAutomaticoPred === false && noSupervisadoAutomaticoOpcion === false) ?
            <div className='d-flex flex-column'>
              <div className='d-flex flex-row justify-content-around align-items-center'>
                <div className='btn-group mt-1' role='group'>
                  <input type='radio' className='btn-check' name='modelonosupervisado' id='spectralclustering' autocomplete='off' onClick={()=>setNoSupervisadoAutomaticoOpcion(true)} />
                  <label className='btn btn-outline-primary' for='spectralclustering'>
                    <div className='d-flex align-items-center justify-content-center flex-column px-1 py-1 '>
                      <p className='mt-0 mb-0 fw-bold'>Spectral Clustering</p>
                      <p className='mt-0 mb-0'>Las respuestas se tratan como nodos de un gráfico conectado y para dividirlo en el número de contextos/temas proporcionado se generan los cálculos necesarios para minmizar el número de aristas entre los conjuntos y de esta manera ir agrupando de manera recursiva.</p>
                    </div>
                  </label>
                  <input type='radio' className='btn-check' name='modelonosupervisado' id='kmeans' autocomplete='off' onClick={()=>setNoSupervisadoAutomaticoOpcion(false)} defaultChecked/>
                  <label className='btn btn-outline-primary' for='kmeans'>
                    <div className='d-flex align-items-center justify-content-center flex-column px-1 py-1'>
                      <p className='mt-0 mb-0 fw-bold'>K-means</p>
                      <p className='mt-0 mb-0'>Se asignan como centroides de manera aleatoria el número de contextos/temas que fue proporcionado, después se les asignan valores por distancias cortas, luego se desplaza el centroide a la media del grupo actual y se repite el proceso de asignación hasta que los grupos se ajusten.</p>
                    </div>
                  </label>
                </div>
              </div>
              <div className='d-flex flex-column'>
                <input type='range' class='form-range' min='0' max='50' step='1' value={noSupervisadoAutomaticoVal} onChange={e => setNoSupervisadoAutomaticoVal(e.target.value)}/>
                <div className='d-flex justify-content-between'>
                  <p className='mb-1 text-muted'>0</p>
                  <p className='mb-1 text-primary fw-bold'>{noSupervisadoAutomaticoVal}</p>
                  <p className='mb-1 text-muted'>50</p>
                </div>
              </div>
            </div>
            :
            <p className='mx-0 my-0'></p>
            )
            }
            <h6 className='fw-bold pt-3 text-secondary'><i>1.3.5 Speech to text</i></h6>
            <p className='mb-1 text-muted'>Es el proceso que realiza la solución conversacional para cambiar la <b><i>voz de entrada del cliente </i></b> a <b><i>texto</i></b> para que se pueda generar la <b><i>comunicación</i></b>, si su empresa cuenta con una <b><i>API de su preferencia</i></b> ingrese un enlace personalizado.</p>
            <div className='form-check form-switch mt-1'>
              <input className='form-check-input' type='checkbox' onClick={()=>setS2tAutomaticoPred(!s2tAutomaticoPred)} value={s2tAutomaticoPred} defaultChecked={s2tAutomaticoPred}/>
              {s2tAutomaticoPred ? <label className='form-check-label text-muted'>Predeterminado</label> : <label className='form-check-label text-muted'>Personalizado</label>}
            </div>
            {s2tAutomaticoPred ? <p className='mx-0 my-0'></p> : <input type='text' class='form-control' placeholder='https://miAPI.com' onChange={e => setS2tAutomaticoVal(e.target.value)} value={s2tAutomaticoVal} />}
          </div>
          :
          <div className='d-flex flex-column'>
            <h6 className='pt-3 text-secondary fw-bold'><i>1.2.1 Contextos / temas</i></h6>
            <label for='formFile' class='form-label text-muted' >Ingrese un <b><i>archivo de tipo xslx</i></b> con todas las respuestas que satisfagan las preguntas de sus clientes, tomando como referencia la siguiente <b><a href='http://bit.ly/3gInEm1' target='_blank' rel='noreferrer'>plantilla</a></b>.</label>
            <input className='form-control' type='file' id='formFile' onChange={handleChangeFile} />
            {fileManualName !== "" ? <p className='mb-0 text-muted' ><a href={fileManualUrl} target='_blank' rel='noreferrer'>Current file</a>: {fileManualName}</p> :  <p className='mx-0 my-0'></p>}
            <h5 className='fw-bold pt-4 text-secondary'>1.3 Variables</h5>
            <p className='mb-0 text-muted' >A continuación se muestran los diversos elementos que se pueden <b><i>modificar</i></b> dentro del modelo para el <b><i>Natural Language Preprocessing.</i></b></p>
            <h6 className='fw-bold pt-3 text-secondary'><i>1.3.1 Bidirectional encoder representation from transformers (BERT)</i></h6>
            <p className='mb-1 text-muted'>Es el <b><i>valor de exactitud</i></b> que se desea aplicar al modelo al momento de realizar la <b><i>búsqueda</i></b> de las <b><i>respuestas</i></b> durante la llamada con el cliente, debe ser un valor entre <b><i>0 y 100</i></b>.</p>
            <div className='form-check form-switch mt-1'>
              <input className='form-check-input' type='checkbox' onClick={()=>setBertManualPred(!bertManualPred)} defaultChecked={bertManualPred} value={bertManualPred}/>
              {bertManualPred ? <label  className='form-check-label text-muted'>Predeterminado</label> : <label  className='form-check-label text-muted'>Personalizado</label>}
            </div>
            {bertManualPred === false ? 
            <div>
              <input type='range' class='form-range' min='0' max='100' step='0.1' onChange={e => setBertManualVal(e.target.value)} value={bertManualVal}/>
              <div className='d-flex justify-content-between'>
                <p className='mb-1 text-muted'>0</p>
                <p className='mb-1 text-primary fw-bold'>{bertManualVal}</p>
                <p className='mb-1 text-muted'>100</p>
              </div>
            </div>
            :
            <p className='mx-0 my-0'></p>
            }
            <h6 className='fw-bold pt-3 text-secondary'><i>1.3.2 Word to vector (W2V)</i></h6>
            <p className='mb-1 text-muted'>Es el proceso que se realiza a partir del <b><i>archivo</i></b> que proporcione su empresa para <b><i>transformar</i></b> las entradas de texto a <b><i>componentes</i></b>, Personalized Conversation Solutions ya contiene un word to vector <b><i>pre-entrenado</i></b> de manera <b><a href='http://bit.ly/3OCtthp' target='_blank' rel='noreferrer'>predeterminada</a></b>, si su archivo cuenta con un corpus inicial de más de <b><i>5000 respuestas/contextos</i></b> deshabilita la opción inicial para que se <b><i>entrene sobre si mismo</i></b>.</p>
            <div className='form-check form-switch mt-1'>
              <input className='form-check-input' type='checkbox' id='modeloSwitchWord' onClick={()=>setW2vManualPred(!w2vManualPred)} defaultChecked={w2vManualPred} value={w2vManualPred}/>
              {w2vManualPred ? <label  className='form-check-label text-muted' for='modeloSwitchWord'>Predeterminado</label> : <label  className='form-check-label text-muted' for='modeloSwitchWord'>Entrenamiento personalizado</label>}
            </div>
            <h6 className='fw-bold pt-3 text-secondary'><i>1.3.3 Principal component analysis (PCA)</i></h6>
            <p className='mb-1 text-muted'>Es una <b><i>reducción de componentes</i></b> que surgen del <b><i>W2V</i></b> para que se obtenga lo que se va a <b><i>clasificar</i></b> o las <b><i>variables más relevantes</i></b>, para que funcione correctamente se puede tener <b><i>máximo 400</i></b> componentes.</p>
            <div className='form-check form-switch mt-1'>
              <input className='form-check-input' type='checkbox' onClick={()=>setPcaManualPred(!pcaManualPred)} defaultChecked={pcaManualPred} value={pcaManualPred}/>
              {pcaManualPred ? <label  className='form-check-label text-muted'>Predeterminado</label> : <label  className='form-check-label text-muted'>Personalizado</label>}
            </div>
            {pcaManualPred === false ? 
            <div>
              <input type='range' class='form-range' min='0' max='400' step='1' onChange={e => setPcaManualVal(e.target.value)} value={pcaManualVal}/>
              <div className='d-flex justify-content-between'>
                <p className='mb-1 text-muted'>0</p>
                <p className='mb-1 text-primary fw-bold'>{pcaManualVal}</p>
                <p className='mb-1 text-muted'>400</p>
              </div>
            </div>
            :
            <p className='mx-0 my-0'></p>
            }
            <h6 className='fw-bold pt-3 text-secondary'><i>1.3.4 Speech to text</i></h6>
            <p className='mb-1 text-muted'>Es el proceso que realiza la solución conversacional para cambiar la <b><i>voz de entrada del cliente </i></b> a <b><i>texto</i></b> para que se pueda generar la <b><i>comunicación</i></b>, si su empresa cuenta con una <b><i>API de su preferencia</i></b> ingrese un enlace personalizado.</p>
            <div className='form-check form-switch mt-1'>
              <input className='form-check-input' type='checkbox' onClick={()=>setS2tManualPred(!s2tManualPred)} defaultChecked={s2tManualPred} value={s2tManualPred}/>
              {s2tManualPred ? <label className='form-check-label text-muted'>Predeterminado</label> : <label className='form-check-label text-muted'>Personalizado</label>}
            </div>
            {s2tManualPred ? <p className='mx-0 my-0'></p> : <input type='text' class='form-control' placeholder='https://miAPI.com' onChange={e => setS2tManualVal(e.target.value)} value={s2tManualVal}/>}
          </div>
          }
          {error && <Alert message={error}/>}
          <div className='d-flex flex-row pt-3'>
            <button type='submit' class='btn btn-primary fw-bolder px-4 py-2'>Submit</button>
          </div>
          <h4 className='fw-bolder pt-5 text-secondary'>2. Dashboard</h4>
          <p className='mb-0 text-muted' >Visualice si las variables del modelo se adaptan a sus necesidades.</p>
          <div className='d-flex flex-row justify-content-around align-items-center'>
            <div className='d-flex flex-column justify-content-center align-items-center'>
              <h5 className='pt-4 fw-bold text-muted'>Total de llamadas</h5>
              <h5 className='fw-bold text-primary'>{llamadasRealizadas}</h5>
            </div>
            <div className='d-flex flex-column justify-content-center align-items-center'>
              <h5 className='pt-4 fw-bold text-muted'>Llamadas completadas con éxito</h5>
              <h5 className='fw-bold text-primary'>{llamadasExitosas}</h5>
            </div>
          </div>
          <h4 className='fw-bolder pt-5 text-secondary'>3. Llamadas realizadas</h4>
          <p className='mb-3 text-muted' >Revise el transcript de las conversaciones que ha tenido el NLP.</p>
          {transcripts?.map((t)=>(
            <a href={t} target='_blank' rel='noreferrer'>Transcript</a>
          ))}
        </form>
        <div className='d-flex flex-row pt-3'>
          <button onClick={handleLogout} class='btn btn-primary fw-bolder px-4 py-2'>Logout</button>
        </div>
      </div>
    </div>
	)
}

export default Profile;