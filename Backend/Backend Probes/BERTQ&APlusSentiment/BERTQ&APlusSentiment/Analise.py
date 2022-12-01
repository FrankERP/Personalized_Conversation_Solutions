import pandas as pd

df = pd.read_csv('DB.csv')
print(df.Clases.to_list())