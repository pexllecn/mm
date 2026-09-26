# Ireland 2036: Igloo showcase

A three-minute real-time immersive piece for an Igloo room with four walls and a floor. It is a single HTML page (`index.html`) that renders a live 3D world into a 360° cube map every frame, then re-projects it for the room. It plays as one continuous camera move, with no slides and no cuts.

## How it works

The show is ten 18-second scenes, each built around one stock clip. Each clip wraps all four walls as one seamless mirrored panorama that drifts slowly around the room. On the floor it becomes a rippling reflection that swirls toward the centre. Scenes change with a liquid-light dissolve. At 1:16 a wave of light sweeps across the floor and climbs the walls. The floor year counter runs 2026 → 2036, and the footage takes on the 2036 colour grade, a holographic grid and rising light. The finale draws the island map across the floor.

A scene with no clip falls back to the live 3D world, so the show always runs end to end.

| Time | Scene | Clip to use |
|------|-------|-------------|
| 0:00 | Atlantic dawn | Cliffs of Moher or Wild Atlantic Way, aerial at sunrise |
| 0:18 | The land | Green fields and stone walls, aerial |
| 0:36 | The capital | Dublin streets and people |
| 0:54 | Open economy | Docklands and the Liffey at dusk |
| 1:12 | The turn (2036 sweep at 1:16) | Night time-lapse of Dublin |
| 1:30 | Energy | Offshore wind farm, aerial |
| 1:48 | Transport | Train, tram or metro in motion |
| 2:06 | Housing | New homes and construction, aerial |
| 2:24 | One nation (map on floor) | Ireland at night, stars or aurora |
| 2:42 | Together | Sunrise over the sea |

Add clips in **Footage library**: MP4 (H.264) or WebM, about 1920 px wide, 20 MB maximum each.

## Output formats (press `V`)

- **360° Igloo** (default): a 2:1 equirectangular frame for the Igloo 360 layer.
- **Walls + floor**: a direct canvas with Front | Right | Back | Left walls across the top and the **floor panel on the right**. `O` rotates the floor panel in 90° steps to match the room.
- **Desk preview**: a perspective view for rehearsing. Drag to look around.

Set the room size and eye height on the start screen, so wall and floor footage line up with the physical room.

## Operator keys

`Space` pause/play · `→`/`PageDown` next act · `←`/`PageUp` previous act · `1`–`4` jump to act · `R` restart · `B` or `.` blackout · `A` sound · `F` full screen · `H` hide controls · `O` rotate floor panel · `Q` 3D detail (512–1536 px per cube face)

Presentation clickers send `PageDown`/`PageUp`/`.` and work out of the box. The controls hide themselves after about 3 seconds without mouse movement.

## Facts on screen (check before the visit)

- 5.4 million people; one of the youngest populations in Europe
- National offshore wind targets: 5 GW by 2030, 20 GW by 2040
- MetroLink: airport to city centre by metro

Edit the `CAPTIONS` array in `index.html` to change any wording or timing.
