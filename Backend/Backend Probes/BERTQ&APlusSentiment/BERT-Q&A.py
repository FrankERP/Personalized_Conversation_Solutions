# Importar

from S2T import S2T
from T2S import T2S
from transformers import AutoTokenizer, AutoModelForQuestionAnswering, pipeline, AutoModelForSequenceClassification
from datetime import datetime

# Obtener Modelo
# mrm8488/distill-bert-base-spanish-wwm-cased-finetuned-spa-squad2-es
# inigopm/beto-base-spanish-squades2
model = 'inigopm/beto-base-spanish-squades2'
tokenizer = AutoTokenizer.from_pretrained(model, do_lower_case=False)
model = AutoModelForQuestionAnswering.from_pretrained(model)

modelSentiment = 'finiteautomata/beto-sentiment-analysis'
tokenizerS = AutoTokenizer.from_pretrained(modelSentiment, do_lower_case=False)
modelSentiment = AutoModelForSequenceClassification.from_pretrained(modelSentiment)

report = [['REPORTE']]
# NLP
nlp = pipeline('question-answering', model=model, tokenizer=tokenizer)
nlpS = pipeline('sentiment-analysis', model=modelSentiment, tokenizer=tokenizerS)

def pregunta_respuesta(contexto, nlp):

    #Loop preguntas-respuestas:
    global report
    pregunta = '¿'+S2T()+'?'
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

def checkInt(str):
    if str[0] in ('-', '+'):
        return str[1:].isdigit()
    return str.isdigit()

Users = {'Jorge Iglesias': 'A01653261'}

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
            T2S('Hola ' + nombreU + ', su matrícula es: '+ IdU + ', ¿Es la información ingresada correcta? Solo diga si o no.')
            while True:
                respuesta = pregunta_respuesta_inv('Sólamente dijo sí o no?',nlp,False).split(' ')[0]
                if not respuesta.lower() in ['si','sí','no']:
                    T2S('No entendimos su respuesta, solo diga sí o no')
                else:
                    break
            report += [['¿Datos correctos según usuario?:',respuesta]]
            if respuesta.lower() in ['si','sí']:
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
                continue
        report += [['Usuario hace preguntas al sistema']]
        contexto = 'La fecha de entrega tu pedido depende de diversos factores. Si tu pedido es nacional, se entregará en un plazo de entre 24 y 48 horas. Si tu pedido es importado, el proveedor debe proporcionar una fecha de entrega que puede ir desde una semana hasta 2 meses dependiendo de las políticas de importación y exportación de ambos paises.'    
        while True:
            T2S('¿En qué podemos servirle?')
            T2S(pregunta_respuesta(contexto,nlp))            
            while True:
                respuesta = pregunta_respuesta_inv('¿Nuestra respuesta le ayudó a resolver su problema?',nlp).split(' ')[0]
                if not respuesta.lower() in ['si','sí','no']:
                    T2S('No entendimos su respuesta, solo diga sí o no')
                else:
                    break
            report += [['¿Datos correctos según usuario?:',respuesta]]
            while True:
                respuesta = pregunta_respuesta_inv('¿Quiere seguir haciendo más preguntas?',nlp).split(' ')[0]
                if not respuesta.lower() in ['si','sí','no']:
                    T2S('No entendimos su respuesta, solo diga sí o no')
                else:
                    break
            report += [['¿Sigue usuario preguntando?:',respuesta]]
            if respuesta.lower() == 'no':
                T2S('Hasta luego, esperamos haber sido de ayuda...')
                report += [['Sale Usuario, fin de conversación']]
                break
            else:
                report += [['Usuario hace más preguntas al sistema']]

    except KeyboardInterrupt:
        T2S('Estimado cliente, debido a que no logramos entenderlo, lo enviaremos con un asistente humano, disculpe las molestias')
        report += [['Fin de conversación con asistente virtual']]
    finally:    
        with open(datetime.now().strftime("%d_%m_%Y_%H_%M_%S")+'.txt', 'w') as f:
            for phrase in report:
                f.write(' '.join(phrase) + '\n')
