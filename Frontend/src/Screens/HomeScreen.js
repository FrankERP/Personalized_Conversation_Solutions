import React, {useState} from 'react';
import Navbar from '../Components/Navbar';
import '../Screens/ContainerStyles.css';

function HomeScreen() {

  const[title, setTitle] = useState(true);

  return (
    <div className='Wrapper mt-5 pt-5'>
      <Navbar/>
      <div className='Container'>
        {title ? 
        <div>
          <h1 className='fw-bold display-4 text-secondary mt-5 pt-5'><b className='text-primary'>P</b>ersonalized</h1>
          <h1 className='fw-bold display-4 text-secondary'>Co<b className='text-warning'>n</b>versation So<b className='text-info'>l</b>utions.</h1>
          <p className='h5 text-muted fw-normal'>El nuevo sistema de conmutación automatizado,  capaz de conectarse a varios</p>
          <p className='h5 text-muted fw-normal'>motores conversacionales y seleccionar el mejor de acuerdo a la entrada del usuario.</p>
          <div className='d-flex flex-row pt-3'>
              <button onClick={()=>setTitle(!title)} class='btn btn-primary fw-bolder px-4 py-2'>La magia detrás del proyecto</button>
          </div>
          <div className='d-flex flex-wrap mt-5 pt-5 justify-content-around'>
            <div className='card border border-warning border-3 py-3 mb-2' style={{width: '26rem'}}>
              <div className='card-body'>
                <h5 className='card-title text-secondary'>1. Personalización del modelo de conversación</h5>
                <h6 className='card-subtitle mt-1 mb-2 text-muted'>Reglas de negocio</h6>
                <p className='card-text text-secondary'>Los parámetros del modelo se pueden modificar conforme las necesidades específicas de la empresa.</p>
              </div>
            </div>
            <div className='card border border-warning border-3 py-3 mb-2' style={{width: '26rem'}}>
              <div className='card-body'>
                <h5 className='card-title text-secondary'>2. Dashboard</h5>
                <h6 className='card-subtitle  mt-1 mb-2 text-muted'>Comportamiento del modelo</h6>
                <p className='card-text text-secondary'>Visualización de las variables del modelo para monitorear el desempeño y verificar la adaptación a las necesidades.</p>
              </div>
            </div>
            <div className='card border border-warning border-3 py-3 mb-2' style={{width: '26rem'}}>
              <div className='card-body'>
                <h5 className='card-title text-secondary'>3. Llamadas realizadas</h5>
                <h6 className='card-subtitle mt-1 mb-2 text-muted'>Acercamiento a clientes</h6>
                <p className='card-text text-secondary'>Superviar los transcripts de las conversaciones que ha tenido el NLP afin de utilizar analítica de datos e implementar mejoras.</p>
              </div>
            </div>
          </div>
        </div>
        : 
        <div>
          <h1 className='fw-bold display-4 text-secondary mt-5 pt-5'><b className='text-warning'>N</b>atural</h1>
          <h1 className='fw-bold display-4 text-secondary'><b className='text-info'>L</b>anguage <b className='text-primary'>P</b>reprocessing.</h1>
          <p className='h5 text-muted fw-normal'>Rama de la inteligencia artificial dentro de la informática que se enfoca en</p>
          <p className='h5 text-muted fw-normal'>ayudar a las computadoras a comprender la forma en que los humanos escriben y hablan.</p>
          <div className='d-flex flex-row pt-3'>
              <button onClick={()=>setTitle(!title)} class='btn btn-primary fw-bolder px-4 py-2'>Conoce nuestro proyecto</button>
          </div> 
          <div className='d-flex flex-wrap justify-content-around mt-4'>
            <div className='card border border-warning border-3 py-3 mb-3 mt-2' style={{width: '26rem'}}>
              <div className='card-body'>
                <h5 className='card-title text-secondary'>0. Pre-entrenamiento</h5>
                <h6 className='card-subtitle mt-1 mb-2 text-muted'>Modelos con datos previamente recopliados</h6>
                <p className='card-text text-secondary'> Con el uso de un conjunto de respuestas de preguntas en español para que aprenda a buscar, así como un análisis sentimental para las críticas.</p>
              </div>
            </div>
            <div className='card border border-warning border-3 py-3 mb-3 mt-2' style={{width: '26rem'}}>
              <div className='card-body'>
                <h5 className='card-title text-secondary'>1. BERT</h5>
                <h6 className='card-subtitle mt-1 mb-2 text-muted'>Clasificación manual o automática</h6>
                <p className='card-text text-secondary'>Valor de exactitud que se desea aplicar al modelo al momento de realizar la búsqueda de las preguntas.</p>
              </div>
            </div>
            <div className='card border border-warning border-3 py-3 mb-3 mt-2' style={{width: '26rem'}}>
              <div className='card-body'>
                <h5 className='card-title text-secondary'>2. Word to vector (W2V)</h5>
                <h6 className='card-subtitle mt-1 mb-2 text-muted'>Clasificación manual o automática</h6>
                <p className='card-text text-secondary'>Es el proceso que se realiza para traducir las entradas de texto proporcionados.</p>
              </div>
            </div>
            <div className='card border border-warning border-3 py-3 mb-3  mt-2' style={{width: '26rem'}}>
              <div className='card-body'>
                <h5 className='card-title text-secondary'>3. Principal component analysis</h5>
                <h6 className='card-subtitle mt-1 mb-2 text-muted'>Clasificación manual o automática</h6>
                <p className='card-text text-secondary'>Reducción de datos provenientes del W2V para obtener los datos más relevantes y con mayor valor.</p>
              </div>
            </div>
            <div className='card border border-warning border-3 py-3 mb-3  mt-2' style={{width: '26rem'}}>
              <div className='card-body'>
                <h5 className='card-title text-secondary'>4. Modelo no supervisado</h5>
                <h6 className='card-subtitle mt-1 mb-2 text-muted'>Clasificación automática*</h6>
                <p className='card-text text-secondary'>Se utiliza para seleccionar el método en el que se van a agrupar los datos al momento de generar clasificaciones y su valor.</p>
              </div>
            </div>
            <div className='card border border-warning border-3 py-3 mb-3  mt-2' style={{width: '26rem'}}>
              <div className='card-body'>
                <h5 className='card-title text-secondary'>5. Speech to text</h5>
                <h6 className='card-subtitle mt-1 mb-2 text-muted'>Clasificación manual o automática</h6>
                <p className='card-text text-secondary'>Proceso de traducción de la entrada de voz a texto para que se pueda generar la comunicación con el sistema de voz.</p>
              </div>
            </div>
          </div>
        </div>}
      </div>
    </div>
  )
}

export default HomeScreen;