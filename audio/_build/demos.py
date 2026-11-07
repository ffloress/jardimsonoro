#!/usr/bin/env python3
"""Renders a short audio demo for each synthesizer, straight from the installed AU plug-ins.

Uses Spotify's pedalboard to host the Audio Units offline. Each synth gets a factory preset
(written into its truce state) and a public-domain melody, then a touch of room reverb.

Outputs, for each synth:  audio/demos/<repo>.mp3  and  audio/demos/<repo>.json  (waveform peaks + caption)

Run:  python3 audio/_build/demos.py          (macOS, plug-ins installed in ~/Library/Audio/Plug-Ins/Components)
"""
import json, os, plistlib, re, struct, subprocess, sys, tempfile, time
import numpy as np
import pedalboard

HOME = os.path.expanduser("~")
AU = os.path.join(HOME, "Library/Audio/Plug-Ins/Components")
CODE = os.path.join(HOME, "code")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "demos")
SR = 48000


# ------------------------------------------------------------------ truce state helpers
def split_state(raw):
    pl = plistlib.loads(raw)
    d = pl["truce_state"]
    assert d[:4] == b"OAST", "not a truce state"
    head = d[:16]
    n = struct.unpack("<I", d[16:20])[0]
    params = [struct.unpack("<Id", d[20 + 12 * i: 32 + 12 * i]) for i in range(n)]
    off = 20 + 12 * n
    el = struct.unpack("<Q", d[off:off + 8])[0]
    extra = d[off + 8: off + 8 + el]
    off += 8 + el
    persist = b""
    if len(d) >= off + 8:
        pln = struct.unpack("<Q", d[off:off + 8])[0]
        persist = d[off + 8: off + 8 + pln]
    return pl, head, params, extra, persist


def join_state(pl, head, params, extra, persist):
    d = bytearray(head) + struct.pack("<I", len(params))
    for pid, v in params:
        d += struct.pack("<Id", pid, v)
    d += struct.pack("<Q", len(extra)) + extra + struct.pack("<Q", len(persist)) + persist
    pl["truce_state"] = bytes(d)
    return plistlib.dumps(pl, fmt=plistlib.FMT_BINARY)


def read_preset(path, names=None):
    """[params] block of a truce .preset file -> {id: plain value}. `names` maps string keys to ids."""
    vals, inside = {}, False
    for line in open(path, encoding="utf-8"):
        line = line.strip()
        if line.startswith("["):
            inside = line == "[params]"
            continue
        if not inside or "=" not in line:
            continue
        k, v = (x.strip() for x in line.split("=", 1))
        v = 1.0 if v == "true" else 0.0 if v == "false" else float(v.strip('"'))
        vals[names[k] if names else int(k)] = v
    return vals


def apply_preset(plugin, values=None, extra=None):
    pl, head, params, ex, persist = split_state(plugin.raw_state)
    if values:
        params = [(pid, values.get(pid, v)) for pid, v in params]
    plugin.raw_state = join_state(pl, head, params, ex if extra is None else extra, persist)


def obx_names():
    src = open(os.path.join(CODE, "obxtra/src/param_ids.rs"), encoding="utf-8").read()
    return {k: int(v) for k, v in re.findall(r'\("(\w+)",\s*(\d+)\)', src)}


# ------------------------------------------------------------------ melodies (public domain)
def chord(t, d, notes, v=90):
    return [(t, d, n, v) for n in notes]


def pachelbel():
    """Canon in D (Pachelbel, c.1680): the eight-chord ground with the descending top line. q = 66."""
    b = 60 / 66
    prog = [(50, [66, 69, 74]), (45, [64, 69, 73]), (47, [66, 71, 74]), (42, [66, 69, 73]),
            (43, [62, 67, 71]), (50, [62, 66, 69]), (43, [62, 67, 71]), (45, [64, 69, 73])]
    top = [78, 76, 74, 73, 71, 69, 71, 73]
    ev = []
    for i, (bass, tri) in enumerate(prog):
        t = i * 2 * b
        ev += chord(t, 2 * b * .98, [bass - 12, bass] + tri, 78)
        ev.append((t, 2 * b * .98, top[i], 96))
    ev += chord(16 * b, 4 * b, [38, 50, 62, 66, 69, 74, 78], 82)
    return ev, 21 * b


def toccata():
    """Toccata in D minor, BWV 565 (J. S. Bach): the opening mordents, run and diminished chord, in octaves."""
    ev = []
    def phrase(t0, o):
        n = lambda m: [m + o, m + o - 12]
        e = []
        e += [(t0, .11, x, 110) for x in n(81)] + [(t0 + .11, .11, x, 105) for x in n(79)] + [(t0 + .22, 1.5, x, 110) for x in n(81)]
        t = t0 + 2.0
        for i, m in enumerate([79, 77, 76, 74]):
            e += [(t + i * .12, .11, x, 100) for x in n(m)]
        e += [(t + .48, .95, x, 108) for x in n(73)] + [(t + 1.5, 1.6, x, 112) for x in n(74)]
        return e
    ev += phrase(0, 0) + phrase(4.0, -12) + phrase(8.0, -24)
    ev.append((12.4, 7.0, 26, 115))
    for i, m in enumerate([49, 52, 55, 58, 61, 64]):
        ev.append((12.9 + i * .32, 6.5 - i * .32, m, 105))
    ev += chord(19.6, 3.6, [38, 50, 53, 57, 62, 65, 69], 112)
    return ev, 24.5


