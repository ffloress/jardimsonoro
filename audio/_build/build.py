#!/usr/bin/env python3
"""Generates /audio/index.html, /audio/ads/index.html and /audio/ads/<repo>/index.html.

Edit the PLUGINS list below, then run:  python3 audio/_build/build.py
(The _build folder is ignored by GitHub Pages/Jekyll, so it is not published.)
"""
import html, json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # .../audio
OWNER = "nagualcode"
SITE = "https://jardimsonoro.com/audio/"

CATS = [  # key, label, colour token
    ("synth", "Synthesizers"),
    ("vocal", "Vocals"),
    ("fx", "Effects"),
    ("master", "Mastering"),
    ("tool", "Studio tools"),
]
CAT_LABEL = dict(CATS)

PLUGINS = [
    dict(repo="apolo9", name="Apolo9", cat="synth", origin="", year="",
         kind="Organismic synthesizer", formats="AU · VST3 · CLAP",
         short="An organismic synthesizer, modelled from a DIY circuit board: eight voices played through your skin.",
         about=["Apolo9 is a circuit-level model of an \u201corganismic\u201d synthesizer, the kind of experimental DIY instrument tinkerers build from logic chips and touch plates. Each of its eight voices is a CD4093 logic gate used as a Schmitt-trigger oscillator, integrated exactly between threshold crossings with the real timing capacitors. The envelopes are a transistor charging a capacitor through the player's skin, so how hard and how long you touch shapes the attack.",
                "Everything leans on everything: the envelopes bend the pitch, the pairs frequency-modulate each other, the oscillators pull into lock through the shared power rail, and TOTAL FB turns the whole instrument into one feedback loop. The two PT2399 delay chips are simulated bit by bit, so long delays hiss and grind as they do on the hardware. It ships with nineteen presets and a red panic button."],
         ad=dict(layout="a", headline="It listens to your skin. Then it does what it likes.",
                 alt="A hand resting on two copper plates on a dark circuit board, the plates glowing faintly",
                 body=["Most synthesizers wait for instructions. This one waits for a finger. Touch two copper plates and your skin closes the circuit; press harder and the voice blooms faster.",
                       "Apolo9 models the board itself: eight logic gates abused as oscillators, envelopes that bend the pitch, voices that pull each other into lock, and two delay chips simulated bit by bit.",
                       "Nothing on it is in tune. Everything on it is alive."],
                 cap="Eight sensors, eight voices, one organism.", what="Organismic synthesizer from the world of experimental DIY circuits.")),
    dict(repo="tyrell80", name="Tyrell80", cat="synth", origin="Yamaha CS-80", year="1977",
         kind="Polyphonic synthesizer", formats="AU · VST3 · CLAP",
         short="The Yamaha CS-80, modelled chip by chip from the service manual.",
         about=["Tyrell80 rebuilds the CS-80 from its circuits. Each stage of the voice was modelled from the original service manual, then put together as a modern instrument.",
                "It has two full voice channels, a ring modulator, sub-oscillator, touch response and the ribbon controller. The brass swells, the aftertouch breathes, and the strings hang in the air."],
         ad=dict(layout="a", headline="It took four men to carry it upstairs. Now it takes one click.",
                 alt="Four removal men straining to carry an enormous wooden crate up a narrow staircase",
                 body=["In 1977 Yamaha built a synthesizer that weighed as much as a small piano and sounded like the sky opening. Studios that owned one kept it forever. Studios that didn't just kept hoping.",
                       "Tyrell80 is that instrument, rebuilt from its circuits. It was modelled chip by chip from the original service manual, with each stage of the voice following the engineers' own drawings.",
                       "The brass swells as it should, the aftertouch breathes, and the strings hang in the air a little longer than you expect. The model and the schematics notes are open on GitHub."],
                 cap="Two voice channels, ring modulator and the ribbon.", what="Polyphonic synthesizer after the Yamaha CS-80.")),
    dict(repo="obxtra", name="OBXTRA", cat="synth", origin="Oberheim OB-X · OB-Xa · OB-8", year="1979",
         kind="Polyphonic synthesizer", formats="AU · VST3 · CLAP",
         short="Three Oberheim voice boards, modelled from the service manuals.",
         about=["OBXTRA models the voice boards of the Oberheim OB-X, OB-Xa and OB-8, each one from its own service manual. They run on top of the open-source OB-Xf engine and its preset library.",
                "Switch boards and the character changes the way it did on the real machines: the loud one, the smoother one and the well-mannered one."],
         ad=dict(layout="b", headline="Three brothers. Same family. Very different tempers.",
                 alt="Identical triplet brothers in matching suits on a sofa, each with a different expression",
                 body=["The OB-X was the loud one. The OB-Xa grew up a little smoother. The OB-8 learned some manners and kept its muscles. Together they defined the sound of a decade of arenas.",
                       "OBXTRA models the voice boards of all three, each from its own service manual. They run on OB-Xf's proven open-source engine, presets included.",
                       "Choose a brother and the character changes, as it did on the real machines. All three are wide, warm and impossible to bury in a mix."],
                 cap="One instrument, three voice boards.", what="Oberheim OB-X, OB-Xa and OB-8 voice boards in one instrument.")),
    dict(repo="dxdx7", name="DXDX7", cat="synth", origin="Yamaha DX7", year="1983",
         kind="FM synthesizer", formats="AU · VST3 · CLAP",
         short="Dexed's FM engine plus a model of the DX7 hardware.",
         about=["DXDX7 runs Dexed's faithful open-source FM engine with six operators and 32 algorithms. On top of that it adds a model of the DX7 hardware: the converters and the output stage that gave the original its grit.",
                "Load your cartridges and you get the electric pianos, glassy bells and slap basses of 1983, with the colour of the real machine."],
         ad=dict(layout="a", headline="You've heard this bell on a thousand records.",
                 alt="A hand about to strike a brass service bell on an empty hotel reception desk",
                 body=["Six operators and thirty-two algorithms gave 1983 its electric pianos, its glassy bells and its slap bass. They also gave a generation of musicians a manual nobody finished reading.",
                       "DXDX7 runs Dexed's faithful open-source FM engine and adds a model of the DX7 hardware: the converters and the output stage that put the grit into the shimmer.",
                       "Load your old cartridges and you'll know the sound at once. You'll also find out what it was missing all these years."],
                 cap="FM engine plus a hardware model.", what="FM synthesizer after the Yamaha DX7, hardware included.")),
    dict(repo="youth106", name="Youth106", cat="synth", origin="Roland Juno-106", year="1984",
         kind="Polyphonic synthesizer", formats="AU · VST3 · CLAP",
         short="The Juno-106: one oscillator, one filter and that chorus.",
         about=["Youth106 is an emulation of the Roland Juno-106, the six-voice workhorse behind four decades of pads, basses and arpeggios.",
                "It has one DCO, a high-pass filter, the resonant VCF, a simple envelope, the arpeggiator and the chorus. It's simple enough to learn in an afternoon."],
         ad=dict(layout="b", headline="Born in 1984. Still out every night.",
                 alt="An elderly woman roller-skating down a seaside boardwalk at sunset, arms outstretched",
                 body=["Some instruments age. This one just collects more records. The Juno-106 has played the pads, basses and late-night arpeggios of four decades and shows no sign of going home early.",
                       "Youth106 recreates it with one oscillator, one beautiful filter and the chorus that made the whole thing glow.",
                       "It's simple enough to learn in an afternoon and good enough to keep for the rest of your life. Press Chorus II. Everybody does."],
                 cap="Chorus II pressed, obviously.", what="Polyphonic synthesizer after the Roland Juno-106.")),
    dict(repo="zynabre", name="Zynabre", cat="synth", origin="ZynAddSubFX", year="2002",
         kind="Additive · subtractive · PAD synth", formats="AU · VST3 · CLAP",
         short="ZynAddSubFX ported to Rust. Loads your .xiz and .xmz patches.",
         about=["Zynabre is a port of the ZynAddSubFX engine (3.0.x), module by module from the C++ sources to Rust. It loads the original .xiz and .xmz patch files and plays them the way Zyn does, which was verified sample for sample against the original.",
                "It includes ADDsynth, SUBsynth and PADsynth, 16 parts × 16 kit items and the full effect rack, inside a new editor."],
         ad=dict(layout="a", headline="Twenty years of sounds were waiting behind it.",
                 alt="A single wooden door standing on its own in an open wheat field, slightly ajar, light pouring through",
                 body=["Since 2002 the open-source community has made thousands of patches for ZynAddSubFX. Its ADDsynth, SUBsynth and PADsynth engines are unlike anything else.",
                       "Zynabre is the same engine, ported module by module to Rust. It opens your original .xiz and .xmz files and plays them the way Zyn does, and that was measured sample for sample.",
                       "It has sixteen parts, sixteen kit items and the whole effect rack, all inside a new editor. Abre is Portuguese for “it opens.”"],
                 cap="Every patch you ever saved, still playable.", what="ZynAddSubFX, rebuilt in Rust.")),
    dict(repo="buenovox", name="BuenoVOX", cat="vocal", origin="", year="",
         kind="Pitch correction", formats="AU · VST3 · CLAP",
         short="Natural vocal pitch correction, automatic or MIDI-driven.",
         about=["BuenoVOX corrects vocal pitch while keeping the singer sounding human. It can detect the notes automatically from a key and scale, or follow target notes you play over MIDI.",
                "It has Natural, Classic and Hard modes, adjustable speed, humanize, vibrato and formant handling. It only sounds like a robot if you ask it to."],
         ad=dict(layout="b", headline="“Even he sings in tune now.”", quote=True,
                 alt="A dog howling earnestly into a vintage studio microphone",
                 body=["Pitch correction usually comes in two flavours: you can hear it, or it doesn't work. BuenoVOX was built for the space between, where the note is right and the singer still sounds like a person.",
                       "Let it find the notes automatically, or play the target notes on your MIDI keyboard and it will follow you to the semitone.",
                       "Set it tight or set it transparent. You won't hear a robot unless you specifically ask for one."],
                 cap="Automatic or MIDI-driven correction.", what="Natural vocal pitch correction.")),
    dict(repo="muchovox", name="MuchoVox", cat="vocal", origin="", year="",
         kind="Harmonizer + pitch correction", formats="AU · VST3",
         short="A natural vocal harmonizer with pitch correction built in.",
         about=["MuchoVox builds harmonies from a single voice, using chords, scales or MIDI, and corrects the lead at the same time.",
                "Thirds, fifths and doubles stay natural, with voicing, width and humanize controls. It's BuenoVOX's bigger sibling."],
         ad=dict(layout="a", headline="He came in alone. He left as a choir.",
                 alt="A single man singing between two facing mirrors, his reflection repeating into the distance",
                 body=["Harmonies used to mean hiring singers, or one singer and a very long night. MuchoVox makes the harmonies from the voice you already have.",
                       "It's a natural-sounding harmonizer with pitch correction built in. Thirds, fifths and doubles stay human, without chipmunks, without warble and without that tell-tale shimmer.",
                       "It's BuenoVOX's bigger sibling, for the moment the chorus needs a whole congregation."],
                 cap="Harmonies from a single voice.", what="Vocal harmonizer and pitch corrector.")),
    dict(repo="sideral", name="Sideral", cat="fx", origin="", year="",
         kind="Drifting memory · delay · looper", formats="AU · VST3 · CLAP",
         short="A memory that drifts like the sky: prime-length delays that never repeat.",
         about=["Sideral is a sound memory of undisclosed length, carved into delay lines whose lengths are all different prime numbers of samples. Once their heads pass each other they never line up again, so your phrases keep recombining and nothing comes back as a loop. Slow chaotic tides carry the lines across the stereo field.",
                "Twenty-one programs in five constellations read the same memory in different ways: two and four drifting delays, a reverberation the size of a county, clouds of grains, and nine Pulsar loopers locked to your host's bars that slice, shuffle, stutter and transpose the loop in place. A round REC button sits at the heart of the performance pads, which freeze the memory (Eclipse), reverse it (Retrograde), halve its speed (Redshift) or collapse it (Big Crunch). The editor is an orrery: every delay line is an orbit, every write head a planet."],
         ad=dict(layout="a", headline="It never plays the same thing twice. We asked it to. It declined.",
                 alt="",
                 body=["Most delays repeat themselves. Sideral would rather not. Its delay lines are cut to prime-number lengths, and primes, being famously antisocial, refuse to line up.",
                       "Play a phrase and it comes back from the left, then the right, then somewhere in between, a little different each time. Freeze it with Eclipse and play over it, or let the Pulsar programs lock it to your bars and quietly tear it apart.",
                       "The interface is an orrery. Watch the planets for long enough and you'll notice they never meet again."],
                 cap="The orrery: every orbit a delay line, every planet a write head.", what="Drifting memory station: delays, reverb, grains and loopers.")),
    dict(repo="mutante", name="Mutante", cat="fx", origin="Mu-Tron Bi-Phase", year="1974",
         kind="Dual optical phaser", formats="AU · VST3 · CLAP",
         short="Component-level model of the 1974 Mu-Tron Bi-Phase.",
         about=["Mutante is a physical model of the Musitronics Mu-Tron Bi-Phase. It has two six-stage all-pass phasers with photocells lit by a shared LED, two sweep generators, the C-100 pedal and the three-way routing switch.",
                "It was modelled stage by stage from the original service schematics, which are published in the repository together with the bench measurements. It passes pluginval at strictness 10 and auval."],
         ad=dict(layout="b", headline="Your guitar, underwater. Your amplifier, perfectly dry.",
                 alt="An electric guitar resting on the bottom of a sunlit swimming pool",
                 body=["In 1974 a small company in New Jersey put two phasers, two sweep generators and a light bulb inside one box. Then the dub engineers of Kingston got hold of it, and records never sounded quite the same.",
                       "Mutante models the Mu-Tron Bi-Phase component by component from the original schematics. That means every coupling capacitor, every diode knee and every photocell, slowly following the light.",
                       "The schematics and the bench measurements are published in the repository."],
                 cap="Two phasers, three routings, one light bulb.", what="Dual optical phaser after the Mu-Tron Bi-Phase.")),
    dict(repo="th0nk3000", name="th0nk3000", cat="fx", origin="Audio Ease Th0nk", year="1996",
         kind="Granular collider", formats="Standalone · AU · VST3 · CLAP",
         short="The cult Mac OS 9 granular app, reverse-engineered and back.",
         about=["th0nk3000 is a reverse-engineered recreation of Audio Ease's 1996 Mac OS 9 app Th0nk. It takes any sample, breaks it into grains and collides them into new, unpredictable material.",
                "It runs as a standalone app or as a plug-in, with density, pitch, pan and source lanes and a seed you can lock."],
         ad=dict(layout="a", headline="Nobody knows what happens next. Not even us.",
                 alt="A china plate frozen mid-shatter above a dinner table",
                 body=["In 1996 a little Mac program took any sound you gave it, smashed it into grains and rebuilt it in ways no one could predict. People loved it. Then the operating system it ran on disappeared.",
                       "th0nk3000 is a reverse-engineered recreation of Audio Ease's cult Th0nk, back as a modern app and plug-in. This time the source is open, so it can't vanish again.",
                       "Drop in a sample and press the button. Each press gives you a different collision, and some of them will end up on your record."],
                 cap="Results may vary. Wildly.", what="Granular collider. Standalone and plug-in.")),
    dict(repo="magnitude", name="Magnitude", cat="master", origin="PRESSURE plug-in", year="2006",
         kind="Upward compressor", formats="AU · VST3 · CLAP",
         short="Upward mastering compressor: lifts the quiet, leaves the peaks.",
         about=["Magnitude is an upward compressor for mastering. Instead of pushing the peaks down, it raises the low-level detail underneath them, so you get density without pumping.",
                "It descends from PRESSURE, the 2006 plug-in by Tom & Jeremy Gersic, and was rebuilt in Rust with look-ahead, colour, sidechain HPF and an HQ mode."],
         ad=dict(layout="b", headline="It lifts the quiet. It leaves the loud alone.",
                 alt="A single hot-air balloon rising over a misty valley at dawn",
                 body=["Most compressors make a mix louder by pushing the peaks down. Magnitude works the other way round: it lifts the detail underneath them.",
                       "Room tone, reverb tails and the breath before a line all come up into the light, while the peaks stay exactly where you left them. You get density without pumping.",
                       "It's a descendant of PRESSURE, the 2006 plug-in by Tom and Jeremy Gersic, reborn in Rust."],
                 cap="Upward compression for the mastering chain.", what="Upward mastering compressor.")),
    dict(repo="sunbliss", name="Sunbliss", cat="master", origin="", year="",
         kind="Clipper · soft saturation", formats="AU · VST3 · CLAP",
         short="Converter-style mastering clipper and soft saturation.",
         about=["Sunbliss is a mastering clipper and soft saturator that behaves like an overloaded A/D converter. It has several clipper modes, a soft-saturation stage, oversampling up to Extra Pristine, and converter features such as word length, dither and noise shaping.",
                "It's a study project: every curve was derived by measuring audio and reading public manuals, and the method is documented in the repository."],
         ad=dict(layout="a", headline="Loud is a lovely place to spend the summer.",
                 alt="Studio headphones on a striped beach towel next to sun cream and sunglasses",
                 body=["There's a particular kind of loud that only happens when an analogue-to-digital converter is pushed a little past polite. It's dense and warm, and strangely it never sounds broken.",
                       "Sunbliss is a mastering clipper and soft saturator built to behave exactly like that. Every curve came from measuring real audio and reading public manuals, and the method is documented on GitHub.",
                       "Turn it up and the record gets louder and warmer, not uglier."],
                 cap="Converter-style clipping and soft saturation.", what="Converter-style clipper and soft saturation.")),
    dict(repo="liveremote", name="Live Remote", cat="tool", origin="", year="",
         kind="Remote for Ableton Live", formats="Desktop app",
         short="Control Ableton Live from your phone or tablet's browser.",
         about=["Live Remote runs on your computer and serves a Live-like interface to any phone or tablet on the same Wi-Fi. You get Session and Arrangement views, the mixer, transport, and a simplified Record screen with a big REC button and input meters.",
                "It's built for recording yourself when the instrument is far from the computer. There's nothing to install on the phone."],
         ad=dict(layout="b", headline="Press record from the other end of the house.",
                 alt="A cellist playing alone at the far end of a very long, empty corridor, a phone standing on the floor nearby",
                 body=["Every musician who records alone knows the walk: press record, run back to the instrument, catch your breath, miss the downbeat. Then do it all again.",
                       "Live Remote puts Ableton Live in your phone or tablet's browser, with Session and Arrangement views, the mixer, transport, and a big red REC button with input meters.",
                       "Run it on the computer and open an address on your phone over the same Wi-Fi. There's nothing to install on the phone."],
                 cap="Session view, on the desktop.", what="Control Ableton Live from any phone or tablet.")),
    # ---- Audio Ease classics, rebuilt from the original binaries (bundle repos: one id per plug-in) ----
    dict(repo="nautilus3000", id="riverrun3k", asset="riverrun", name="RiverRun3K", cat="fx", origin="Audio Ease Riverrun", year="2000",
         kind="Granular synthesizer", formats="AU · VST3 · CLAP",
         short="Audio Ease's granular river, rebuilt bit for bit from the binary.",
         about=["RiverRun3K is Audio Ease's Riverrun, rebuilt in Rust from the original machine code. It freezes a few seconds of sound and plays it back as thousands of tiny grains, each with its own envelope, pitch and place in the stereo field.",
                "The original runs in an emulator next to the new engine, and their output matches bit for bit."],
         ad=dict(layout="a", headline="Say one word. It comes back as weather.",
                 alt="A man on a cliff shouting into the wind, his breath turning into a cloud of spray",
                 body=["In 2000 a small Dutch company sold a plug-in that froze a few seconds of sound and then threw it at you as thousands of tiny grains. Its about box thanked Barry Truax, the composer who first made granular synthesis run in real time.",
                       "RiverRun3K was rebuilt from the original machine code. The old binary runs in an emulator next to the new engine, and the two agree on every sample.",
                       "Freeze a voice, let the glass walk across it and pick a chord. One sentence turns into a choir, a drone or a storm."],
                 cap="The input screen, the grain glass and the keyboard.", what="Real-time granular synthesizer after Audio Ease Riverrun.")),
    dict(repo="nautilus3000", id="deepphasenine3k", asset="deepphasenine", name="DeepPhaseNine3K", cat="fx", origin="Audio Ease Deep Phase Nine", year="2000",
         kind="24-notch phaser", formats="AU · VST3 · CLAP",
         short="Up to 24 notches per channel, from Audio Ease's Deep Phase Nine.",
         about=["DeepPhaseNine3K is Audio Ease's Deep Phase Nine, rebuilt from the original binary: up to 24 notches per channel, a beat-synced LFO with one-shot sweeps, and the original look-ahead limiter.",
                "Its output matches the original bit for bit."],
         ad=dict(layout="b", headline="Eight times more phaser than anyone asked for.",
                 alt="A spiral staircase seen from above, repeating down into darkness",
                 body=["A classic phaser sweeps three notches through your sound. In 2000 Audio Ease decided twenty-four per channel was a better number, then added a limiter so the resonance couldn't hurt anybody.",
                       "DeepPhaseNine3K is rebuilt from the original binary and checked against it bit for bit, beat-synced LFO and one-shot sweeps included.",
                       "Push the feedback to the edge and the notches start to sing. The look-ahead limiter keeps them from screaming."],
                 cap="Both channels' notches, plotted live.", what="24-notch phaser after Audio Ease Deep Phase Nine.")),
    dict(repo="nautilus3000", id="periscope3k", asset="periscope", name="Periscope3K", cat="master", origin="Audio Ease PeriScope", year="2000",
         kind="Zoomable 32-band EQ", formats="AU · VST3 · CLAP",
         short="32 zoomable linear-phase bands, with the spectrum behind the faders.",
         about=["Periscope3K is Audio Ease's PeriScope, rebuilt from the original binary. Two needles set the range, and thirty-two linear-phase bands spread out between them, over a live spectrum.",
                "Its output matches the original bit for bit."],
         ad=dict(layout="a", headline="It can take one whistle out of a whole orchestra.",
                 alt="A conductor in tails raising a single finger to his lips in front of a full orchestra",
                 body=["Most equalizers give you knobs at fixed frequencies. PeriScope gave you two needles: put them anywhere, and thirty-two razor-sharp bands spread out between them.",
                       "Periscope3K is rebuilt from the 2000 binary and matches it bit for bit. It's linear-phase, so cutting a band never smears the sound around it.",
                       "Zoom into 20 to 400 Hz to sort out the bass, or pull a 10 Hz slice out of 3 kHz to remove a whistle. You watch the spectrum while you do it."],
                 cap="Thirty-two faders over the live spectrum.", what="Zoomable 32-band EQ after Audio Ease PeriScope.")),
    dict(repo="rocketscience3000", id="roger3k", asset="roger", name="Roger3K", cat="fx", origin="Audio Ease Roger", year="2001",
         kind="Vowel filter", formats="AU · VST3 · CLAP",
         short="A vowel filter with three voices that babbles in tempo.",
         about=["Roger3K is Audio Ease's Roger, rebuilt from the original binary: ten vowels in the voices of a man, a woman and a child, glides between them, and an Auto mode that babbles in time with the song.",
                "Its output matches the original bit for bit."],
         ad=dict(layout="b", headline="Meet Roger, Patty and Cindy. They'll say anything.",
                 alt="A 1950s family of three on a sofa, all with their mouths wide open in the same vowel",
                 body=["In 1952 two scientists measured the vowels of men, women and children. Fifty years later Audio Ease put their numbers in a plug-in and gave the voices names: Roger, Patty and Cindy.",
                       "Roger3K is rebuilt from the original binary and checked against it bit for bit, down to the original's typo in the value of two pi.",
                       "Run a synth pad through it and it starts to talk. Switch on Auto and the family babbles in time with your song."],
                 cap="The mouth: the vowel chart and the live filter.", what="Vowel filter after Audio Ease Roger.")),
    dict(repo="rocketscience3000", id="follo3k", asset="follo", name="Follo3K", cat="fx", origin="Audio Ease Follo", year="2001",
         kind="Envelope-driven resonator", formats="AU · VST3 · CLAP",
         short="A resonant band that follows how hard you play.",
         about=["Follo3K is Audio Ease's Follo, rebuilt from the original binary: one resonant band whose frequency follows the level of the input, between a resting and a peak frequency you set.",
                "Its output matches the original bit for bit."],
         ad=dict(layout="a", headline="The harder you play, the higher it goes.",
                 alt="A circus strongman swinging a hammer at a high striker, the puck flying towards the bell",
                 body=["Follo listens to how loud you are and moves a single resonant band to match. Play softly and it rests on the yellow slider. Dig in and it jumps to the blue one.",
                       "Follo3K is rebuilt from the 2001 binary and verified bit for bit against it.",
                       "Use it as an auto-wah on a guitar. Or set both sliders low and narrow, and every kick turns into a thump of resonating bass."],
                 cap="Two sliders, one ball, one band.", what="Envelope-driven band booster after Audio Ease Follo.")),
    dict(repo="rocketscience3000", id="orbit3k", asset="orbit", name="Orbit3K", cat="fx", origin="Audio Ease Orbit", year="2001",
         kind="Flight path simulator", formats="AU · VST3 · CLAP",
         short="A sound flying around a virtual room, with real Doppler.",
         about=["Orbit3K is Audio Ease's Orbit, rebuilt from the original binary: a sound source moving in a virtual room, heard through up to five orders of wall reflections, each with its own delay and Doppler shift.",
                "Its output matches the original bit for bit."],
         ad=dict(layout="b", headline="Hear it fly past. Then hear the walls.",
                 alt="A paper aeroplane caught mid-flight in a long empty ballroom, its shadow on the parquet",
                 body=["Orbit puts your sound in a room and lets it fly. Every reflection off every wall reaches each ear with its own delay, its own loudness and its own Doppler shift.",
                       "Orbit3K is rebuilt from the 2001 binary and matches it bit for bit, from the mirror images in the walls to the path-finding routine its programmers called “man with dog”.",
                       "Click a path and it follows. Draw an ellipse and it circles you. Or set it loose, which the manual described as Buck Rogers on LSD."],
                 cap="The room from above: walls, mirror images and the flight path.", what="Flight path simulator after Audio Ease Orbit.")),
]

