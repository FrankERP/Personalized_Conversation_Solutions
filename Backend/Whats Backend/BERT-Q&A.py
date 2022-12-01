# Importar

from transformers import AutoTokenizer, AutoModelForQuestionAnswering, AutoModelForSequenceClassification, pipeline
from datetime import datetime
import pandas as pd
from gensim.models import KeyedVectors
import numpy as np
import spacy
from whats import receive,send

report = [['Tipo de pregunta','Pregunta','Respuesta','Probabilidad','Evaluación']]

def pregunta_respuesta(contexto, nlp):
    #Loop preguntas-respuestas:
    global report
    pregunta = receive()
    if pregunta != 'No speech detected ¡!¿?':
        respuesta = nlp({'question':pregunta,'context':contexto})
        respuesta['question'] = pregunta
        return respuesta
    else:
        raise(KeyboardInterrupt)

def pregunta_respuesta_inv(pregunta, nlp,ask=True):
    #Loop preguntas-respuestas:
    if ask:
        send(pregunta)
    contexto = receive()
    if contexto != 'No speech detected ¡!¿?':
        respuesta = nlp({'question':pregunta,'context':contexto})
        respuesta['question'] = contexto
        return respuesta
    else:
        raise(KeyboardInterrupt)

def returnFeedback(inputSen,nlp):
    global report
    while True:
            send(inputSen)
            res = receive()
            answerL = nlp(res)[0]
            if (answerL[0]['score'] < 0.5) or (answerL[0]['label'] == 'NEU' and answerL[1]['label'] == 'NEG'):
                send('No entendimos su respuesta, intente de nuevo, se recomienda que diga sí o no a la pregunta.')
            elif answerL[0]['label'] == 'POS' or answerL[1]['label'] == 'POS':
                if answerL[0]['label'] == 'POS':
                    score = answerL[0]['score']
                else:
                    score = answerL[1]['score']
                report += [['Condición',inputSen,res,str(score),'POS']]
                return True
            else:
                report += [['Condición',inputSen,res,str(answerL[0]['score']),'NEG']]
                return False

def checkInt(str):
    return str.isdigit()

