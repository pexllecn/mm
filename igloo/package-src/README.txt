IRELAND 2036 - IGLOO SHOW PACKAGE
=================================

A three-minute immersive show for an Igloo room (four walls + floor).
Real footage of Ireland wraps all four walls as one seamless panorama and
a floor that carries the map of Ireland with a rounded 2026-2036 timeline
over a faint moving film. At 1:16 a line of light climbs the walls and the
show moves into Ireland 2036.


1. THE FOOTAGE (included)
-------------------------
Real footage of Ireland is already in  assets\video  as H.264 MP4 plus
VP9 WebM copies, so it plays in any Chromium-based player, with or without
H.264 support. See CREDITS.txt for sources and licences.

  0:00  Atlantic edge   Cliffs of Moher, aerial
  0:18  The land        Conor Pass, Dingle, aerial
  0:36  The capital     Dublin quays, Dublin Bus, Convention Centre, Samuel Beckett Bridge
  0:54  Open economy    Dublin Docklands, aerial
  1:12  The turn        The Liffey from above - the 2036 sweep starts at 1:16
  1:30  Energy          Atlantic cliffs and sea
  1:48  Transport       City movement along the quays
  2:06  Housing         New buildings and cranes, Grand Canal Dock
  2:24  One nation      Conor Pass valley
  2:42  Together        Cliffs of Moher and O'Brien's Tower

To use higher-resolution or licensed EY footage for any clip, replace the
file with the same name in assets\video (keep both .mp4 and .webm, or use
tools\prepare-clips.bat to make them).

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
top and the floor panel on the right. O rotates the floor in 90 degree steps.
Set the room size and eye height on the start screen.

To rehearse on a laptop: run the .bat, then "Preview in Chrome.bat",
and press V until "Desk preview" (drag to look around).


3. OPERATOR KEYS
----------------
Space pause/play   Right/PageDown next act   Left/PageUp previous act
1-4 jump to act    R restart   B or . blackout   A sound   F full screen
H hide controls    V output format   O rotate floor
Presentation clickers (PageDown / PageUp / .) work out of the box.


4. BEFORE THE VISIT
-------------------
- Check every clip plays: the start screen shows "10/10 clips loaded".
- Keep CREDITS.txt with the show; the footage licences require attribution.
- Confirm on-screen facts with EY: 5.4 million people; offshore wind targets
  5 GW by 2030 and 20 GW by 2040; MetroLink airport to city centre.
- Confirm licences for every clip and the music.
