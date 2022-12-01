import pyaudio
import wave
 
# Record in chunks of 1024 samples
chunk = 1024 
 
# 16 bits per sample
sample_format = pyaudio.paInt16 
chanels = 1
 
# Record at 44400 samples per second
smpl_rt = 44400
filename = "stream.wav"
 
# Create an interface to PortAudio
pa = pyaudio.PyAudio() 
 
stream = pa.open(format=sample_format, channels=chanels,
                 rate=smpl_rt, input=True,
                 frames_per_buffer=chunk)

sf = wave.open(filename, 'wb')
sf.setnchannels(chanels)
sf.setsampwidth(pa.get_sample_size(sample_format))
sf.setframerate(smpl_rt)

print('Grabando...')

try:
    # Store data in chunks
    while True:
        sf.writeframes(b''.join([stream.read(chunk)]))
except KeyboardInterrupt:
    # Stop and close the stream
    stream.stop_stream()
    stream.close()
    
    # Terminate - PortAudio interface
    pa.terminate()
    
    # Save the recorded data in a .wav format
    sf.close()

    print('Proceso de grabación terminado')