e = html.escape
gh = lambda r: f"https://github.com/{OWNER}/{r}"
GH_ICON = '<svg class="i" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>'
DL_ICON = '<svg class="i" viewBox="0 0 16 16" aria-hidden="true"><path d="M7 1h2v8.2l2.8-2.8 1.4 1.4L8 13 2.8 7.8l1.4-1.4L7 9.2z"/><path d="M2 14h12v2H2z"/></svg>'

FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'


def head(title, desc, url, image, css, extra_fonts, canonical=None, jsonld=None, og_type="website"):
    canon = f'<link rel="canonical" href="{canonical}">\n' if canonical else ""
    ld = "".join(f'<script type="application/ld+json">{json.dumps(j, ensure_ascii=False)}</script>\n' for j in (jsonld or []))
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
{canon}<meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:type" content="{og_type}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{image}">
<meta property="og:site_name" content="Jardim Sonoro">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico">
{FONTS}
<link href="https://fonts.googleapis.com/css2?{extra_fonts}&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{css}">
{ld}</head>
"""


# ---------------------------------------------------------------- /audio
# Words that take over the screen when the highlighted term in each plug-in is hovered / tapped.
WORDS = {
    "apolo9": ["skin", "organism", "drone", "FM"],
    "tyrell80": ["brass", "ribbon", "1977", "rain"],
    "obxtra": ["arenas", "unison", "brass", "1979"],
    "dxdx7": ["bells", "e-piano", "FM", "1983"],
    "youth106": ["chorus", "pads", "arps", "1984"],
    "zynabre": ["ADD", "SUB", "PAD", "abre"],
    "buenovox": ["in tune", "natural", "human"],
    "muchovox": ["thirds", "fifths", "choir"],
    "sideral": ["primes", "orbit", "eclipse", "drift"],
    "mutante": ["dub", "sweep", "light", "1974"],
    "th0nk3000": ["grains", "chance", "collide"],
    "magnitude": ["lift", "detail", "density"],
    "sunbliss": ["loud", "warm", "summer"],
    "liveremote": ["REC", "far away", "alone"],
    "riverrun3k": ["grains", "river", "freeze", "2000"],
    "deepphasenine3k": ["notches", "sweep", "whistle", "2000"],
    "periscope3k": ["zoom", "32 bands", "phase", "2000"],
    "roger3k": ["vowels", "babble", "Roger", "2001"],
    "follo3k": ["wah", "follow", "thump", "2001"],
    "orbit3k": ["Doppler", "walls", "fly-by", "2001"],
}
FACTS = {'apolo9': ['8 CD4093 voices · skin-conductance sensors', '2 PT2399s simulated bit by bit · 19 presets, from drones to harsh noise'],
    'sideral': ['21 programs in 5 constellations', 'Prime-length lines · loops locked to the host bars'],
    'tyrell80': ['8 voices, two complete synth lines each', '75 presets, incl. the 22 factory tones'],
    'obxtra': ['Up to 32 voices', '613 presets, incl. the OB-Xa factory bank'],
    'dxdx7': ['6 operators · 32 algorithms', '41 cartridges · 1,312 voices built in'],
    'youth106': ['6 voices (8 or 10 optional)', '299 presets, incl. all 128 Juno-106 patches'],
    'zynabre': ['16 parts × 16 kit items', '1,517 instruments in 42 banks'],
    'buenovox': ['Natural, Classic and Hard modes', 'Key + 12 scales, MIDI target or MIDI scale'],
    'muchovox': ['Up to 4 harmony voices (8 with Double)', 'Chord, scale, MIDI chord or MIDI notes'],
    'mutante': ['2 × six-stage optical phasers', '3 routings: In A, Out A, In B'],
    'th0nk3000': ['7 grain parameters scored over 20 minutes', 'Standalone app + plug-in, live input'],
    'magnitude': ['Look-ahead 0–100 ms', '4× oversampled HQ mode · 10 presets'],
    'sunbliss': ['Classic, Modern and Hard clippers', 'HPDF dither, NS1–NS4 noise shaping'],
    'liveremote': ['Session, Arrangement, mixer and REC screen', 'Ableton Live 11 · nothing to install on the phone'],
    'riverrun3k': ['Up to 2,000 grains a second · 23 pitch grids', 'Bit-identical to the original: 57 of 57 tests'],
    'deepphasenine3k': ['Up to 24 notches per channel · beat sync', 'Bit-identical to the original: 39 of 39 tests'],
    'periscope3k': ['32 linear-phase bands between two needles', 'Bit-identical to the original: 28 of 28 tests'],
    'roger3k': ['10 vowels × 3 voices · Auto babble in tempo', 'Bit-identical to the original: 55 of 55 tests'],
    'follo3k': ['One band, 20 Hz to 10 kHz, driven by the level', 'Bit-identical to the original: 41 of 41 tests'],
    'orbit3k': ['61 reflection paths per ear · Doppler', 'Bit-identical to the original: 39 of 39 tests']}


TYPED = [
    "Open-source instruments & effects.",
    "Circuit-modelled from service manuals.",
    "Instrumentos abertos, feitos no Brasil.",
    "オープンソースの楽器",
    "Des instruments à code ouvert.",
    "Test it. Break it. Fix it.",
    "Pull requests welcome.",
    "音の庭、オープンソース",
    "Written in Rust, with love.",
]


def loop(text, words=None):
    return f'<span class="loopCol">{e(text)}</span>'



def fmt_time(sec):
    sec = int(round(sec))
    return f"{sec // 60}:{sec % 60:02d}"


def demo_html(repo):
    """Waveform player for audio/demos/<repo>.mp3 (made by _build/demos.py), if one exists."""
    j = os.path.join(ROOT, "demos", repo + ".json")
    if not os.path.exists(j):
        return ""
    d = json.load(open(j))
    pk = d["peaks"]
    bars = "".join(f'<rect x="{i * 2}" y="{20 - v * 19:.2f}" width="1.2" height="{max(v * 38, .6):.2f}"/>' for i, v in enumerate(pk))
    svg = f'<svg viewBox="0 0 {len(pk) * 2} 40" preserveAspectRatio="none" aria-hidden="true">{bars}</svg>'
    return f"""
      <div class="demo" data-src="/audio/demos/{d.get('file', repo + '.mp3')}">
        <button class="play" type="button" aria-label="Play the {e(d['piece'])} demo"><span class="i-play"></span></button>
        <div class="wave" role="slider" aria-label="Seek" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" tabindex="0">{svg}<div class="prog">{svg}</div></div>
        <p class="cap">{e(d['piece'])} <span class="dim">{('· preset ' + e(d['sound']) + ' ') if d.get('sound') else ''}· <span class="time">{fmt_time(d['duration'])}</span></span></p>
      </div>"""


def pid(p):
    return p.get("id", p["repo"])


def ordered():
    """Plug-ins in menu order with their category label (the number is only an internal index)."""
    out, n = [], 0
    for key, label in CATS:
        for p in PLUGINS:
            if p["cat"] == key:
                n += 1
                out.append((p, f"{n:02d}", label))
    return out


def page_url(p):
    return f"{SITE}{pid(p)}/"


def describe(p):
    """A search-snippet sized description: the short line plus the start of the story."""
    d = p["short"] + " " + p["about"][0]
    if len(d) > 158:
        d = d[:155].rsplit(" ", 1)[0].rstrip(",.;:") + "…"
    return d


def card_html(p, num, label, open_detail):
    r, repo = pid(p), p["repo"]
    asset_attr = f' data-asset="{p["asset"]}"' if p.get("asset") else ""
    state = " open" if open_detail else ""
    expanded = "true" if open_detail else "false"
    tag = "h2"
    detail = detail_html(p, num, label) if open_detail else ""
    return f"""
    <article class="plug{state}" id="{r}" data-repo="{repo}" data-cat="{p['cat']}"{asset_attr}>
      <a class="card" href="/audio/{r}/" aria-expanded="{expanded}" aria-controls="d-{r}">
        <span class="thumb"><img src="/audio/shots/{r}-800.webp" alt="{e(p['name'])} interface" loading="lazy" decoding="async"></span>
        <span class="meta"><span class="kind">{e(label)}</span></span>
        <{tag} class="cname">{e(p['name'])}</{tag}>
        <span class="short">{e(p['short'])}</span>
      </a>{detail}
    </article>"""


def detail_html(p, num, label):
    r, a, repo = pid(p), p["ad"], p["repo"]
    ref = f'{p["origin"]}{", " + p["year"] if p["year"] else ""}' if p["origin"] else p["kind"]
    body = "".join(f"<p>{e(t)}</p>" for t in p["about"])
    kind_li = f"<li>_ {e(p['kind'])}</li>" if p["origin"] else ""
    return f"""
      <div class="detail" id="d-{r}">
        <a class="close" href="/audio/" aria-label="Close {e(p['name'])} and return to all plug-ins">&times;</a>
        <figure class="ui"><button class="zoom" type="button" data-full="/audio/shots/{r}-1600.webp" aria-label="View the {e(p['name'])} interface full screen"><img src="/audio/shots/{r}-800.webp" srcset="/audio/shots/{r}-800.webp 800w, /audio/shots/{r}-1600.webp 1600w" sizes="(max-width:900px) 100vw, 70vw" alt="{e(p['name'])} interface" loading="lazy"></button></figure>{demo_html(r)}
        <h4>{e(label)}</h4>
        <h1 class="name">{e(p['name'])}</h1>
        <p class="headline">{e(p['short'])}</p>
        <div class="cols">
          <div class="text">{body}</div>
          <div class="aside">
            <p class="tagline">{loop('“' + a['headline'].strip('“”') + '”', WORDS.get(r, [p['name']]))}</p>
            <ul class="specs">
              <li>_ {e(ref)}</li>
              {kind_li}
              {''.join(f"<li>_ {e(f)}</li>" for f in FACTS.get(r, []))}
            </ul>
          </div>
        </div>
        <div class="get">
          <div class="dlw">
            <a class="gh" href="{gh(repo)}" aria-label="Source code on GitHub"><svg class="ghi" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg><span class="ghu">github.com/{OWNER}/{repo}</span></a>
            <p class="dls"><span class="arrow">&gt;</span> <a class="dl" data-os="mac" href="{gh(repo)}/releases/latest">macOS</a>, <a class="dl" data-os="linux" href="{gh(repo)}/releases/latest">Linux</a>, <a class="dl" data-os="win" href="{gh(repo)}/releases/latest">Windows</a></p>
            <p class="ver" data-ver>Latest release on GitHub</p>
          </div>
        </div>
      </div>"""


ORG = {"@type": "Organization", "name": "Jardim Sonoro", "url": "https://jardimsonoro.com/"}


def app_ld(p):
    return {
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": p["name"], "url": page_url(p), "description": describe(p),
        "image": f"{SITE}shots/{pid(p)}-1600.webp",
        "applicationCategory": "MultimediaApplication", "applicationSubCategory": p["kind"],
        "operatingSystem": "macOS, Windows, Linux", "isAccessibleForFree": True,
        "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"},
        "author": ORG, "publisher": ORG, "sameAs": [gh(p["repo"])],
    }


INDEX_TITLE = "Jardim Sonoro: Audio — open-source plug-ins & instruments"
INDEX_DESC = ("Open-source audio plug-ins for macOS, Windows and Linux: an organismic DIY synth, circuit-modelled CS-80, Oberheim, DX7 and Juno-106 synths, "
              "a drifting prime-number memory, natural vocal pitch correction, a Bi-Phase phaser, mastering tools, and Audio Ease classics "
              "rebuilt bit for bit. Written in Rust.")


def page(selected=None):
    items = ordered()
    chips = '<button class="chip on" type="button" data-cat="all" aria-pressed="true">All <span>{}</span></button>'.format(len(items))
    for key, label in CATS:
        n = sum(1 for p, _, _ in items if p["cat"] == key)
        if n:
            chips += f'<button class="chip" type="button" data-cat="{key}" aria-pressed="false">{e(label)} <span>{n}</span></button>'
    cards = "".join(card_html(p, num, label, p is selected) for p, num, label in items)

    if selected:
        p = selected
        what = p["ad"]["what"].rstrip(".")
        title = f"{p['name']} — {what}"
        if len(title) < 62:
            title += " | Jardim Sonoro"
        desc = describe(p)
        url = page_url(p)
        image = f"{SITE}shots/{pid(p)}-1600.webp"
        crumbs = {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Jardim Sonoro", "item": "https://jardimsonoro.com/"},
            {"@type": "ListItem", "position": 2, "name": "Audio", "item": SITE},
            {"@type": "ListItem", "position": 3, "name": p["name"], "item": url}]}
        ld = [app_ld(p), crumbs]
        logo_tag, og = "p", "product"
    else:
        title, desc = INDEX_TITLE, INDEX_DESC
        url, image = SITE, SITE + "shots/og.jpg"
        ld = [{"@context": "https://schema.org", "@type": "CollectionPage", "name": "Jardim Sonoro Audio", "url": SITE,
               "description": desc, "publisher": ORG,
               "mainEntity": {"@type": "ItemList", "numberOfItems": len(items), "itemListElement": [
                   {"@type": "ListItem", "position": i + 1, "url": page_url(q), "name": q["name"]} for i, (q, _, _) in enumerate(items)]}}]
        logo_tag, og = "h1", "website"

    out = head(title, desc, url, image, "/audio/style.css?v=20261113",
               "family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,400", canonical=url, jsonld=ld, og_type=og) + f"""<body{' class="has-open"' if selected else ''}>

