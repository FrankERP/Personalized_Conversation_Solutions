# Importar

from S2T import S2T
from T2S import T2S
from transformers import AutoTokenizer, AutoModelForQuestionAnswering, AutoModelForSequenceClassification, pipeline
from datetime import datetime
import pandas as pd
from gensim.models import Word2Vec
import os
import numpy as np
import spacy

# Obtener Modelo
# mrm8488/distill-bert-base-spanish-wwm-cased-finetuned-spa-squad2-es
model = 'inigopm/beto-base-spanish-squades2'
tokenizer = AutoTokenizer.from_pretrained(model, do_lower_case=False)
model = AutoModelForQuestionAnswering.from_pretrained(model)
report = [['REPORTE']]
# NLP
nlp = pipeline('question-answering', model=model, tokenizer=tokenizer)

# Obtener Modelo
modelS = 'finiteautomata/beto-sentiment-analysis'
tokenizerS = AutoTokenizer.from_pretrained(modelS, do_lower_case=False)
modelS = AutoModelForSequenceClassification.from_pretrained(modelS)
# NLP
nlpS = pipeline('sentiment-analysis', model=modelS, tokenizer=tokenizerS, top_k=3)

Users = {'Jorge Iglesias': 'A01653261'}

path = '/'.join(os.path.dirname(__file__).split('\\')[:-1])
modelw = Word2Vec.load(path+'/modelo/complete.model')
nlpw = spacy.load('es_core_news_sm')

df = pd.read_csv('DB.csv')

temas = df.Clases.to_list()
c2ct = [nlpw(i) for i in temas]
c2ct = [" ".join([t.lemma_.lower() for t in doc if t.orth_.isalpha() and len(t.orth_) > 1 and not (t.is_punct or t.is_stop)]) for doc in c2ct]
c2ct = [np.mean(np.array([modelw.wv[i] for i in j.split(' ')]),axis=0) for j in c2ct]

contextos = df.Contextos.to_list()

def pregunta_respuesta(contexto, nlp):
    #Loop preguntas-respuestas:
    global report
    pregunta = S2T()
    if pregunta != 'No speech detected ¡!¿?':
        respuesta = nlp({'question':pregunta,'context':contexto})['answer']
        report += [[pregunta+':',respuesta]]
        return respuesta
    else:
        raise(KeyboardInterrupt)

def pregunta_respuesta_inv(pregunta, nlp,ask=True):

    #Loop preguntas-respuestas:
    if ask:
        T2S(pregunta)
    contexto = S2T()
    if contexto != 'No speech detected ¡!¿?':
        return nlp({'question':pregunta,'context':contexto})['answer']
    else:
        raise(KeyboardInterrupt)

def returnFeedback(inputSen,nlp):
  while True:
    T2S(inputSen)
    answerL = nlp(S2T())[0]
    if (answerL[0]['score'] < 0.5) or (answerL[0]['label'] == 'NEU' and answerL[1]['label'] == 'NEG'):
      T2S('No entendimos su respuesta, intente de nuevo, se recomienda que diga sí o no a la pregunta.')
    elif answerL[0]['label'] == 'POS' or answerL[1]['label'] == 'POS':
      return True
    else:
      return False

def checkInt(str):
    return str.isdigit()

