"""Fenly Serif: a variable serif (wght 200 to 900, roman and italic) built from Literata (SIL OFL 1.1).
Changes from Literata: lighter weights (Regular is Literata 330), optical size fixed at 12, x-height 500, letters spaced 10 units wider on each side,
renamed. Everything else is Literata's drawing."""
import glob, os
from fontTools.ttLib import TTFont
from fontTools.ttLib.tables._g_l_y_f import Glyph, GlyphCoordinates
from fontTools.ttLib.tables.ttProgram import Program
from fontTools.varLib import instancer, build as varbuild
from fontTools.designspaceLib import DesignSpaceDocument, SourceDescriptor, AxisDescriptor
from fontTools.otlLib.builder import buildStatTable
import sys

# Literata's variable fonts, from the @fontsource-variable/literata npm package:
#   npm pack @fontsource-variable/literata && tar -xzf fontsource-variable-literata-*.tgz
SRC = sys.argv[1] if len(sys.argv) > 1 else "package/files"
OPSZ, XH, TRACK = 12, 500, 10
WEIGHTS = (200, 300, 400, 500, 700, 900)
# Fenly Serif runs lighter than Literata: its Regular (400) is Literata at 330, its Bold (700) Literata at 620.
WEIGHT_MAP = ((200, 200), (400, 330), (700, 620), (900, 900))

def literata_weight(w):
    for (a, la), (b, lb) in zip(WEIGHT_MAP, WEIGHT_MAP[1:]):
        if a <= w <= b: return la + (lb - la) * (w - a) / (b - a)
    raise ValueError(w)
NAMES = {200: "ExtraLight", 300: "Light", 400: "Regular", 500: "Medium", 600: "SemiBold", 700: "Bold", 800: "ExtraBold", 900: "Black"}
LICENSE = "This Font Software is licensed under the SIL Open Font License, Version 1.1. This license is available with a FAQ at: https://openfontlicense.org"
COPYRIGHT = "Copyright 2017 The Literata Project Authors (https://github.com/googlefonts/literata). Roman s: Copyright 2020 The Domine Project Authors (https://github.com/googlefonts/domine). Fenly Serif changes copyright 2026 Felipe Linares."


def flat(f):
    glyf = f["glyf"]; out = {}
    def fl(g):
        gl = glyf[g]
        if gl.isComposite():
            C, E, F = [], [], []
            for c in gl.components:
                cc, ee, ff = fl(c.glyphName); off = len(C)
                if hasattr(c, "transform"):
                    (xx, xy), (yx, yy) = c.transform; cc = [(x * xx + y * yx, x * xy + y * yy) for x, y in cc]
                C += [(x + c.x, y + c.y) for x, y in cc]; E += [e + off for e in ee]; F += list(ff)
            return C, E, F
        if gl.numberOfContours <= 0: return [], [], []
        co, ep, flg = gl.getCoordinates(glyf); return list(co), list(ep), list(flg)
    for g in f.getGlyphOrder(): out[g] = fl(g)
    return out

def lowers(f):
    cm = f.getBestCmap(); s = {g for u, g in cm.items() if chr(u).islower()}
    s |= {g for g in f.getGlyphOrder() if g.startswith(("f_", "dotless")) or g in ("idotless", "jdotless")}
    s |= {g for u, g in cm.items() if 0x300 <= u <= 0x36F}
    return s


def drop_feature(f, tag):
    """Literata swaps a few glyphs at heavy weights (rvrn). Masters must share features, so the swap goes."""
    t = f["GSUB"].table
    if getattr(t, "FeatureVariations", None): t.FeatureVariations = None
    recs = t.FeatureList.FeatureRecord
    keep = [i for i, r in enumerate(recs) if r.FeatureTag != tag]
    remap = {old: new for new, old in enumerate(keep)}
    t.FeatureList.FeatureRecord = [recs[i] for i in keep]; t.FeatureList.FeatureCount = len(keep)
    for sr in t.ScriptList.ScriptRecord:
        langs = [sr.Script.DefaultLangSys] + [l.LangSys for l in sr.Script.LangSysRecord]
        for ls in langs:
            if ls is None: continue
            ls.FeatureIndex = [remap[i] for i in ls.FeatureIndex if i in remap]; ls.FeatureCount = len(ls.FeatureIndex)
            if ls.ReqFeatureIndex != 0xFFFF: ls.ReqFeatureIndex = remap.get(ls.ReqFeatureIndex, 0xFFFF)

