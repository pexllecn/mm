# Ireland 2036: Igloo showcase

A three-minute immersive show for an Igloo room with four walls and a floor. There is no 3D rendering. Real footage of Ireland wraps all four walls as a panorama that turns slowly around the room, and the floor becomes a dark, softly rippling water reflection of it. Scenes change with a liquid-light dissolve. At 1:16 a wave of light crosses the floor and climbs the walls, the floor year counter runs 2026 → 2036, and the footage takes on the 2036 grade. The finale draws the island map across the floor.

`index.html` is the whole show: one WebGL2 shader, no libraries.

## The Igloo package: `igloo/Ireland2036/`

This folder is the complete show, ready to copy to the Igloo PC:
- the show (`index.html`), with bundled fonts, so it runs offline
- the real footage in `assets/video`, as H.264 MP4 plus VP9 WebM (see `CREDITS.txt`)
- `Start Ireland 2036.bat` and `serve.ps1`: a local server at `http://localhost:8036/` with byte-range support, which video seeking needs
- `tools/prepare-clips.bat`: converts replacement footage into both formats
- `README.txt`: Igloo Core Engine setup, running order and operator keys

To download it, use **Code → Download ZIP** on this branch on GitHub, or clone the repo. Then copy `igloo/Ireland2036` to the Igloo PC.

After editing `index.html`, run `python3 tools/build-package.py` to refresh the package (add `--zip` for a zip in `dist/`).

## Footage

Six credited clips are cast into ten 18-second scenes. Each scene's front half plays one segment; the back half plays another moment from the same kind of shot, joined by feathered seams. The floor is a dark water reflection.

| Time | Scene | Footage |
|---|---|---|
| 0:00 | Atlantic edge | Cliffs of Moher, aerial |
| 0:18 | The land | Conor Pass, Dingle, aerial |
| 0:36 | The capital | Dublin quays: Dublin Bus, Convention Centre, Samuel Beckett Bridge |
| 0:54 | Open economy | Docklands, aerial |
| 1:12 | The turn (2036 sweep at 1:16) | The Liffey from above |
| 1:30 | Energy | Atlantic cliffs and sea |
| 1:48 | Transport | City streets from above |
| 2:06 | Housing | Construction and new homes, Grand Canal Dock |
| 2:24 | One nation (map on floor) | Conor Pass valley |
| 2:42 | Together | Cliffs of Moher and O'Brien's Tower |

Credits: Dublin © European Union 2026, European Parliament (CC BY 4.0). Cliffs of Moher, Wiebe de Jager (CC BY-SA 4.0). Conor Pass, Superbass (CC BY-SA 4.0). The adapted clips from the CC BY-SA sources stay under CC BY-SA 4.0.

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
