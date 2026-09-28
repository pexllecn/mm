# Ireland 2036: cinematic rendering update

The active experience is the repository root `index.html`, mirrored at `igloo/9.html`. The earlier `6.html`, `7.html` and film package remain separate versions.

## Start and present

Serve the repository over HTTP. Open the root URL, or `igloo/9.html`.

- `?view=desk`: rehearsal view, with smooth drag, scroll zoom and double-click to reset.
- `?view=igloo`: the existing 360° projection mapping.
- `?view=walls`: the existing packed front, right, back, left and floor output.

The first visit opens the desk view. The chosen output persists on that device. **Set up the room** contains the room dimensions, output and satellite source detail. Enter the actual dimensions before calibration. The start button unlocks after map loading and shader warm-up.

**Space** pauses or resumes. **1–4** select an act; **J** opens the ten chapters. The timeline supports pointer, touch and keyboard seeking. **G** toggles seam calibration. **C** opens controls, **B** blacks out, **F** toggles full screen, **H** hides controls and **O** rotates the floor. Standard button keyboard activation is preserved. Editing a text or numeric field does not trigger show shortcuts.

All visual animation freezes while paused, including water, clouds and lighting. Moving to another browser tab pauses the show. The three-minute timeline uses elapsed time, so slow frames do not extend the presentation. The existing continuous replay remains.

## Narration

The supplied female and male recordings are bundled as high-quality mono MP3s, totalling 3.81 MB. Choose a voice on the opening screen, or open **Voice** in the playback bar / **Controls → Sound**. Female is the initial default. **N** toggles narration; **A** toggles music independently.

- Female / Male / Off, independent voice level, and fine timing adjustment from −1 to +1 second.
- Automatic music ducking, with an adjustable music level under speech. Muting narration restores the music level.
- Ten cues per recording, cut at sentence pauses and aligned to the existing chapters. Every part of each recording is retained. The voice runs at its original pitch and speed; the extra show time becomes quiet space between chapters.
- Play, pause, chapter changes, timeline scrubs, restart and the continuous loop all follow the same presentation clock. Changing voices selects the equivalent position in the other voice's chapter.
- Audio is decoded before use and scheduled on the Web Audio clock. Brief gain ramps prevent clicks on seeks. The player corrects clock drift beyond 120 ms rather than changing the speaker's pitch.
- Voice and mix preferences persist on the device, are included in **Copy as JSON / Paste JSON**, and can be reset independently.
- If a recording cannot load, the picture remains available and the Sound panel shows a retry button. If the browser blocks audio, start/resume or a voice-selection gesture unlocks it.

| Visual chapter | Cue begins | Female source | Male source |
| --- | ---: | ---: | ---: |
| Atlantic dawn | 0:01.00 | 0.00–14.85 s | 0.00–14.65 s |
| The coast | 0:22.25 | 14.85–26.96 s | 14.65–26.20 s |
| The land / people | 0:40.25 | 26.96–40.96 s | 26.20–39.75 s |
| Open economy | 1:00.00 | 40.96–58.52 s | 39.75–57.05 s |
| The turn | 1:18.25 | 58.52–64.16 s | 57.05–62.50 s |
| Energy | 1:34.00 | 64.16–81.97 s | 62.50–79.85 s |
| Transport | 1:52.00 | 81.97–96.30 s | 79.85–93.30 s |
| The capital | 2:08.00 | 96.30–109.34 s | 93.30–105.82 s |
| Housing | 2:24.00 | 109.34–123.70 s | 105.82–119.80 s |
| Together | 2:42.00 | 123.70–138.00 s | 119.80–133.68 s |

The cue sheet lives in `igloo/assets/voiceover.js`. Replacing a recording requires updating its duration and source boundaries. Editing visual captions does not synthesize or alter the supplied speech. Final room tuning should include speaker output latency as well as projector timing.

## Rendering changes