def fur_elise():
    """Für Elise, WoO 59 (Beethoven): the A section. Sixteenth = 0.2 s."""
    s = .2
    rh = [(0, 76), (1, 75), (2, 76), (3, 75), (4, 76), (5, 71), (6, 74), (7, 72), (8, 69, 3),
          (11, 60), (12, 64), (13, 69), (14, 71, 3), (17, 64), (18, 68), (19, 71), (20, 72, 3),
          (23, 64), (24, 76), (25, 75), (26, 76), (27, 75), (28, 76), (29, 71), (30, 74), (31, 72), (32, 69, 3),
          (35, 60), (36, 64), (37, 69), (38, 71, 3), (41, 64), (42, 72), (43, 71), (44, 69, 10)]
    lh = [(8, [45, 52, 57]), (14, [40, 52, 56]), (20, [45, 52, 57]), (32, [45, 52, 57]), (38, [40, 52, 56]), (44, [45, 52, 57])]
    ev = [(t * s, (x[2] if len(x) > 2 else 1.1) * s, x[1], 92) for x in rh for t in [x[0]]]
    for t, notes in lh:
        for i, m in enumerate(notes):
            ev.append(((t + i) * s, (6 - i if t < 44 else 10 - i) * s, m, 70))
    return ev, 58 * s


def moonlight():
    """Piano Sonata No. 14 'Moonlight', 1st movement (Beethoven): bars 1-5. Triplet eighth = 0.33 s."""
    tr = .33
    bars = [((25, 37), [[56, 61, 64]] * 4), ((23, 35), [[56, 61, 64]] * 4),
            ((21, 33), [[57, 61, 64]] * 2 + [[57, 62, 66]] * 2), ((20, 32), [[56, 60, 66], [56, 61, 64], [56, 61, 63], [54, 60, 63]]),
            ((25, 37), [[56, 61, 64]] * 4)]
    ev, t = [], 0.0
    for bi, (bass, beats) in enumerate(bars):
        if bi == 2:  # half-bar change to F#
            ev += chord(t, 6 * tr, list(bass), 72) + chord(t + 6 * tr, 6 * tr, [18, 30], 72)
        else:
            ev += chord(t, 12 * tr, list(bass), 72)
        for k, tri in enumerate(beats):
            for j, m in enumerate(tri):
                ev.append((t + (k * 3 + j) * tr, tr * 1.6, m, 64))
        t += 12 * tr
    ev += [(t - 3 * tr - tr * .5, tr * .75, 68, 92), (t - tr * .75, tr * .5, 68, 88)]
    ev += chord(t, 9 * tr, [25, 37, 56, 61, 64, 68], 80)
    return ev, t + 11 * tr


def gymnopedie():
    """Gymnopédie No. 1 (Satie, 1888): the opening bars. Quarter = 0.78 s."""
    q = .78
    ev = []
    for bar in range(10):
        t = bar * 3 * q
        if bar % 2 == 0:
            ev += [(t, 3 * q, 43, 70)] + chord(t + q, 2 * q, [59, 62, 66], 58)
        else:
            ev += [(t, 3 * q, 38, 70)] + chord(t + q, 2 * q, [57, 61, 66], 58)
    mel = [(4, 1, 78), (4, 2, 81), (5, 0, 79), (5, 1, 78), (5, 2, 73), (6, 0, 71), (6, 1, 73), (6, 2, 74), (7, 0, 69, 3), (8, 0, 66, 6)]
    for m in mel:
        ev.append(((m[0] * 3 + m[1]) * q, (m[3] if len(m) > 3 else 1) * q * .97, m[2], 88))
    return ev, 30 * q + 2.5


# ------------------------------------------------------------------ rendering
def to_midi(events, transpose=0, program=None, start=0.05):
    msgs = [] if program is None else [(bytes([0xC0, program]), 0.0)]
    for t, d, n, v in events:
        n += transpose
        msgs.append((bytes([0x90, n, v]), start + t))
        msgs.append((bytes([0x80, n, 0]), start + t + d))
    return sorted(msgs, key=lambda m: m[1])


def master(audio, reverb=True):
    if reverb:
        audio = pedalboard.Pedalboard([pedalboard.Reverb(room_size=.55, damping=.5, wet_level=.16, dry_level=.9, width=1.0)])(audio, SR)
    peak = np.max(np.abs(audio)) or 1.0
    audio = audio * (10 ** (-1.0 / 20) / peak)
    n = int(.05 * SR)  # fade-in guard + 0.8 s fade-out
    audio[:, :n] *= np.linspace(0, 1, n)
    f = int(.8 * SR)
    audio[:, -f:] *= np.linspace(1, 0, f)
    return audio


