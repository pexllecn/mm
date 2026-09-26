IRELAND 2036 - IGLOO SHOW PACKAGE
=================================

A three-minute immersive show for an Igloo room (four walls + floor).
Real footage of Ireland wraps all four walls as one seamless panorama and
pools across the floor as a moving reflection. At 1:16 a wave of light sweeps
the room and the show moves into Ireland 2036.


1. ADD THE FOOTAGE (ten clips)
------------------------------
Put one clip per scene in  assets\video  named s01 ... s10.
Use H.264 MP4 (s01.mp4) and/or VP9 WebM (s01.webm). Having both is safest.
3840 px wide (4K) looks best; 1920 px works. 18-20 seconds each, no sound needed.
tools\prepare-clips.bat converts any source clip into both formats.

  s01  0:00  Atlantic dawn   Cliffs of Moher / Wild Atlantic Way, aerial at sunrise
  s02  0:18  The land        Green fields and stone walls, aerial
  s03  0:36  The capital     Dublin streets and people (Grafton St, Temple Bar)
  s04  0:54  Open economy    Docklands and the Liffey at dusk
  s05  1:12  The turn        Night time-lapse of Dublin / light trails
  s06  1:30  Energy          Offshore wind farm, aerial
  s07  1:48  Transport       Train, tram or metro in motion
  s08  2:06  Housing         New homes, construction, modern architecture
  s09  2:24  One nation      Ireland at night / stars / aurora
  s10  2:42  Together        Sunrise over the sea, people looking out

Optional music: assets\audio\music.mp3 (licensed). Without it the show plays
its own soft ambient score.


2. RUN IT IN IGLOO CORE ENGINE
------------------------------
a) Double-click  "Start Ireland 2036.bat"  and leave the window open.
   It serves the show at  http://localhost:8036/
   (Video in a browser needs a web address, not a file path.)
b) In Igloo Core Engine, add a Web / Browser layer with the address
   http://localhost:8036/  and set the layer to 360 (equirectangular) mapping
   across the walls and floor.
c) Click "Start the show" once (this also enables sound), or press Enter.

If your canvas maps walls and floor as separate regions instead of 360,
press V to switch to "Walls + floor": Front | Right | Back | Left across the
top and the floor panel on the right. O rotates the floor panel.
Set the room size and eye height on the start screen.

To rehearse on a laptop: run the .bat, then "Preview in Chrome.bat",
and press V until "Desk preview" (drag to look around).


3. OPERATOR KEYS
----------------
Space pause/play   Right/PageDown next act   Left/PageUp previous act
1-4 jump to act    R restart   B or . blackout   A sound   F full screen
H hide controls    V output format   O rotate floor panel
Presentation clickers (PageDown / PageUp / .) work out of the box.


4. BEFORE THE VISIT
-------------------
- Check every clip plays: the start screen shows "10/10 clips loaded".
- Confirm on-screen facts with EY: 5.4 million people; offshore wind targets
  5 GW by 2030 and 20 GW by 2040; MetroLink airport to city centre.
- Confirm licences for every clip and the music.
