# Importar
# mrm8488/distill-bert-base-spanish-wwm-cased-finetuned-spa-squad2-es
# inigopm/beto-base-spanish-squades2
from transformers import AutoTokenizer, AutoModelForQuestionAnswering, pipeline
model = 'inigopm/beto-base-spanish-squades2'
tokenizer = AutoTokenizer.from_pretrained(model, do_lower_case=False)
model = AutoModelForQuestionAnswering.from_pretrained(model)

# Ejemplo de inferencia (pregunta-respuesta)
nlp = pipeline('question-answering', model=model, tokenizer=tokenizer)

from textwrap import wrap

def pregunta_respuesta(model, contexto, nlp):

  # Imprimir contexto
  print('Contexto:')
  print('-----------------')
  print('\n'.join(wrap(contexto)))

  #Loop preguntas-respuestas:
  continuar = True
  while continuar:
    print('\nPregunta:')
    print('-----------------')
    pregunta = input()

    continuar = pregunta != ''

    if continuar:
      salida = nlp({'question':pregunta,'context':contexto})
      print('\nRespuesta:')
      print('-----------------')
      print(salida['answer'])
      print('Con una certeza de:',salida['score'])

contexto ="""el tema tres por favor"""
pregunta_respuesta(model, contexto, nlp)