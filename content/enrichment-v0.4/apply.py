#!/usr/bin/env python3
"""Merge the v0.4 enrichment texts (content/enrichment-v0.4/*.json) into data/*.json.

Each batch file: {"kind": "deep-sky" | "stars" | "constellations" | "planets",
                  "items": {"<id>": {field: text, ...}}}
Fields: name_ja, highlight, distance_text, size_text, recommended_magnification, overview, story, science, latest, observing, history, myth, sources (list).
explanation.raw_html is rebuilt from the sections (apps prefer raw_html; older apps fall back
to overview / observing / science / history).
"""
import glob, html, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
FILES = {"deep-sky": "deep-sky.json", "stars": "stars.json", "constellations": "constellations.json", "planets": "planets.json"}
SECTIONS = [("overview", "概要"), ("story", "物語"), ("science", "天文学的な見どころ"), ("latest", "最新の観測・探査"),
            ("myth", "神話・由来"), ("observing", "観測のポイント"), ("history", "歴史・名前")]

def raw_html(e):
    parts = []
    for key, head in SECTIONS:
        t = e.get(key)
        if t:
            paras = "".join(f"<p>{html.escape(p)}</p>" for p in str(t).split("\n\n") if p.strip())
            parts.append(f'<div class="story-topic"><h4>{head}</h4>{paras}</div>')
    return "".join(parts)

def main():
    data = {k: json.load(open(os.path.join(ROOT, "data", f), encoding="utf-8")) for k, f in FILES.items()}
    index = {k: {x["id"]: x for x in v} for k, v in data.items()}
    applied = {k: 0 for k in FILES}
    for path in sorted(glob.glob(os.path.join(os.path.dirname(__file__), "*.json"))):
        batch = json.load(open(path, encoding="utf-8"))
        kind = batch["kind"]
        for oid, patch in batch["items"].items():
            obj = index[kind].get(oid)
            if obj is None:
                sys.exit(f"{os.path.basename(path)}: unknown {kind} id {oid}")
            e = obj.setdefault("explanation", {})
            for key, _ in SECTIONS:
                if key in patch:
                    e[key] = patch[key]
            if "name_ja" in patch:
                obj["name"]["ja"] = patch["name_ja"]
            for field in ("highlight", "distance_text", "size_text", "recommended_magnification"):
                if field in patch:
                    obj[field] = patch[field]
            if "sources" in patch:
                e["sources"] = patch["sources"]
            e["enrichment"] = {"version": "0.4.0", "batch": os.path.basename(path)}
            e["raw_html"] = raw_html(e)
            applied[kind] += 1
    for k, f in FILES.items():
        with open(os.path.join(ROOT, "data", f), "w", encoding="utf-8") as fh:
            json.dump(data[k], fh, ensure_ascii=False, indent=2)
            fh.write("\n")
    print("applied", applied)

if __name__ == "__main__":
    main()
