from gensim.models import Word2Vec
import os
import numpy as np
import spacy
from S2T import S2T
from T2S import T2S

path = '/'.join(os.path.dirname(__file__).split('\\')[:-1])

model = Word2Vec.load(path+'/modelo/complete.model')

nlp = spacy.load('es_core_news_sm')

# tokensl.append()

T2S('Bienvenido a nuestro sistema de asistente virtual, primero preguntaremos por el tema que quiere tratar para su problema. Tome en cuenta que solo lo escuchamos cuando se dice la palabra "Escuchando".')

c2c = ['Envíos','Pedidos','Devoluciones','Reembolso','Cancelación','Membresías y Suscripciones','Métodos de pago','Seguridad','Facturación','tarjeta de regalo']

c2ct = [nlp(i) for i in c2c]

c2ct = [" ".join([t.lemma_.lower() for t in doc if t.orth_.isalpha() and len(t.orth_) > 1 and not (t.is_punct or t.is_stop)]) for doc in c2ct]

c2ct = [np.mean(np.array([model.wv[i] for i in j.split(' ')]),axis=0) for j in c2ct]

T2S("Introduzca tema a hablar")

inputAnswer = nlp(S2T())

vector = [t.lemma_.lower() for t in inputAnswer if t.orth_.isalpha() and len(t.orth_) > 1 and not (t.is_punct or t.is_stop)]

vector = np.mean(np.array([model.wv[i.lower()] for i in vector]),axis=0)

m = []
for i in c2ct:
    m.append(np.dot(i,vector)/(np.linalg.norm(i)*np.linalg.norm(vector)))

m = np.flip(np.argsort(m))

T2S("Los temas con los que se puede hablar al respecto son")
for i in range(3):
    T2S((str(i+1)+". "+c2c[m[i]]))