- Native physical output pixels, bounded by the GPU's dimension limit and a 33.55-megapixel framebuffer budget. DOM controls and the floor's analytical lines are independent of world cubemap quality.
- A separate, linearly reconstructed cloud pass. Clouds no longer run the full raymarch at the terrain framebuffer's resolution. Cloud lighting, terrain lighting, tone mapping and room mapping still share the same time and atmosphere.
- Two-sample scene antialiasing where supported, mip-filtered cubemaps, smooth satellite filtering, and eight bloom texture reads per output pixel instead of thirty.
- Cached atmosphere lookup updates. Paused frames and the pre-show scene are held; dragging a paused view can reuse the cached world. HUD updates run at about 8 Hz instead of writing layout on every rendered frame.
- Preloaded caption textures and a shader warm-up before presentation.
- A measured 60 fps quality governor, rather than the previous 28 fps fallback. It steps down after sustained overload, uses a cooldown to avoid oscillation, and only steps back up with sustained GPU headroom when a GPU timer is available.
- **Controls → Render → Maximum detail** locks the highest supported world tier, up to 2048 pixels per cube face. **Q** cycles world detail. Satellite source detail is selected separately because downloading more source data and rendering more pixels solve different problems.
- No randomized future block towers. Real satellite settlements and night lighting remain. Wind geometry uses representative modern proportions; future site layouts and the connections remain illustrative.
- The existing geographic journey, circular 2026–2036 floor timeline, room-coordinate light transitions, soundtrack, content editor and finale remain.

## Media

Original-resolution local MP4, WebM and image files can be selected without a hosted media service. They use object URLs, stay on the device, and must be selected again after reopening. Ordinary footage is cropped to each wall's aspect ratio without distortion. Check **360° equirectangular** only for a genuinely spherical source. Repeating conventional footage around the room does not create a true 360° recording.

The older optional hosted storage integration retains its 20 MB limit. Local files do not have this upload limit. Decoding very high resolution footage still depends on hardware and codec support.

## Venue validation

60 fps is the target, not a hardware-independent guarantee. No source-resolution increase can invent missing satellite detail. This remains a satellite terrain visualization, not photogrammetry or a live-action reconstruction.

Use **Controls → Render** to read measured fps, 95th-percentile frame time, output size, world/cloud resolution, GPU timing when supported, draw calls and triangle counts. **Save performance report** exports the current sample window as JSON. Frame intervals include real stalls; they are not capped to produce an artificially high fps number.

On the actual Igloo PC, run the full three minutes at the final projector output, including energy, dusk, night and the finale. Start with **Adaptive 60**, close other GPU-heavy applications, and use **G** to check the floor/wall seam after setting room dimensions and floor rotation. Optical continuity still depends on projector warp, blend, alignment and black levels. This change does not add synchronization between separate computers.

Geographic services and the pinned Three.js CDN are required on first load. Local fonts are bundled. This is not a self-contained offline map package. Failed map requests time out with a retry path; GPU context loss offers a reload path.

## Automated checks

`node --test tests/*.test.cjs` covers native sizing and GPU limits, honest frame measurements including stalls, adaptation/cooldown/recovery behavior, JavaScript syntax and parity between the two entry points. Narration tests cover cue boundaries, clock drift, pause/resume, seek, switching, silent gaps, mute, ducking, settings validation and failed-download recovery.

`tests/browser.cjs` exercises the production shaders and presentation UI in Chromium with software WebGL: loading/warm-up, play, frozen pause, chapter seeking, packed room output, seam calibration, local original-resolution media, mobile layout and finale, plus decoding both supplied recordings, narration playback/seek/switch/restart, ducking, timing adjustment, mute and responsive Sound controls. It uses small synthetic map tiles and a reduced geographic dataset to keep CI deterministic. Its screenshots validate layout and shader execution, not the look of the real satellite data or the Igloo's frame rate.
