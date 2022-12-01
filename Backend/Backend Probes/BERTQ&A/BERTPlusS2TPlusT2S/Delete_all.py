import sys
import os
import subprocess

p = subprocess.Popen([sys.executable, "VoiceRecorder.py"])
p.terminate()
p.wait()
os.remove('stream.wav')