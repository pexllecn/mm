# Ireland 2036 · Living Atlas

This upgrade applies to `6.html`. It does not replace the separate film package or `index.html`.

## What changed

- Real satellite imagery and measured relief on a separately cached 4096 × 4096 floor atlas.
- A 330° circular timeline with eleven year marks, 2026–2036. It reaches 2036 at 2:42 and holds through the finale.
- Light paths evaluated in physical room metres. Their positions, colours and phases continue over the floor-to-wall boundary and around adjacent walls.
- Native display pixel sizing (up to device pixel ratio 2 and a 32-megapixel framebuffer budget), mip-filtered geographic rendering, restrained bloom and a neutral photographic grade.
- Removed randomly placed box buildings and the repetitive thick cloud bank, and reduced the exaggerated turbine geometry to representative real-world proportions. The geographic world is a satellite-based visualization, not photogrammetry or live-action film. Future infrastructure remains illustrative.
- Preserved the camera journey, four acts, ten chapters, room mapping, operator controls and soundtrack, with quieter default sound.
- Frozen visual time when paused. Playback duration is based on elapsed time rather than frame count.
- Full-resolution local video/image inputs. Mark **360° equirectangular** only for footage actually captured/stitched in that format. Ordinary footage uses undistorted cinema views per wall; it cannot create a genuine 360° scene. Local files need reselecting after reopening.

## Run and align

1. Serve this repository over HTTP, then open `/igloo/6.html` in a WebGL2 browser. Internet is needed for Three.js, fonts, elevation and imagery. This file is not an offline package.
2. Set the actual front-wall width, side-wall depth, wall height and eye height before starting. Start with **High**. **Ultra** requests more source tiles and uses more graphics memory. The tier buttons unlock after loading; changing the tier reloads the page.
3. Choose **360° Igloo** for spherical mapping, **Walls + floor** for the existing packed atlas, or **Desk preview** to inspect by dragging. The packed atlas is Front, Right, Back, Left, then Floor; unused pixels under the wall strip are black by design.
4. Start the show. Press **G** or **Check seams**. Match the coloured sectors and metre-spaced contours at all four floor edges and wall corners. Correct projector layout/warp first. Press **G** again to return to the show.
5. **O** rotates the floor world in quarter turns; the floor atlas stays readable. Floor fit controls adjust margin, scale and keystone. Changing those controls also changes where the projected seam lands, so repeat calibration.
6. Adjust **Floor-to-wall light** under Controls → Look. **Detail locked** prevents automatic cube-resolution reduction. Toggle to adaptive detail only if the venue GPU cannot hold a comfortable frame rate. **Q** cycles cube detail manually.
7. Rehearse the full three minutes on the actual output resolution. Check the frame-rate and framebuffer readout, all chapter transitions, **Space** pause, **B** blackout, **R** restart and sound level. Hide controls with **H** for presentation.

The renderer can maintain mathematical continuity; final optical continuity depends on projector warping, edge blending, black levels and calibration in the room. The same page drives the packed walls and floor together. This update does not add cross-computer synchronization.

Source credits are retained on the start screen. No new footage or imagery rights are granted by this change.

## Verification

JavaScript syntax and diff whitespace checks pass. Browser verification uses Chromium with software WebGL2. The full High geographic dataset loaded (island 69 m/px; Dublin 5.2 m/px; Clare 5.7 m/px). Software rendering of that dataset exceeded a screenshot timeout. Shader and interaction checks use the same application with lower source LOD and a 512-pixel cubemap in the test harness only. Production High/Ultra settings are unchanged. These checks do not establish the frame rate or optical alignment on the Igloo GPU/projectors.
