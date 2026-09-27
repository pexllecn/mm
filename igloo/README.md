# Ireland 2036: Igloo showcase

A three-minute immersive show for an Igloo room with four walls and a floor. There is no 3D rendering. Real footage of Ireland wraps all four walls as a panorama that turns slowly around the room. Scenes change with a liquid-light dissolve. At 1:16 a line of light climbs the walls and the footage takes on the 2036 grade. The floor carries the map of Ireland and Northern Ireland with a rounded 2026 → 2036 timeline for the whole show, over a faint moving film.

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

Six credited clips are cast into ten 18-second scenes. Each scene's front half plays one segment; the back half plays another moment from the same kind of shot, joined by feathered seams. The floor is the film-room floor from `Ireland-2036.html?view=floor`, ported unchanged: the Natural Earth map of Ireland and Northern Ireland, illustrative city connections with moving dots, and the rounded 300° timeline running from 2026 to 2036 over the three minutes. The current scene's film moves faintly underneath it.

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
| 2:24 | One nation | Conor Pass valley |
| 2:42 | Together | Cliffs of Moher and O'Brien's Tower |

Credits: Dublin © European Union 2026, European Parliament (CC BY 4.0). Cliffs of Moher, Wiebe de Jager (CC BY-SA 4.0). Conor Pass, Superbass (CC BY-SA 4.0). The adapted clips from the CC BY-SA sources stay under CC BY-SA 4.0.

## Output formats (`V`)

- **360° Igloo**: 2:1 equirectangular for the Igloo 360 web layer.
- **Walls + floor**: Front | Right | Back | Left across the top, with the floor panel on the right. `O` rotates the floor in 90° steps.
- **Desk preview**: a perspective view for rehearsing. Drag to look around.

Room size and eye height are set on the start screen.

## Sound

A soft ambient score: slow sine and triangle voicings held for a whole act, with a long reverb and no percussive events. Put a licensed `assets/audio/music.mp3` in the package to replace it.

## Keys

`Space` pause · `→`/`PageDown` next act · `←`/`PageUp` previous · `1`–`4` jump · `R` restart · `B`/`.` blackout · `A` sound · `F` full screen · `H` hide controls · `V` output · `O` rotate floor

## `9.html`: the live 3D version, rebuilt

A rework of the original live 3D show (kept unchanged as `7.html`; `6.html` holds the separate Living Atlas upgrade, see `6-VENUE-NOTES.md`). The same three minutes rendered live over the real island instead of footage: terrain and sea-floor depth from Terrain Tiles on AWS, Esri World Imagery draped over it, a physical sky, and cumulus with its shadows on the ground. It needs a WebGL 2 GPU and the network (the map services load at start).

- **Walls**: a slow forward flight from dawn at the Cliffs of Moher to night over Dublin. The sun rises during the opening. Cities light up where the imagery shows built-up ground, in sodium orange, then warm white once 2036 has arrived. The clouds are marched finely wherever a ray meets one, so their edges stay smooth right down to the horizon.
- **Floor**: the island as a lit relief map, drawn per pixel at the room's resolution from the elevation and the imagery, with the relief filtered at every size so it never shimmers or steps. It has the show's own sun, a day–night line that crosses the island at dusk, and city lights at night. The map also carries the illustrative connections from Dublin, the flight so far with the aircraft and the wedge the front wall sees, and the rounded 2026 → 2036 timeline round it. The dial reaches 2036 at 2:46.
- **Floor to walls**: beyond the ring the floor shows the live world under the aircraft, so it meets the walls without a break. A cove line of light runs along the join. Each year's line leaves its mark on the ring and runs straight to the nearest wall, square to it, then up the wall. At every chapter a sweep of light spreads from the middle of the floor as a circle, squares itself to the room as it reaches the walls, and climbs all four walls together as one level line, with a band of shimmering light in its wake. The 2036 sweep carries the new grade up the walls.
- **Opening**: the ring draws itself, then a sweep leaves it and the world rises up the walls behind the light.
- **Finale**: the map turns to the aircraft's heading, locks onto the real island 200 km below at the same scale, and dissolves into it, with the coast drawn in light under the aurora.

### Real 3D cities (optional)

With a key, the show streams Google's Photorealistic 3D Tiles: photogrammetry of real buildings and ground, far sharper than the satellite layer. Every tile is placed vertex by vertex at its true latitude, longitude and height above sea level, so it sits exactly on the show's elevation, sea, cloud shadows and floor map. The tiles are relit for the show's hour: dawn light, cloud shadows, street light and lit windows at night, sodium before 2036 and white after. Where the tiles are showing, the floor carries Google's attribution, as their terms require.

- A **Google Maps Platform API key** with the **Map Tiles API** enabled, or a **Cesium ion access token** (the same Google tiles through Cesium ion, asset 2275207).
- Paste it into **Real 3D cities** on the start screen (it is kept in this browser only), or open the show with `?gkey=<key>`. It is never written into the page, so never commit one.
- A venue with its own 3D Tiles set can open the show with `?tileset=<url of tileset.json>`.
- Without a key the show runs as before on its own terrain and landmarks.

### Picture quality

The show starts at its highest quality: the Ultra imagery set, cube faces sized to the output (2048 to 4096 px each, multisampled), and the canvas at the display's full pixel density. `Q` steps the cube size by hand. **Lower detail automatically** in the control panel's Look tab lets the show drop a size if the GPU cannot hold the frame rate; it is off by default.

Operator controls (`C`): **Look → Light lines** sets the cove line, year lines and sweeps together; the **Floor** tab fits the dial. Enter the real room size on the start screen so the light lines meet the walls.

## Facts on screen (confirm before the visit)

- 5.4 million people; one of the youngest populations in Europe
- Offshore wind targets: 5 GW by 2030, 20 GW by 2040
- MetroLink: airport to city centre by metro
