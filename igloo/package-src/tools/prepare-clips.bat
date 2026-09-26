@echo off
rem Converts your source clips into the two formats the show plays.
rem 1. Install ffmpeg (https://www.gyan.dev/ffmpeg/builds/) so "ffmpeg" works in a command prompt.
rem 2. Put source clips in tools\source, named like the file they replace (e.g. 03-atlantic-energy.mov).
rem 3. Double-click this file. Results go to assets\video. Takes a few minutes per clip.
cd /d "%~dp0"
if not exist source ( echo Put your clips in tools\source first. & pause & exit /b 1 )
for %%F in (source\*.*) do (
  echo Preparing %%~nF ...
  ffmpeg -y -hide_banner -loglevel error -i "%%F" -t 20 -an -vf "scale=3840:-2:flags=lanczos,fps=30,format=yuv420p" -c:v libx264 -profile:v high -level 5.1 -preset slow -crf 18 -maxrate 45M -bufsize 90M -g 60 -movflags +faststart "..\assets\video\%%~nF.mp4"
  ffmpeg -y -hide_banner -loglevel error -i "%%F" -t 20 -an -vf "scale=3840:-2:flags=lanczos,fps=30,format=yuv420p" -c:v libvpx-vp9 -b:v 0 -crf 28 -row-mt 1 -tile-columns 2 -g 60 -deadline good -cpu-used 2 "..\assets\video\%%~nF.webm"
)
echo Done. Clips are in assets\video.
pause
