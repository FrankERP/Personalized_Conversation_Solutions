from gensim.models import Word2Vec
import os

path = '/'.join(os.path.dirname(__file__).split('\\')[:-1])

print('Cargando modelo...')
model = Word2Vec.load(path+'/modelo/complete.model')
print('Modelo cargado. Haciendo operación de palabras...')
vector = model.wv['emperador'] - model.wv['hombre'] + model.wv['mujer']
print('Operación terminada. Vector más similar en palabras...')
print(model.wv.most_similar([vector]))