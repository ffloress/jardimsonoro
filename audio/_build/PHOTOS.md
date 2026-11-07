# Photo slots for /audio

Each advert on the page loads `img/<name>.jpg`. Until that file exists, the plug-in screenshot is shown in its place.

**Format:** landscape 3:2 (for example 2400×1600), JPEG at about 80% quality, ideally under 400 KB.
**Style for every photo:** a realistic photograph, as if from a 1980s hi-fi magazine advert. Use natural light or flash, warm film colour (Kodachrome or Portra), light grain and a serious composition. The scene is absurd, but it is photographed with a straight face. Leave space around the subject.

| File | Headline it supports | Scene |
|---|---|---|
| `tyrell80.jpg` | It took four men to carry it upstairs. Now it takes one click. | Four removal men in overalls straining to carry an enormous wooden crate up a narrow tenement staircase. |
| `obxtra.jpg` | Three brothers. Same family. Very different tempers. | Identical triplet brothers in matching 1980s suits on a sofa. One is furious, one is calm and one is smug. |
| `dxdx7.jpg` | You've heard this bell on a thousand records. | A brass service bell on an empty marble hotel reception desk, with a hand about to strike it. Dramatic side light. |
| `youth106.jpg` | Born in 1984. Still out every night. | A woman in her seventies roller-skating down a seaside boardwalk at sunset, arms outstretched, in a 1980s windbreaker. |
| `zynabre.jpg` | Twenty years of sounds were waiting behind it. | A single wooden door standing on its own in an open wheat field, slightly ajar, with light pouring through the gap. |
| `buenovox.jpg` | "Even he sings in tune now." | A dog howling earnestly into a vintage studio microphone in a wood-panelled recording booth. |
| `muchovox.jpg` | He came in alone. He left as a choir. | One man singing between two facing mirrors, his reflection repeating into the distance. |
| `mutante.jpg` | Your guitar, underwater. Your amplifier, perfectly dry. | An electric guitar resting on the bottom of a sunlit swimming pool, with caustic light rippling across it. |
| `th0nk3000.jpg` | Nobody knows what happens next. Not even us. | A china dinner plate frozen mid-shatter above a set dinner table, with fragments scattering and a high-speed flash look. |
| `magnitude.jpg` | It lifts the quiet. It leaves the loud alone. | A single hot-air balloon rising silently over a misty valley at dawn. |
| `sunbliss.jpg` | Loud is a lovely place to spend the summer. | Studio headphones lying on a striped beach towel next to a bottle of sun cream, in harsh midday sun. |
| `liveremote.jpg` | Press record from the other end of the house. | A cellist playing alone at the far end of a very long, empty corridor, with a phone propped on the floor beside them. |

**Sources:** stock libraries such as Unsplash and Pexels (free licences allow this use), your own photos, or an image generator. If you change a scene, update the headline and the `alt` text in `index.html` too.

## Current images and print treatment

The current photos were generated with OpenAI `gpt-image-2` from the scenes above, at 1536×1024. They were then run through `print-look.py`, which gives them the look of a 1980s magazine page: soft-focus highlight glow, a faded warm grade with lifted inky blacks, slight ink misregistration, a fine 45° halftone screen, film grain and a vignette.

To treat a new photo the same way (requires numpy and Pillow):

    python3 print-look.py original.png <name>.jpg
