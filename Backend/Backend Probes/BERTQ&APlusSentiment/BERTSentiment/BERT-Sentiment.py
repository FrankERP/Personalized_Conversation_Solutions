# Importar
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
model = 'finiteautomata/beto-sentiment-analysis'
tokenizer = AutoTokenizer.from_pretrained(model, do_lower_case=False)
model = AutoModelForSequenceClassification.from_pretrained(model)

# Ejemplo de inferencia (pregunta-respuesta)
nlp = pipeline("sentiment-analysis", model=model, tokenizer=tokenizer, top_k=3)

def returnFeedback(nlp,inputSen):
  while True:
    answerL = nlp(input(inputSen))[0]
    if (answerL[0]['score'] < 0.5) or (answerL[0]['label'] == 'NEU' and answerL[1]['label'] == 'NEG'):
      print('No entendimos su respuesta, intente de nuevo, se recomienda que diga sí o no a la pregunta.')
    elif answerL[0]['label'] == 'POS' or answerL[1]['label'] == 'POS':
      return True
    else:
      return False

    

print(returnFeedback(nlp,'Escriba su comentario: '))