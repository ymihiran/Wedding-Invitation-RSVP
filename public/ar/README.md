# WebAR assets

Place compiled MindAR files and optional media here. Nothing in these folders is required except `targets.mind` before guests can track the physical invitation.

## targets.mind

Compiled image target for the printed wedding invitation.

1. Export the final invitation as a high-quality JPG or PNG.
2. Open the [MindAR Image Target Compiler](https://hiukim.github.io/mind-ar-js-doc/tools/compile).
3. Upload **one** image (this becomes target index `0`).
4. Compile, download, and rename the file to `targets.mind`.
5. Put it at `public/ar/targets.mind` so the app can load `/ar/targets.mind`.

Do not fabricate this file. Tracking will not work until the real invitation image is compiled.

## models/

Optional `.glb` / `.gltf` models for later. The first version uses procedural Three.js geometry instead.

## textures/

Optional image textures. Sparkles and petals are generated in code.

## videos/

Optional muted HTML5 video overlay. If you add `public/ar/videos/story.mp4`, it appears after the invitation is detected. Leave this folder empty to skip video.

## images/

Optional stills (for example a photo of the printed card used while compiling the target). Not loaded by the AR scene automatically.