<header class="header">
  <nav class="nav"><{logo_tag} class="logo"><a href="/">Jardim Sonoro</a><a href="/audio/"><span class="badge">Audio</span></a></{logo_tag}></nav>
</header>

<main>
  <section class="about" id="about">
    <h4>About</h4>
    <p class="lead">My <mark class="hl hl-1">Electroacoustic Garden</mark> for <mark class="hl hl-2">synthesis</mark> and <mark class="hl hl-3">transformation</mark> of sound. <span class="quiet">Open source.</span></p>
  </section>

  <nav class="filters" aria-label="Filter plug-ins by kind">{chips}</nav>

  <div class="grid" id="plugins" data-title="{e(INDEX_TITLE)}" data-desc="{e(INDEX_DESC)}">{cards}
  </div>

  <section id="footer" class="bottom">
    <div class="social-icons">
      <a href="https://www.instagram.com/jardimsonoro.rio" aria-label="Instagram"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#aaa" viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 2 .2 2.4.4.5.2.9.4 1.3.8s.6.8.8 1.3c.2.4.3 1.2.4 2.4.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 2-.4 2.4-.2.5-.4.9-.8 1.3s-.8.6-1.3.8c-.4.2-1.2.3-2.4.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-2-.2-2.4-.4a3.7 3.7 0 01-2.1-2.1c-.2-.4-.3-1.2-.4-2.4C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-2 .4-2.4A3.7 3.7 0 014.8 2.3c.4-.2 1.2-.3 2.4-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1 .1-1.6.2-2 .3a2 2 0 00-1.1 1.1c-.1.4-.2 1-.3 2-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1 .2 1.6.3 2a2 2 0 001.1 1.1c.4.1 1 .2 2 .3 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1-.1 1.6-.2 2-.3a2 2 0 001.1-1.1c.1-.4.2-1 .3-2 .1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1-.2-1.6-.3-2a2 2 0 00-1.1-1.1c-.4-.1-1-.2-2-.3-1.2-.1-1.6-.1-4.7-.1zM12 6.5a5.5 5.5 0 110 11 5.5 5.5 0 010-11zm0 1.8a3.7 3.7 0 100 7.4 3.7 3.7 0 000-7.4zm5.4-1.9a1.3 1.3 0 110 2.6 1.3 1.3 0 010-2.6z"/></svg></a>
      <a href="https://x.com/jardimsonoro" aria-label="Twitter"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#aaa" viewBox="0 0 24 24"><path d="M22.25 2l-7.56 8.87L23.5 22h-5.25l-5.83-6.88L6.5 22H.5l8.14-9.55L.5 2h5.25l5.25 6.18L17.5 2z"/></svg></a>
    </div>
    <p>© 2026 <a href="https://jardimsonoro.com">Jardim Sonoro</a> · Rio de Janeiro, Brasil.</p>
    <p class="fine">Open source, provided as-is. See each repository for its license. Product names are trademarks of their owners, used only to describe what each project models. No affiliation.</p>
  </section>