def peaks(audio, bins=180):
    x = np.max(np.abs(audio), axis=0)
    step = len(x) // bins
    p = np.array([x[i * step:(i + 1) * step].max() for i in range(bins)])
    p = np.sqrt(p / (p.max() or 1))  # perceptual-ish curve so quiet passages stay visible
    return [round(float(v), 3) for v in p]


def write_mp3(audio, path):
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        wav = tmp.name
    with pedalboard.io.AudioFile(wav, "w", SR, audio.shape[0]) as f:
        f.write(audio.astype(np.float32))
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-ar", "44100", "-codec:a", "libmp3lame", "-b:a", "160k", path], check=True)
    os.unlink(wav)


DEMOS = [
    dict(repo="tyrell80", au="Tyrell80", piece="Pachelbel — Canon in D", sound="Love Theme Strings",
         preset=lambda: read_preset(os.path.join(CODE, "bladerunner80/bank/Vangelis/love-theme-strings.preset")), melody=pachelbel),
    dict(repo="obxtra", au="OBXTRA", piece="Bach — Toccata in D minor, BWV 565", sound="Ensemble Brass",
         preset=lambda: read_preset(os.path.join(CODE, "obxtra/bank/Classics/Archetypes/ensemble-brass.preset"), obx_names()), melody=toccata),
    dict(repo="dxdx7", au="DXDX7", piece="Beethoven — Für Elise", sound="ROM1A · E.PIANO 1", program=10, melody=fur_elise),
    dict(repo="youth106", au="Youth106", piece="Beethoven — Moonlight Sonata", sound="A15 Moving Strings",
         preset=lambda: read_preset(os.path.join(CODE, "youth106/bank/Juno-106 A/A15-moving-strings.preset")), melody=moonlight),
    dict(repo="zynabre", au="Zyn02", piece="Satie — Gymnopédie No. 1", sound="Strings Pad 1 (PADsynth)",
         xmz="banks/Strings/0010-Strings Pad1.xiz", melody=gymnopedie),
]


def main(only=None):
    os.makedirs(OUT, exist_ok=True)
    zyn_src = os.environ.get("ZYNABRE_SRC", "")
    for d in DEMOS:
        if only and d["repo"] not in only:
            continue
        plugin = pedalboard.load_plugin(os.path.join(AU, d["au"] + ".component"))
        if "preset" in d:
            apply_preset(plugin, values=d["preset"]())
        plugin.reset()
        if "xmz" in d:
            # The patch is rebuilt on Zynabre's worker thread and swapped in at a block boundary:
            # process a little silence, give the worker time, then render without resetting.
            apply_preset(plugin, extra=open(os.path.join(zyn_src, d["xmz"]), "rb").read())
            for _ in range(3):
                plugin([], duration=0.5, sample_rate=SR, num_channels=2, reset=False)
                time.sleep(2)
        events, dur = d["melody"]()
        lead = 0.6 if d.get("program") is not None else 0.05  # let a program change land before the first note
        audio = plugin(to_midi(events, program=d.get("program"), start=lead), duration=dur + lead, sample_rate=SR, num_channels=2,
                       buffer_size=512, reset=False)
        if lead > 0.05:
            audio = audio[:, int((lead - 0.05) * SR):]
        audio = master(audio, d.get("reverb", True))
        write_mp3(audio, os.path.join(OUT, d["repo"] + ".mp3"))
        json.dump({"piece": d["piece"], "sound": d["sound"], "duration": round(audio.shape[1] / SR, 2), "peaks": peaks(audio)},
                  open(os.path.join(OUT, d["repo"] + ".json"), "w"))
        rms = float(np.sqrt((audio ** 2).mean()))
        print(f"{d['repo']:10s} {audio.shape[1] / SR:5.1f}s  rms {rms:.3f}")


# Demos recorded elsewhere (e.g. th0nk3000, which needs a sample to collide): only the waveform is computed.
EXTERNAL = [
    dict(repo="th0nk3000", file="thonk.mp3", piece="th0nk3000 demo"),
]


def external():
    for d in EXTERNAL:
        path = os.path.join(OUT, d["file"])
        if not os.path.exists(path):
            continue
        with pedalboard.io.AudioFile(path) as f:
            audio = f.read(f.frames)
            sr = f.samplerate
        meta = {"piece": d["piece"], "file": d["file"], "duration": round(audio.shape[1] / sr, 2), "peaks": peaks(audio)}
        json.dump(meta, open(os.path.join(OUT, d["repo"] + ".json"), "w"))
        print(f"{d['repo']:10s} {meta['duration']:5.1f}s  (external)")


if __name__ == "__main__":
    if sys.argv[1:] == ["external"]:
        external()
    else:
        main(sys.argv[1:])
        external()
