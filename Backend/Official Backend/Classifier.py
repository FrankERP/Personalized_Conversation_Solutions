import csv
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import re
from gensim.models import KeyedVectors
import spacy
import os
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt
from yellowbrick.cluster import KElbowVisualizer
from sklearn.cluster import KMeans, SpectralClustering

def countOccurrence(a):
  k = {}
  for j in a:
    if j in k:
      k[j] +=1
    else:
      k[j] =1
  return k

with open('DBC.csv', 'r', encoding='UTF-8', newline='') as f:
    reader = csv.reader(f)
    data = list(reader)

l = [re.sub('[\\n]','',value[0])+" " for value in data]

nl = []
for i in l:
  nl += [j+'.' for j in i.split('. ') if j]
nlp = spacy.load('es_core_news_sm')

tokensl = []
for corpus in nl:
  doc = nlp(corpus)
  tokensl.append([t.lemma_.lower() for t in doc if t.orth_.isalpha() and len(t.orth_) > 1 and not (t.is_punct or t.is_stop)])

c = 0
for j in [i for i,le in enumerate(tokensl) if len(le) == 0]:
  nl.pop(j-c)
  tokensl.pop(j-c)
  c += 1

unique_docs = [tokensl[0]]
index_rep = []
for i,doc in enumerate(tokensl[1:]):
  flagR = True
  for doc2 in unique_docs:
    if sorted(doc) == sorted(doc2) and len(doc) == len(doc2):
      index_rep.append(i)
      flagR = False
      break
  if flagR:
    unique_docs.append(doc)

c = 0
for j in index_rep:
  nl.pop(j-c)
  tokensl.pop(j-c)
  c += 1

path = '/'.join(os.path.dirname(__file__).split('\\')[:-1])

model = KeyedVectors.load('modelo/complete.kv')

def avg_word2vec(doc):
  #remove out-of-vocabulary words
  return np.mean([model[word] for word in doc if word in model.index2word], axis = 0)

avgwv = []
for tokens in tokensl:
  avgwv.append(avg_word2vec(tokens))
avgwv = np.array(avgwv)
scaler = MinMaxScaler().fit(avgwv)
avgwvt = scaler.transform(avgwv)

pca = PCA().fit(avgwvt)

plt.rcParams["figure.figsize"] = (12,6)

fig, ax = plt.subplots()
xi = np.arange(1, avgwvt.shape[0]+1, step=1)
y = np.cumsum(pca.explained_variance_ratio_)

plt.ylim(0.0,1.1)
plt.plot(xi, y, marker='o', linestyle='--', color='b')

plt.xlabel('Número de componentes')
# plt.xticks(np.arange(1, avgwvt.shape[0]+1, step=1)) #change from 0-based array index to 1-based human-readable label
plt.ylabel('Varianza cumulativa (%)')
plt.title('El número de componentes necesarios para explicar la varianza.')

plt.axhline(y=0.95, color='r', linestyle='-')
plt.text(0.5, 0.85, '95% umbral de corte', color = 'red', fontsize=16)

plt.axvline(x=np.argwhere(y>0.95)[0]+1, color='g', linestyle='-')
plt.text((np.argwhere(y>0.95)[0]+2), 0.5, 'Cantidad óptima: '+str(np.argwhere(y>0.95)[0,0]+1), color = 'green', fontsize=16)

ax.grid(axis='x')
plt.savefig('VarianzaPCA.png')
plt.clf()

pca = PCA(n_components=0.95).fit(avgwvt)
reduced = pca.transform(avgwvt)

kmmodel = SpectralClustering()
visualizer = KElbowVisualizer(
    kmmodel, k=(2,avgwvt.shape[0]), metric='distortion', timings=True,
)

visualizer.fit(reduced)
visualizer.show(outpath="OptimalK.png")

kmmodel = SpectralClustering(visualizer.elbow_value_).fit(reduced)

d = {}
for i in range(visualizer.elbow_value_):
  d[i] = []

for i in [list(i) for i in zip(kmmodel.labels_.tolist(),nl)]:
  d[i[0]] += [i[1]]

d = [' '.join(i) for i in d.values()]

tokensl = []
for corpus in d:
  doc = nlp(corpus)
  tokensl.append([t.lemma_.lower() for t in doc if t.orth_.isalpha() and len(t.orth_) > 1 and not (t.is_punct or t.is_stop)])

names = []
for j in [countOccurrence(i) for i in tokensl]:
  names.append(dict(sorted(j.items(), key=lambda item: item[1],reverse=True)))
  
i_names = [0 for i in range(len(names))]

flagN = True
s_names = ['' for i in range(len(names))]
while flagN:
  flagN = False
  for i,n in enumerate(names):
    name = list(n.keys())[i_names[i]]
    if name[-2:] in ['ar','er','ir'] or len(name) < 5 or len(name.split(' ')) > 1:
      i_names[i] += 1
      flagN = True
      s_names = ['' for i in range(len(names))]
      break
    if name in s_names:
      for i1,n1 in enumerate(names):
        if name in list(n1.keys()) and name == s_names[i1]:
          if n1[name] < n[name]:
            i_names[i1] += 1
          else:
            i_names[i] += 1
          flagN = True
          break
    else:
      s_names[i] = name
    if flagN:
      s_names = ['' for i in range(len(names))]
      break

with open('DBN.csv', 'w', newline='') as f:
    # using csv.writer method from CSV package
    write = csv.writer(f)
    write.writerows([['Clases','Contextos']])
    write.writerows([list(i) for i in zip(s_names,d)])