</main>

<dialog class="lightbox" id="lightbox" aria-label="Interface, full screen"><img alt=""><button class="close" type="button" aria-label="Close">&times;</button></dialog>

<div class="fixedBg" id="fixedBg" aria-hidden="true"><div class="container"></div></div>

<script src="/audio/app.js?v=20261112" defer></script>
</body>
</html>
"""
    return out


def build_index():
    open(os.path.join(ROOT, "index.html"), "w").write(page())
    for p, _, _ in ordered():
        d = os.path.join(ROOT, pid(p))
        os.makedirs(d, exist_ok=True)
        open(os.path.join(d, "index.html"), "w").write(page(p))


def build_sitemap():
    """Writes the /audio URLs into indexmap.xml (the static tail the blog publisher appends)
    and into the current sitemap.xml, between markers."""
    import datetime, re
    now = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%S+00:00")
    urls = [(SITE, "0.9")] + [(page_url(p), "0.8") for p, _, _ in ordered()]
    block = "<!-- audio:begin -->\n" + "".join(
        f"<url>\n  <loc>{u}</loc>\n  <lastmod>{now}</lastmod>\n  <changefreq>monthly</changefreq>\n  <priority>{pr}</priority>\n</url>\n"
        for u, pr in urls) + "<!-- audio:end -->\n"
    site = os.path.dirname(ROOT)
    for name in ("indexmap.xml", "sitemap.xml"):
        path = os.path.join(site, name)
        if not os.path.exists(path):
            continue
        s = open(path).read()
        s = re.sub(r"<!-- audio:begin -->.*?<!-- audio:end -->\n", "", s, flags=re.S)
        i = s.rfind("</urlset>")
        s = s[:i] + block + "\n" + s[i:]
        open(path, "w").write(s)


# ---------------------------------------------------------------- /audio/ads
def build_ads():
    os.makedirs(os.path.join(ROOT, "ads"), exist_ok=True)
    with_photo = [p for p in PLUGINS if os.path.exists(os.path.join(ROOT, "img", p.get("id", p["repo"]) + ".jpg"))]
    for i, p in enumerate(with_photo):
        r, a = p.get("id", p["repo"]), p["ad"]
        repo = p["repo"]
        d = os.path.join(ROOT, "ads", r)
        os.makedirs(d, exist_ok=True)
        q = ' q' if a.get("quote") else ''
        headline = f'<h1 class="headline{q}">{e(a["headline"])}</h1>'
        photo = f'<figure class="photo"><img src="../../img/{r}.jpg" alt="{e(a["alt"])}"></figure>'
        top = (headline + photo) if a["layout"] == "b" else (photo + headline)
        body = "".join(f"<p>{e(t)}</p>" for t in a["body"])
        shot = f"../../shots/{r}-800.webp"
        unit_cls = "unit"
        out = head(f"{p['name']} — {a['headline']}", p["short"], f"{SITE}ads/{r}/", f"{SITE}ads/{r}/ad.jpg", "../ad.css",
                   "family=Archivo:wdth,wght@100..125,400..900&family=EB+Garamond:ital,wght@0,400..700;1,400..600") + f"""<body>
