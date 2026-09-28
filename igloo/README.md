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

- **Walls**: a slow forward flight from dawn at the Cliffs of Moher to night over Dublin. The sun rises during the opening. Cities light up where the imagery shows built-up ground, in sodium orange, then warm white once the 2036 wave has passed. The world is rendered through 4× multisampled cube faces and filtered for the room's own pixel size, with a round bloom.
- **Floor**: the island as a lit relief map, drawn per pixel at the room's resolution from the elevation and the imagery (no canvas is re-uploaded while the show runs). It has the show's own sun, a day–night line that crosses the island at dusk, and city lights at night. The map also carries the illustrative connections from Dublin, the flight so far with the aircraft and the wedge the front wall sees, and the rounded 2026 → 2036 timeline round it. The dial reaches 2036 at 2:46.
- **Floor to walls**: beyond the ring the floor shows the live world under the aircraft, so it meets the walls without a break. A cove line of light runs along the join. Each year sends a line of light from its mark on the ring out across the floor and straight up the wall. Each caption is preceded by a stem of light from the ring to where its words appear. The 2036 wave leaves Dublin on the map, crosses the floor and climbs the walls.
- **Opening**: the white floor opens from the centre behind a rim of gold light, the ring draws itself, lines of light come down the walls and run in to the ring, and the world comes down the walls from the top, the way the land falls away beneath a climbing aircraft: we are going up.
- **Finale**: the map turns to the aircraft's heading, locks onto the real island 200 km below at the same scale, and dissolves into it, with the whole coast drawn in light under the aurora.
- **Welcome page**: **Open the welcome** on the start screen puts the room into a waiting state: dark walls, a soft cove glow, motes of light drifting down the walls, the floor white with the Irish harp in gold (`assets/harp.svg`, a vector trace of the emblem, upright for someone facing the feature wall), and on the feature wall (wall 2 by default) the EY mark drawing itself in light over "Fáilte · Welcome · Taoiseach Micheál Martin · Welcome to Wilton Park". Press `Space` when the guest is in place: the page fades away as the ring begins to draw, and the show plays. `W` brings the welcome back between guests. The wording is editable under **Controls → Content**; the wall under **Controls → Floor → Feature wall**.
- **Running order** (2:42, then it holds; it does not loop): 0:00 the Cliffs of Moher at dawn and our people · 0:16 "The next ten years start right now": a flash of light, and the flight jumps high above Ireland as the 2036 wave leaves Dublin · 0:34 energy · 0:52 sustainability · 1:06 transport · 1:22 Dublin · 1:38 health (HSE) · 1:54 housing · 2:10 the finale · 2:22 outro · 2:36 thank-you page. The flight keeps its own authored clock and is mapped onto the show clock (`WARP` in the script): level at the Cliffs, jumping ahead under the flash, slower through energy and sustainability, and through Dublin at night and health.
- **Outro and thank-you page**: the island map lifts off the floor, slides across it and folds up onto the feature wall (wall 2), then the opening plays in reverse, the white closing in over the floor from the walls to bring the harp back, and the map gives way to a thank-you page in the style of the welcome: the EY mark draws itself in again over "Go raibh maith agat · Thank you · Taoiseach Micheál Martin · Thank you for your visit". The show holds there. `W` returns to the welcome page for the next guest; `R` plays the show again. The wording is editable under **Controls → Content**.
- **Rendering**: every pixel is drawn at the display's own physical resolution (Retina and 4K included). The desk preview renders the world once, straight at the screen; the 360° and walls + floor outputs use a cube sized to the output instead of a fixed 2048, resampled into images aligned with the output. Terrain height, slope and sky visibility are baked once into a filtered, mipmapped texture; cloud and aurora are marched at half resolution and laid over with a smooth filter; bloom is a dual-filter chain that wraps round the room. A governor measures GPU time and trims only the world's render scale (never the map, lines or lettering) to hold 60 fps; on 120/144 Hz screens the show renders every second refresh so frames arrive evenly. `Q` cycles automatic / 100 / 85 / 70 / 55 % world detail.
- **Voiceover**: the supplied female reading (`assets/voice/voice-female.mp3`), cut at its pauses into phrases that are cued to the captions, so it stays in step through pauses, skips and scrubbing; the music dips under it. **Controls → Sound** turns it on or off and sets the voice level, how far the music dips, and a timing nudge. `A` mutes all sound.
  - Two chapters have no line in that reading yet. Record them in the same voice and tone and save them beside it; each plays on its cue as soon as the file is there (up to 11 seconds each):
    - `assets/voice/voice-sustainability.mp3` (at 0:52.8): *"And we are building a cleaner, greener Ireland: halving our emissions by 2030, on our way to a climate-neutral nation by 2050."*
    - `assets/voice/voice-health.mp3` (at 1:38.6): *"Our health service is changing too. Through Sláintecare, the HSE is bringing care closer to home, for every generation."*
- **Operator bar**: a scrubbable timeline with act and caption marks (hover shows the time and caption), play, restart, output, sound, footage, controls and full screen. In the desk preview, drag to look (with momentum), scroll to zoom, double-click to reset.
- **Music**: the supplied track, `assets/audio/music.mp3` (3:39), played from the start of the show in step with the show clock, so seeks and pauses keep it in time. It is mastered loud, so it is trimmed to sit under the voice and dips further while she speaks; on the thank-you page it plays on and fades away. Replace the file to change the music. **Controls → Sound → Music level** sets its volume. There are no sound effects.

Operator controls (`C`): **Look → Light lines** sets the cove line, year lines and caption stems together; the **Floor** tab fits the dial. Enter the real room size on the start screen so the light lines meet the walls.

## Facts on screen (confirm before the visit)

- 5.4 million people; one of the youngest populations in Europe
- Offshore wind targets: 5 GW by 2030, 20 GW by 2040
- MetroLink: airport to city centre by metro
- Climate: emissions halved (51%) by 2030 and climate neutrality by 2050 (Climate Action and Low Carbon Development (Amendment) Act 2021)
- Health: Sláintecare, the HSE's reform programme for universal healthcare delivered closer to home
