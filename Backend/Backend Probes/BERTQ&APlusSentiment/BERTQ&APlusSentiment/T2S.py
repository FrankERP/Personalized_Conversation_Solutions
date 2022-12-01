# to speech conversion
from gtts import gTTS
import sounddevice as sd
import soundfile as sf
import os
from datetime import datetime

def T2S(text,language = 'es',slow = False):
    # The text that you want to convert to audio and language to convert
    filename = datetime.now().strftime("%d_%m_%Y_%H_%M_%S") + '.wav'
    myobj = gTTS(text=text, lang=language, slow=slow)
    myobj.save(filename)
    # Extract data and sampling rate from file
    data, fs = sf.read(filename, dtype='float32')  
    sd.play(data, fs)
    sd.wait()  # Wait until file is done playing
    os.remove(filename)