<div class="tools"><a href="../../{r}/">&larr; {e(p['name'])} on jardimsonoro.com/audio</a><a href="../">All ads</a><button onclick="print()">Print</button></div>
<div class="stage">
<article class="page layout-{a['layout']}" id="page">
  <div class="stripes"></div>
  {top.replace('<h1', '<div class="hwrap"><h1').replace('</h1>', '</h1></div>')}
  <div class="cols">
    <div class="body">{body}</div>
    <div class="side"><div class="{unit_cls}"><img src="{shot}" alt="{e(p['name'])} interface"></div><p class="cap">{e(a['cap'])}</p></div>
  </div>
  <div class="sig">
    <div><div class="mark">{e(p['name'])}</div><div class="what">{e(a['what'])}</div><div class="specs">Open source · {e(p['formats'])}</div></div>
    <div class="by"><b>Jardim Sonoro</b>Open-source audio research</div>
  </div>
  <div class="fine"><span>Download: jardimsonoro.com/audio</span><span>Source &amp; issues: github.com/{OWNER}/{repo}</span></div>
  <div class="folio"><span>{e(CAT_LABEL[p['cat']])}</span><span>{i + 1:02d}</span></div>
</article>
</div>
<script>
(function(){{var s=document.querySelector('.stage'),p=document.getElementById('page');
function fit(){{var k=Math.min((innerWidth-24)/850,(innerHeight-70)/1100,1.4);p.style.zoom=k>0?k:1;}}
addEventListener('resize',fit);fit();}})();
</script>
</body>
</html>
"""
        open(os.path.join(d, "index.html"), "w").write(out)

    items = "".join(f'<a class="thumb" href="{p.get("id", p["repo"])}/"><img src="{p.get("id", p["repo"])}/ad.jpg" alt="{e(p["name"])} ad" loading="lazy"><span>{e(p["name"])}</span></a>' for p in with_photo)
    out = head("Jardim Sonoro Audio — print ads", "Magazine-style ads for each Jardim Sonoro open-source plug-in.", SITE + "ads/", SITE + "ads/tyrell80/ad.jpg", "ad.css",
               "family=Archivo:wdth,wght@100..125,400..900&family=EB+Garamond:ital,wght@0,400..700;1,400..600") + f"""<body class="list">
<div class="tools"><a href="../">&larr; jardimsonoro.com/audio</a></div>
<h1 class="list-title">Print ads</h1>
<div class="thumbs">{items}</div>
</body>
</html>
"""
    open(os.path.join(ROOT, "ads", "index.html"), "w").write(out)


if __name__ == "__main__":
    build_index()
    build_ads()
    build_sitemap()
    print("built", len(PLUGINS), "plug-ins")