# The roman s comes from Domine (SIL OFL 1.1, The Domine Project Authors): its ball terminals, fitted to Fenly
# Serif's x-height, width and weight. Domine ships with Seed, next to this script's output.
DOMINE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../packages/tokens/src/fonts/Domine-Variable.woff2")
_dom = {}

def domine(w):
    if w not in _dom:
        f = instancer.instantiateVariableFont(TTFont(DOMINE), {"wght": w}); g = f["glyf"]
        _dom[w] = (flat(f), contour_stem(g, "o"))
    return _dom[w]

def contour_stem(glyf, name):
    """The o's left stem: from the outer contour's left edge to the counter's."""
    c, ep, _ = glyf[name].getCoordinates(glyf); xs = [p[0] for p in c]
    return min(xs[ep[0] + 1:ep[1] + 1]) - min(xs[:ep[0] + 1])

def domine_s(fenly_glyf, target_box):
    """Domine's s at the weight whose o stem, once scaled, matches Fenly Serif's; placed in target_box."""
    (P4, st4), (P7, st7) = domine(400), domine(700)
    c4, ep, fl = P4["s"]; c7 = P7["s"][0]
    x0, y0, x1, y1 = target_box
    xs4 = [p[0] for p in c4]; sx = (x1 - x0) / (max(xs4) - min(xs4))
    # Domine stops at Bold: past that its s distorts, so the heaviest weights keep a slightly lighter s.
    t = max(-1.0, min(1.3, (contour_stem(fenly_glyf, "o") / sx - st4) / (st7 - st4)))
    co = [(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t) for a, b in zip(c4, c7)]
    xs, ys = [p[0] for p in co], [p[1] for p in co]
    sx = (x1 - x0) / (max(xs) - min(xs)); sy = XH / 540
    return [(x0 + (x - min(xs)) * sx, (y + 10) * sy - 10 * r_ov) for x, y in co], list(ep), list(fl)

r_ov = 1.0

def master(style, w, out):
    base = os.path.join(SRC, f"literata-latin-standard-{style}.woff2")
    f = instancer.instantiateVariableFont(TTFont(base), {"opsz": OPSZ, "wght": literata_weight(w)})
    lo = lowers(f); P = flat(f)
    xh0 = 507; r = XH / xh0; ov = xh0 * 1.02; shift = ov - ov * r
    fy = lambda y: y if y < 0 else (y * r if y <= ov else y - shift)
    glyf, hm = f["glyf"], f["hmtx"]
    for g in f.getGlyphOrder():
        co, ep, fl = P[g]; isl = g in lo
        if g == "s" and style == "normal":
            xs = [p[0] for p in co]
            co, ep, fl = domine_s(f["glyf"], (min(xs), 0, max(xs), XH)); isl = False
        gl = Glyph()
        if co:
            gl.numberOfContours = len(ep)
            gl.coordinates = GlyphCoordinates([(round(x + TRACK), round(fy(y) if isl else y)) for x, y in co])
            gl.endPtsOfContours = ep; gl.flags = bytearray(fl); gl.program = Program(); gl.program.fromBytecode(b""); gl.recalcBounds(glyf)
        else:
            gl.numberOfContours = 0
        glyf[g] = gl
        adv = hm[g][0]; hm[g] = (adv + 2 * TRACK if adv else 0, gl.xMin if co else 0)
    for lk in f["GPOS"].table.LookupList.Lookup:
        for st in lk.SubTable:
            t = lk.LookupType
            if t == 9: st, t = st.ExtSubTable, st.ExtensionLookupType
            if t in (4, 5, 6):
                if t == 4:
                    for g, br in zip(st.BaseCoverage.glyphs, st.BaseArray.BaseRecord):
                        for a in br.BaseAnchor:
                            if a: a.XCoordinate += TRACK; a.YCoordinate = round(fy(a.YCoordinate)) if g in lo else a.YCoordinate
                    for g, mr in zip(st.MarkCoverage.glyphs, st.MarkArray.MarkRecord):
                        a = mr.MarkAnchor; a.XCoordinate += TRACK
                        if g in lo: a.YCoordinate = round(fy(a.YCoordinate))
    from fontTools import subset
    tags = {r.FeatureTag for tb in ("GSUB", "GPOS") for r in f[tb].table.FeatureList.FeatureRecord} - {"rvrn"}
    o = subset.Options(); o.layout_features = sorted(tags); o.name_IDs = ["*"]; o.name_languages = ["*"]; o.notdef_outline = True
    o.glyph_names = True; o.legacy_kern = True; o.hinting = False; o.layout_closure = False; o.drop_tables = []
    sb = subset.Subsetter(o); sb.populate(glyphs=f.getGlyphOrder()); sb.subset(f)
    os2 = f["OS/2"]; os2.sxHeight = XH; os2.usWeightClass = w
    for t in ("STAT", "MVAR", "HVAR", "VVAR"):
        if t in f: del f[t]
    f.save(out)

