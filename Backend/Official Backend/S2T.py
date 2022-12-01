import speech_recognition as sr
import subprocess
import sys
import time
import traceback
import os
from T2S import T2S

def S2T(API = '', service = 'default'):
    try:
        r = sr.Recognizer()
        filename = "stream.wav"
        p = subprocess.Popen([sys.executable, "VoiceRecorder.py"]) 
        time.sleep(6+2)
        stream = sr.AudioFile(filename)
        antText = ''
        waitthr = 0
        while True:
            with stream as source:
                # r.adjust_for_ambient_noise(source)
                audio = r.record(stream)
            try:
                if service == 'default':
                    text = r.recognize_google(audio,language='es-MX')
                elif service == 'google':
                    text = r.recognize_google_cloud(audio,API,language='es-MX')
                elif service == 'bing':
                    text = r.recognize_bing(audio,API,language='es-MX')
                elif service == 'sphinx':
                    text = r.recognize_sphinx(audio,language='es-MX')
                elif service == 'houndify':
                    text = r.recognize_houndify(audio,API['client'],API['key'])
                elif service == 'IBM':
                    text = r.recognize_ibm(audio,API['client'],API['key'],language='es-MX')
                elif service == 'wit':
                    text = r.recognize_wit(audio,API,language='es-MX')
                if antText != text:
                    antText = text
                    time.sleep(1)
                else:
                    p.terminate()
                    p.wait()
                    os.remove(filename)
                    return text
            except sr.UnknownValueError:
                if waitthr < 5:
                    waitthr += 1
                    T2S('Esperando dictado')
                    p.terminate()
                    p.wait()
                    os.remove(filename)
                    p = subprocess.Popen([sys.executable, "VoiceRecorder.py"]) 
                    time.sleep(6)
                else:
                    T2S('Espera rebasada.')
                    p.terminate()
                    p.wait()
                    os.remove(filename)
                    return 'No speech detected ¡!¿?'
            except sr.RequestError as e:
                T2S('Problema de conexión, repita de nuevo')
                p.terminate()
                p.wait()
                os.remove(filename)
                p = subprocess.Popen([sys.executable, "VoiceRecorder.py"]) 
                time.sleep(6)
                
    except KeyboardInterrupt:
        p.terminate()
        dp = subprocess.Popen([sys.executable,'Delete_all.py'])
        T2S('Procesos terminados')
    except Exception as e:
        p.terminate()
        print(e)
        dp = subprocess.Popen([sys.executable,'Delete_all.py'])
        traceback.print_exc()
