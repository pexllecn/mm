# Ireland 2036: Igloo showcase

A three-minute real-time immersive piece for an Igloo room with four walls and a floor. It is a single HTML page (`index.html`) that renders a live 3D world into a 360° cube map every frame, then re-projects it for the room. It plays as one continuous camera move, with no slides and no cuts.

## Running order (3:00)

| Time | Act | What the room sees |
|------|-----|--------------------|
| 0:00 | **Today** | Dawn over the Atlantic. Low over live ocean swell, the camera flies at the sea cliffs, climbs the cliff face and crests over O'Brien's Tower. The floor drops away. |
| 0:42 | **Momentum** | Golden hour over the field patchwork into Dublin: the Liffey, the Spire, a harp bridge and the Poolbeg chimneys. |
| 1:22 | **Ireland 2036** | A ring of light sweeps out from the city across the floor and up the walls. The floor year counter runs 2026 → 2036. Offshore wind rises out of the sea, and MetroLink, rail and grid lines light up. New towers and neighbourhoods build, and solar and green roofs appear. |
| 2:20 | **Together** | The camera rises through the cloud deck into an aurora sky. The island map draws itself on the floor, with light beams from Dublin, Cork, Galway, Limerick and Waterford. It closes on *Ambition, delivered together*. |

Headlines repeat on all four walls, so the audience can face any direction.

## Output formats (press `V`)

- **360° Igloo** (default): a 2:1 equirectangular frame. Set the Igloo web/browser layer to 360 equirectangular mapping, so the Igloo software wraps it onto the walls and floor.
- **Walls + floor**: a direct canvas layout. The top band holds Front | Right | Back | Left and the floor sits under Front, with each panel projected for a 6 × 6 × 3 m room and 1.6 m eye height. Use it when the room is mapped by canvas regions instead of 360 mapping.
- **Desk preview**: a normal perspective view for rehearsing on a laptop. Drag to look around.

## Operator keys

`Space` pause/play · `→`/`PageDown` next act · `←`/`PageUp` previous act · `1`–`4` jump to act · `R` restart · `B` or `.` blackout · `A` sound · `F` full screen · `H` hide controls · `Q` render detail (512–1536 px per cube face)

Presentation clickers send `PageDown`/`PageUp`/`.` and work out of the box. The controls hide themselves after about 3 seconds without mouse movement.

## Photography and film

The world is generated in real time. Photoreal **people** need licensed photography or footage. Open **Photography & film** and add one photo or muted MP4/WebM clip (20 MB maximum) to each act. Each one appears on the two side walls during its act, with slow camera motion. Files are saved with the published page, so the Igloo PC picks them up live.

## Facts on screen (check before the visit)

- 5.4 million people; one of the youngest populations in Europe
- National offshore wind targets: 5 GW by 2030, 20 GW by 2040
- MetroLink: airport to city centre by metro

Edit the `CAPTIONS` array in `index.html` to change any wording or timing.
