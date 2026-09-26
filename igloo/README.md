# Ireland 2036: Igloo showcase

A three-minute immersive show for an Igloo room with four walls and a floor. There is no 3D rendering. Real footage of Ireland wraps all four walls as one seamless mirrored panorama that drifts around the room. The same footage pools across the floor as a rippling, slowly swirling reflection. Scenes change with a liquid-light dissolve. At 1:16 a wave of light crosses the floor and climbs the walls, the floor year counter runs 2026 → 2036, and the footage takes on the 2036 grade. The finale draws the island map across the floor.

`index.html` is the whole show: one WebGL2 shader, no libraries.

## Package for the Igloo PC

`python3 tools/build-package.py` builds `dist/Ireland2036/` and `dist/Ireland2036-Igloo.zip`. The package contains:
- the show, with bundled fonts, so it runs offline
- `Start Ireland 2036.bat` and `serve.ps1`: a local server at `http://localhost:8036/` with byte-range support, which video seeking needs
- `tools/prepare-clips.bat`: converts source clips to 4K H.264 MP4 plus VP9 WebM
- `README.txt`: Igloo Core Engine setup and the shot list

Pass `--videos DIR` to copy `s01`–`s10` `.mp4`/`.webm` (and `music.mp3`) into the package.

## Footage (ten clips, about 18 s each)

| Scene | Time | Shot |
|---|---|---|
| s01 | 0:00 | Cliffs of Moher / Wild Atlantic Way, aerial at sunrise |
| s02 | 0:18 | Green fields and stone walls, aerial |
| s03 | 0:36 | Dublin streets and people |
| s04 | 0:54 | Docklands and the Liffey at dusk |
| s05 | 1:12 | Night time-lapse of Dublin (2036 sweep at 1:16) |
| s06 | 1:30 | Offshore wind farm, aerial |
| s07 | 1:48 | Train, tram or metro in motion |
| s08 | 2:06 | New homes and construction, aerial |
| s09 | 2:24 | Ireland at night / stars / aurora (map on floor) |
| s10 | 2:42 | Sunrise over the sea |

Clips come from `assets/manifest.json` in the package, or from the **Footage library** on the published page (MP4/WebM, 20 MB each).

## Output formats (`V`)

- **360° Igloo**: 2:1 equirectangular for the Igloo 360 web layer.
- **Walls + floor**: Front | Right | Back | Left across the top, with the floor panel on the right. `O` rotates the floor panel.
- **Desk preview**: a perspective view for rehearsing. Drag to look around.

Room size and eye height are set on the start screen.

## Sound

A soft ambient score: slow sine and triangle voicings held for a whole act, with a long reverb and no percussive events. Put a licensed `assets/audio/music.mp3` in the package to replace it.

## Keys

`Space` pause · `→`/`PageDown` next act · `←`/`PageUp` previous · `1`–`4` jump · `R` restart · `B`/`.` blackout · `A` sound · `F` full screen · `H` hide controls · `V` output · `O` rotate floor

## Facts on screen (confirm before the visit)

- 5.4 million people; one of the youngest populations in Europe
- Offshore wind targets: 5 GW by 2030, 20 GW by 2040
- MetroLink: airport to city centre by metro