if __name__ == '__main__':
    report += [['Usuario ingresa al sistema']]
    try:
        T2S('Bienvenido a nuestro sistema de asistente virtual, primero preguntaremos por sus datos personales para saber si está registrado en el sistema. Tome en cuenta que solo lo escuchamos cuando se dice la palabra "Escuchando".')
        while True:
            nombreU = pregunta_respuesta_inv('¿Cuál es su nombre registrado en el sistema?',nlp)
            report += [['Nombre de usuario ingresado:',nombreU]]
            while True:
                IdU = pregunta_respuesta_inv('¿Cual es su matrícula? Solo el número.',nlp)
                IdU = ''.join(IdU.split(' '))
                if checkInt(IdU):
                    IdU = 'A'+IdU
                    break
                else:
                    T2S('Texto recibido contiene caracteres y no solo número, intente de nuevo.')
            report += [['Matrícula:',IdU]]
            T2S('Hola ' + nombreU + ', su matrícula es: '+ IdU)
            respuesta = 'sí' if returnFeedback('¿Es la información ingresada correcta?',nlpS) else 'no'
            report += [['¿Datos correctos según usuario?:',respuesta]]
            if respuesta == 'sí':
                try:
                    if Users[nombreU] == IdU:
                        T2S('Bienvenido ' + nombreU )
                        report += [['¿Datos correctos según sistema?:','sí']]
                        break
                    else:
                        T2S('No se encontraron sus datos en nuestra base de datos o son incorrectos, intente de nuevo.')
                        report += [['¿Datos correctos según sistema?:','no']]
                except:
                    T2S('No se encontraron sus datos en nuestra base de datos o son incorrectos, intente de nuevo.')
                    report += [['¿Datos correctos según sistema?:','no']]
            else:
                T2S('Se repitirá el proceso de recopilación de sus datos.')
                continue
        report += [['Usuario hace preguntas al sistema']]  
        T2S('Primero preguntaremos por el tema que quiere tratar para su problema.')
        respuesta2 = 'sí'
        while respuesta2 == 'sí':
            while True:
                T2S('Referente a su problema ¿Cuál es el tema que piensa podría resolver su situación?')
                inputAnswer = nlpw(S2T())
                report += [['Problema sugerido:',inputAnswer.text]]
                vector = [t.lemma_.lower() for t in inputAnswer if t.orth_.isalpha() and len(t.orth_) > 1 and not (t.is_punct or t.is_stop)]
                for i in vector:
                    try:
                        modelw.wv[i.lower()]
                    except:
                        vector.remove(i)
                vector = np.mean(np.array([modelw.wv[i.lower()] for i in vector]),axis=0)
                m = []
                for i in c2ct:
                    m.append(np.dot(i,vector)/(np.linalg.norm(i)*np.linalg.norm(vector)))
                m = np.flip(np.argsort(m))
                T2S("Los temas con los que se puede hablar al respecto sobre su problema son")
                for i in range(3):
                    T2S((str(i+1)+". "+temas[m[i]]))
                report += [['Temas sugeridos:',', '.join([temas[m[i]] for i in range(3)])]]
                if returnFeedback('¿De los temas mencionados se encuentra el que busca resolver su problema?',nlpS):
                    report += [['¿Temas correctos según usuario?:','sí']]
                    break
                else:
                    T2S("Vuelvanos a decir que tema busca de una manera más clara por favor.")
                    report += [['¿Temas correctos según usuario?:','no']]
            T2S('De los temas anteriormente mencionados ¿Cual es el número del tema que quiere hablar? Recuerde que los números de los temas son')
            while True:
                for i in range(3):
                    T2S((str(i+1)+". "+temas[m[i]]))
                index = pregunta_respuesta_inv('¿Qué número dijo? sólo el número', nlp,ask=False).split(' ')
                if len(index) > 2:
                    index = index[0:2]
                for i in index:
                    try:
                        word2num = {'uno':'1','dos':'2', 'tres':'3'}
                        index = word2num[i]
                        break
                    except:
                        if i.isalpha():
                            pass
                        else:
                            index = i
                            break
                if type(index) == list:
                    if len(index) > 1:
                        index = index[0]
                if checkInt(index):
                    index = int(index)
                    if index > 0 and index < 4:
                        if returnFeedback('Usted seleccionó '+temas[m[index-1]]+'. ¿És eso correcto?',nlpS):
                            report += [['Tema seleccionado según usuario:',temas[m[index-1]]]]
                            break
                        else:
                            T2S('Repita el número por favor. Repetiremos el menú de temas mencionado anteriormente.')
                    else:
                        T2S('Número se sale de rango. Intente de nuevo seleccionando el tema con su número respectivo')
                else:
                    T2S('Texto recibido contiene caracteres y no solo número, intente de nuevo solo mencionando el número del tema que quiere hablar.')
            contexto = contextos[m[index-1]]
            respuesta3 = 'no'
            while respuesta3 == 'no':
                T2S('¿En qué podemos apoyarlo en cuanto al tema seleccionado?')
                T2S(pregunta_respuesta(contexto,nlp))            
                respuesta1 = 'sí' if returnFeedback('¿Nuestra respuesta le ayudó a resolver su problema?',nlpS) else 'no'
                report += [['¿Datos correctos según usuario?:',respuesta1]]
                respuesta2 = 'sí' if returnFeedback('¿Quiere seguir haciendo más preguntas?',nlpS) else 'no'
                report += [['¿Sigue usuario preguntando?:',respuesta2]]
                if respuesta2 == 'no':
                    T2S('Hasta luego, esperamos haber sido de ayuda...')
                    report += [['Sale Usuario, fin de conversación']]
                    break
                else:
                    report += [['Usuario hace más preguntas al sistema']]
                    if respuesta1 == 'no':
                        respuesta3 = 'sí' if returnFeedback('¿Quiere cambiar de tema?',nlpS) else 'no'
                        if respuesta3 == 'sí':
                            report += [['Usuario cambió de tema']]
                            break
    except KeyboardInterrupt:
        T2S('Estimado cliente, debido a que no logramos entenderlo, lo enviaremos con un asistente humano, disculpe las molestias')
        report += [['Fin de conversación con asistente virtual']]
    finally:    
        with open(datetime.now().strftime("%d_%m_%Y_%H_%M_%S")+'.txt', 'w') as f:
            for phrase in report:
                f.write(' '.join(phrase) + '\n')
