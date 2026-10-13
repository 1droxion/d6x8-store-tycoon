# D6X8 — City graphics edition

This update builds on the existing Three.js browser game. It adds original procedural art and requires no new paid service or remote asset downloads.

## Added

- City overview camera: C on desktop or City view on phones.
- Pan with WASD/arrows, movement buttons or a drag on the scene. Mouse wheel or +/− buttons zoom; arrow buttons rotate; Find me centers the camera on the player.
- Switching camera modes keeps the player in place. Walking, owner view, driving, phone, taxis and business systems remain available.
- Framed windows, floor bands, rooftop equipment, storefront awnings and shallow planted flower boxes throughout the existing and streamed buildings.
- Branching trees with fuller multicolored canopies, curbs, landscaped verges, rounded vehicle bodies, mirrors, grilles and rotating wheel rims.
- Windows glow at night. Existing day/night, weather and service staff remain active.
- Performance / Balanced / High graphics settings. Phones start in Performance mode.

## Fixes and optimization

- Camera-attached delivery geometry is excluded from static batching.
- Rigid character parts are merged by material; jointed arms and legs remain animated. Owned merged geometry is disposed when temporary characters leave.
- Static beveled geometry is now included in the city batching pass.
- Aerial controls do not walk or drive the physical character. Vehicles stop when entering the overview.
- The crossing pedestrian starts away from the player's face.
- Multiplayer requests reject null and primitive JSON bodies.

## Run

From this project folder:

    python -m http.server 8080 --directory public

Open http://localhost:8080/game/index.html. Python's simple server supports single-player only. Hosted multiplayer still needs the Cloudflare D1/authentication setup described in START-HERE.txt and README.md.

## Validation and limits

Existing economy, business, taxi, traffic, staff, saved-state and scene tests are included. The smoke test also covers aerial pan without player movement, zoom limits, rotation, recenter, camera return, graphics cycling, night windows and held cargo.

This remains a browser prototype. The multiplayer feature is shared player presence, not a synchronized multiplayer economy; its server cap is 64. Real ads, purchases and cloud economy are not integrated. This ZIP does not contain an Android APK or iOS IPA. Real phone GPU performance and live hosted multiplayer need separate testing before release. No claim of GTA/PUBG/SimCity-equivalent graphics or universal device compatibility is made.

### Checks completed for this update

- Economy and business regression suites: passed.
- Two-user mocked API suite, including malformed request bodies: passed.
- Scene simulation suite: passed, including camera, gamepad, staff, taxi and saved-state regressions.
- Headless Chromium with software WebGL: desktop walking, city overview and camera return rendered without page errors.
- 390 × 844 touch viewport: Performance mode, visible city button, camera controls within the viewport, and return to walking passed without page errors. This is emulation, not a physical iPhone/Android test.
- Desktop scene draw calls in the test fell from about 3,000 to 2,247 after rigid-avatar merging; the touch test measured 1,247. These are scene counters, not a guaranteed frame rate or device benchmark.
- Full Vinext production build and live D1 deployment were not performed in this file-update task.


## Second art pass

Stronger green ground and foliage, less near-distance fog, reduced ambient/reflection brightness, saturated car paint, gabled roofs with fascia/seams, porches, shutters, front glazing and apartment balconies. People have rounded heads, eyes, hair and cylindrical arms on the existing animated rig. Cars have shaped lower-body meshes, sloped hood pieces and metallic paint.

The live build also now includes the camera integration files omitted from the previous deployment. Automated simulation and production-build validation are used for this pass. Physical-device performance and visual QA for this second art pass remain pending.