def main():
    global report
    try:
        start = datetime.now().strftime("%d_%m_%Y_%H_%M_%S")
        send('Bienvenido a nuestro sistema de asistente virtual. Espere un poco para que podamos ayudarlo.')
        send('En esta conversación se van a recopilar todos los datos para mejorar el servicio.')

        with open('attrs.txt','r') as attr:
            data = attr.read()
            attrL = data.split('\n')
            attr.close()

        # Obtener Modelo
        tokenizer = AutoTokenizer.from_pretrained(attrL[0], do_lower_case=False)
        model = AutoModelForQuestionAnswering.from_pretrained(attrL[0])
        
        # NLP
        nlp = pipeline('question-answering', model=model, tokenizer=tokenizer)

        # Obtener Modelo
        tokenizerS = AutoTokenizer.from_pretrained(attrL[1], do_lower_case=False)
        modelS = AutoModelForSequenceClassification.from_pretrained(attrL[1])

        # NLP
        nlpS = pipeline('sentiment-analysis', model=modelS, tokenizer=tokenizerS, top_k=3)

        modelw = KeyedVectors.load('modelo/complete.kv')
        nlpw = spacy.load('es_core_news_sm')

        df = pd.read_csv('DB.csv')

        temas = df.Clases.to_list()
        c2ct = [nlpw(i) for i in temas]
        c2ct = [" ".join([t.lemma_.lower() for t in doc if t.orth_.isalpha() and len(t.orth_) > 1 and not (t.is_punct or t.is_stop)]) for doc in c2ct]
        c2ct = [np.mean(np.array([modelw[i] for i in j.split(' ')]),axis=0) for j in c2ct]

        contextos = df.Contextos.to_list()

        send('Primero preguntaremos por el tema que quiere tratar para su problema.')
        respuesta2 = 'sí'
        while respuesta2 == 'sí':
            while True:
                while True:
                    send('Referente a su problema ¿Cuál es el tema que piensa podría resolver su situación?')
                    inputAnswer = nlpw(receive())
                    vector = [t.lemma_.lower() for t in inputAnswer if t.orth_.isalpha() and len(t.orth_) > 1 and not (t.is_punct or t.is_stop)]
                    if len(vector) == 0:
                        send('No entendimos su respuesta, responda la pregunta de una manera más clara y extensa por favor')
                    else:
                        break
                for i in vector:
                    try:
                        modelw[i.lower()]
                    except:
                        vector.remove(i)
                vector = np.mean(np.array([modelw[i.lower()] for i in vector]),axis=0)
                scores = []
                for i in c2ct:
                    scores.append(np.dot(i,vector)/(np.linalg.norm(i)*np.linalg.norm(vector)))
                m = np.flip(np.argsort(scores))
                send("Los temas con los que se puede hablar al respecto sobre su problema son:\n"+"\n".join([(str(i+1)+". "+temas[m[i]]) for i in range(3)]))
                if returnFeedback('De los temas mencionados ¿Se encuentra el que busca resolver su problema?',nlpS):
                    report += [['Selección',inputAnswer.text,' '.join([temas[m[i]] for i in range(3)]),' '.join([str(scores[m[i]]) for i in range(3)]),'POS']]
                    break
                else:
                    send("Vuélvanos  a decir que tema busca de una manera más clara por favor.")
                    report += [['Selección',inputAnswer.text,', '.join([temas[m[i]] for i in range(3)]),' '.join([str(scores[m[i]]) for i in range(3)]),'NEG']]
            send('De los temas anteriormente mencionados ¿Cuál es el número del tema que quiere hablar?')
            while True:
                respuesta = pregunta_respuesta_inv('¿Qué número dijo? sólo el número', nlp,ask=False)
                index = respuesta['answer'].split(' ')
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
                        rc = 'POS' if returnFeedback('Usted seleccionó '+temas[m[index-1]]+'. ¿Es eso correcto?',nlpS) else 'NEG'
                        if rc == 'POS':
                            report += [['Detectar Respuesta',respuesta['question'],respuesta['answer'],str(respuesta['score']),rc]]
                            break
                        else:

                            send('Repita el número por favor.')
                    else:
                        send('Número se sale de rango. Intente de nuevo seleccionando el tema con su número respectivo.')
                else:
                    send('Texto recibido contiene caracteres y no solo número, intente de nuevo solo mencionando el número del tema que quiere hablar.')
            contexto = contextos[m[index-1]]
            respuesta3 = 'no'
            while respuesta3 == 'no':
                send('¿En qué podemos apoyarlo en cuanto al tema seleccionado?')
                QA = pregunta_respuesta(contexto,nlp)
                send(QA['answer'])            
                respuesta1 = 'POS' if returnFeedback('¿Nuestra respuesta le ayudó a resolver su problema?',nlpS) else 'NEG'
                report += [['Pregunta y Respuesta',QA['question'],QA['answer'].replace(',',';'),str(QA['score']),respuesta1]]
                respuesta2 = 'sí' if returnFeedback('¿Quiere seguir haciendo más preguntas?',nlpS) else 'no'
                if respuesta2 == 'no':
                    send('Hasta luego, esperamos haber sido de ayuda...')
                    report += [['Conversación',start,datetime.now().strftime("%d_%m_%Y_%H_%M_%S"),'1.','POS']]
                    break
                else:
                    respuesta3 = 'sí' if returnFeedback('¿Quiere cambiar de tema?',nlpS) else 'no'
                    if respuesta3 == 'sí':
                        break
    except KeyboardInterrupt:
        send('Estimado cliente, debido a que no logramos entenderlo, lo enviaremos con un asistente humano, disculpe las molestias')
        report += [['Conversación',start,datetime.now().strftime("%d_%m_%Y_%H_%M_%S"),'0','NEG']]
    finally:    
        with open(datetime.now().strftime("%d_%m_%Y_%H_%M_%S")+'.csv', 'w') as f:
            for phrase in report:
                f.write(','.join(phrase) + '\n')

if __name__ == '__main__':
    main()