#!/usr/bin/env python3
"""Build the self-contained Igloo package: dist/Ireland2036/ and dist/Ireland2036-Igloo.zip.

Usage: python3 tools/build-package.py [--videos DIR]
  --videos DIR   also copy replacement .mp4/.webm clips (and music.mp3) from DIR into assets/video
"""
import os, shutil, sys, zipfile, glob
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, 'dist', 'Ireland2036')
SRC = os.path.join(ROOT, 'package-src')

def crlf(path):
    data = open(path, 'rb').read().replace(b'\r\n', b'\n').replace(b'\n', b'\r\n')
    open(path, 'wb').write(data)

shutil.rmtree(OUT, ignore_errors=True)
os.makedirs(os.path.join(OUT, 'assets', 'video'))
os.makedirs(os.path.join(OUT, 'assets', 'audio'))
os.makedirs(os.path.join(OUT, 'tools', 'source'))
page = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
doc = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
       '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
       '</head>\n<body>\n' + page + '\n</body>\n</html>\n')
open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8').write(doc)
shutil.copytree(os.path.join(ROOT, 'assets', 'fonts'), os.path.join(OUT, 'assets', 'fonts'))
shutil.copy(os.path.join(SRC, 'manifest.json'), os.path.join(OUT, 'assets', 'manifest.json'))
for f in ['serve.ps1', 'Start Ireland 2036.bat', 'Preview in Chrome.bat']:
    shutil.copy(os.path.join(SRC, f), os.path.join(OUT, f)); crlf(os.path.join(OUT, f))
shutil.copy(os.path.join(SRC, 'tools', 'prepare-clips.bat'), os.path.join(OUT, 'tools', 'prepare-clips.bat'))
crlf(os.path.join(OUT, 'tools', 'prepare-clips.bat'))
shutil.copy(os.path.join(SRC, 'README.txt'), os.path.join(OUT, 'README.txt')); crlf(os.path.join(OUT, 'README.txt'))
for f in sorted(glob.glob(os.path.join(ROOT, 'assets', 'video', '*'))):
    if f.endswith(('.mp4', '.webm')):
        shutil.copy(f, os.path.join(OUT, 'assets', 'video'))
shutil.copy(os.path.join(SRC, 'CREDITS.txt'), os.path.join(OUT, 'CREDITS.txt')); crlf(os.path.join(OUT, 'CREDITS.txt'))
open(os.path.join(OUT, 'assets', 'audio', 'PUT MUSIC HERE.txt'), 'w').write(
    'Optional: a licensed music track named music.mp3. Without it the show plays its own soft ambient score.\r\n')
open(os.path.join(OUT, 'tools', 'source', 'PUT SOURCE CLIPS HERE.txt'), 'w').write(
    'Source clips named s01.mp4 ... s10.mp4 (any format ffmpeg reads). Then run tools\\prepare-clips.bat.\r\n')
if '--videos' in sys.argv:
    src = sys.argv[sys.argv.index('--videos') + 1]
    for f in glob.glob(os.path.join(src, '*.mp4')) + glob.glob(os.path.join(src, '*.webm')):
        shutil.copy(f, os.path.join(OUT, 'assets', 'video'))
    if os.path.exists(os.path.join(src, 'music.mp3')):
        shutil.copy(os.path.join(src, 'music.mp3'), os.path.join(OUT, 'assets', 'audio'))
z = os.path.join(ROOT, 'dist', 'Ireland2036-Igloo.zip')
with zipfile.ZipFile(z, 'w', zipfile.ZIP_DEFLATED) as zf:
    for base, _, files in os.walk(OUT):
        for f in files:
            full = os.path.join(base, f)
            zf.write(full, os.path.relpath(full, os.path.dirname(OUT)))
print(z, os.path.getsize(z), 'bytes')