def family(style):
    ital = style == "italic"
    fam = "Fenly Serif"; ds = DesignSpaceDocument()
    ax = AxisDescriptor(); ax.tag, ax.name, ax.minimum, ax.default, ax.maximum = "wght", "Weight", 200, 400, 900; ds.addAxis(ax)
    os.makedirs("masters", exist_ok=True)  # throwaway static masters
    for w in WEIGHTS:
        p = f"masters/{style}-{w}.ttf"; master(style, w, p)
        s = SourceDescriptor(); s.path = p; s.location = {"Weight": w}; s.familyName = fam; s.styleName = NAMES[w]
        ds.addSource(s)
    vf, _, _ = varbuild(ds)
    n = vf["name"]
    for rid in (0, 1, 2, 3, 4, 6, 13, 14, 16, 17, 25): n.removeNames(nameID=rid)
    sub = "Italic" if ital else "Regular"
    n.setName(COPYRIGHT, 0, 3, 1, 0x409); n.setName(fam, 1, 3, 1, 0x409); n.setName(sub, 2, 3, 1, 0x409)
    n.setName(f"2.000;Fenly;FenlySerif-{sub}", 3, 3, 1, 0x409); n.setName(f"{fam} {sub}", 4, 3, 1, 0x409)
    n.setName(f"FenlySerif-{sub}", 6, 3, 1, 0x409); n.setName(LICENSE, 13, 3, 1, 0x409); n.setName("https://openfontlicense.org", 14, 3, 1, 0x409)
    n.setName(f"FenlySerif{'Italic' if ital else ''}", 25, 3, 1, 0x409)
    # Named weights, so desktop apps (Font Book, Figma) list ExtraLight to Black instead of one "Regular".
    from fontTools.ttLib.tables._f_v_a_r import NamedInstance
    vf["fvar"].instances = []
    for w in (200, 300, 400, 500, 600, 700, 800, 900):
        inst = NamedInstance()
        inst.coordinates = {"wght": w}
        style = (NAMES[w] + (" Italic" if ital else "")).replace("Regular Italic", "Italic")
        inst.subfamilyNameID = n.addMultilingualName({"en": style}, mac=False)
        inst.postscriptNameID = n.addMultilingualName({"en": f"FenlySerif-{style.replace(' ', '')}"}, mac=False)
        vf["fvar"].instances.append(inst)
    buildStatTable(vf, [{"tag": "wght", "name": "Weight", "values": [{"value": w, "name": NAMES[w], **({"flags": 2, "linkedValue": 700} if w == 400 else {})} for w in (200, 300, 400, 500, 600, 700, 800, 900)]},
                        {"tag": "ital", "name": "Italic", "values": [{"value": 1 if ital else 0, "name": "Italic" if ital else "Roman", **({} if ital else {"flags": 2, "linkedValue": 1})}]}])
    vf["OS/2"].fsSelection = (vf["OS/2"].fsSelection & ~0b1100001) | (0b1 if ital else 0b1000000)
    vf["head"].macStyle = 2 if ital else 0
    vf["post"].italicAngle = vf["post"].italicAngle
    vf.save(f"FenlySerif{'-Italic' if ital else ''}[wght].ttf")  # for desktop apps (Font Book, Figma)
    vf.flavor = "woff2"; out = f"FenlySerif-{'Italic-' if ital else ''}Variable.woff2"; vf.save(out); print(out, os.path.getsize(out) // 1024, "KB")

if __name__ == "__main__":
    family("normal"); family("italic")
