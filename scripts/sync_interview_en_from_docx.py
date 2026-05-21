#!/usr/bin/env python3
"""
Extract qEn / aEn from interview Word documents in data/*.docx and merge into
JSON interview files + inline interviewContent in js/role-interviews.js.

Run from repo root: python3 scripts/sync_interview_en_from_docx.py
"""
from __future__ import annotations

import json
import re
import zipfile
from collections import OrderedDict
from pathlib import Path
from typing import Any
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"


def read_docx_paras(path: Path) -> list[str]:
    with zipfile.ZipFile(path) as z:
        root = ET.fromstring(z.read("word/document.xml"))
    paras: list[str] = []
    for p in root.iter():
        if not p.tag.endswith("}p"):
            continue
        texts: list[str] = []
        for node in p.iter():
            if node.tag.endswith("}t"):
                if node.text:
                    texts.append(node.text)
                if node.tail:
                    texts.append(node.tail)
        s = "".join(texts).strip()
        if s:
            paras.append(s)
    return paras


def has_hangul(s: str) -> bool:
    return bool(re.search(r"[\uac00-\ud7af]", s))


def _nq(s: str) -> str:
    """Normalize KR question text so Word vs site spacing differences still match."""
    return re.sub(r"\s+", " ", (s or "").strip())


def expand_glued_qa(blob: str) -> list[str]:
    """
    Split question + answer mistakenly glued into one DOCX paragraph.

    Covers:
      - "...?We..." (missing newline after '?')
      - "...team.The System..." / "...Lab.The ESB..." (missing space after '.'; lower + '.' + uppercase)
    """
    blob = blob.strip()
    m = re.match(r"^(.*?\?)((?:\s*)[A-Z].*)$", blob, flags=re.DOTALL)
    if m:
        return [m.group(1).strip(), m.group(2).strip()]
    m2 = re.search(r"(?<=[a-z])(\.)(?=[A-Z])", blob)
    if m2:
        left = blob[: m2.start()].strip()
        right = blob[m2.end() :].strip()
        if left and not re.search(r"[.?!]$", left):
            left = f"{left}?"
        return [left, right]
    return [blob]


def sanitize_ee_layout_paragraphs(paras: list[str]) -> list[str]:
    """
    Drop English-only spacer lines between personas in EE.docx (section labels),
    otherwise they attach to previous English answers.
    """
    drop_re = re.compile(
        r"^(?:Validation Division|System Product Investigation Division|PQPQ Engineering Excellence|"
        r"Chief AI\s*&\s*New Tech\.\s*Strategy|Product Excellence Team)$",
        re.I | re.MULTILINE,
    )
    return [p for p in paras if not (not has_hangul(p) and drop_re.fullmatch((p or "").strip()))]


def fix_product_excellence_en_order(block: list[str]) -> list[str]:
    """
    Gayeon Lee chunk: DOCX puts competency English (Q + two answer paras) after team English
    without a Korean competency row. Flex parsing would merge that into 팀 소개 aEn.

    Insert a synthetic competency question line from site JSON so KR Q + EN Q align.
    """
    comp_kr = "업무 수행에 필요한 역량은 무엇이라고 생각하시나요?"
    comp_q = "Which capabilities do we need to have for your role?"
    try:
        team_en_i = next(i for i, p in enumerate(block) if p.strip() == "Please introduce your team.")
    except StopIteration:
        return block
    k = team_en_i + 1
    while k < len(block) and not has_hangul(block[k]):
        if block[k].strip() == comp_q:
            return block[:k] + [comp_kr] + block[k:]
        k += 1
    return block


def expand_en_parts(parts: list[str]) -> list[str]:
    out: list[str] = []
    for p in parts:
        out.extend(expand_glued_qa(p))
    return out


def parse_flex_interview(paras: list[str], questions: list[dict[str, Any]]) -> list[dict[str, str | None]]:
    """
    Returns list of {kr_q, qEn, aEn} in order, matching `questions` length when possible.
    If a Korean question row is missing in the document, kr_q is None for that slot.
    """
    i = 0
    n = len(paras)
    out: list[dict[str, str | None]] = []

    for _exp in questions:
        if i >= n:
            break

        if has_hangul(paras[i]) and _nq(paras[i]) == _nq(str(_exp["q"])):
            kr_q = str(_exp["q"]).strip()
            i += 1
            kr_buf: list[str] = []
            while i < n and has_hangul(paras[i]):
                kr_buf.append(paras[i])
                i += 1
        else:
            kr_q = None

        en_buf: list[str] = []
        while i < n and not has_hangul(paras[i]):
            en_buf.append(paras[i])
            i += 1

        en_buf = expand_en_parts(en_buf)
        if not en_buf:
            continue
        q_en = en_buf[0].strip()
        a_en = "\n\n".join(x.strip() for x in en_buf[1:]).strip() if len(en_buf) > 1 else ""
        out.append({"kr_q": kr_q, "qEn": q_en, "aEn": a_en})

    return out




def merge_by_kr(
    questions: list[dict[str, Any]], doc_items: list[dict[str, str | None]]
) -> None:
    by_kr: dict[str, dict[str, str | None]] = {}
    order_none: list[dict[str, str | None]] = []
    for it in doc_items:
        k = it.get("kr_q")
        if k:
            by_kr[_nq(str(k))] = it
        else:
            order_none.append(it)

    missing_idx = 0
    for q in questions:
        key = _nq(q["q"])
        if key in by_kr:
            q["qEn"] = by_kr[key]["qEn"]
            q["aEn"] = by_kr[key]["aEn"]
        elif missing_idx < len(order_none):
            it = order_none[missing_idx]
            q["qEn"] = it["qEn"]
            q["aEn"] = it["aEn"]
            missing_idx += 1

def load_json_ordered(path: Path) -> OrderedDict[str, Any]:
    with path.open(encoding="utf-8") as f:
        return json.load(f, object_pairs_hook=OrderedDict)


def save_json(path: Path, data: OrderedDict[str, Any]) -> None:
    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")


def format_js_value(s: str) -> str:
    if "\n" in s or "`" in s:
        esc = s.replace("\\", "\\\\").replace("`", "\\`")
        return f"`{esc}`"
    esc = s.replace("\\", "\\\\").replace('"', '\\"')
    return f'"{esc}"'


def replace_qen_aen_block(
    text: str, q_kr: str, new_qen: str, new_aen: str, range_start: int = 0, range_end: int | None = None
) -> str:
    window = text if range_end is None else text[range_start:range_end]
    rel_offset = range_start

    needle = f'qKr: "{q_kr}"'
    i = window.find(needle)
    if i < 0:
        alt = f"qKr: `{q_kr}`"
        i = window.find(alt)
        if i < 0:
            raise ValueError(f"qKr anchor not found: {q_kr[:60]}…")

    i += rel_offset

    qen_i = text.find("qEn:", i)
    if qen_i < 0:
        raise ValueError("qEn not found after qKr")

    def skip_value(t: str, start: int) -> int:
        j = start
        while j < len(t) and t[j] in " \t":
            j += 1
        if j >= len(t):
            return j
        q = t[j]
        if q == '"':
            j += 1
            while j < len(t):
                if t[j] == "\\":
                    j += 2
                    continue
                if t[j] == '"':
                    return j + 1
                j += 1
            return j
        if q == "`":
            j += 1
            while j < len(t):
                if t[j] == "\\":
                    j += 2
                    continue
                if t[j] == "`":
                    return j + 1
                j += 1
            return j
        raise ValueError(f"Unexpected qEn/aEn opener at {j}: {t[j : j + 20]!r}")

    aen_label = text.find("aEn:", qen_i)
    if aen_label < 0:
        raise ValueError("aEn not found")

    qen_val_start = qen_i + len("qEn:")
    qen_end = skip_value(text, qen_val_start)

    aen_val_start = aen_label + len("aEn:")
    aen_end = skip_value(text, aen_val_start)

    new_text = (
        text[:qen_val_start]
        + format_js_value(new_qen)
        + text[qen_end:aen_val_start]
        + format_js_value(new_aen)
        + text[aen_end:]
    )
    return new_text


def js_object_slice(text: str, key: str, next_key: str | None) -> tuple[int, int]:
    needle = f'"{key}":'
    s = text.find(needle)
    if s < 0:
        raise ValueError(f'interview key not in JS: "{key}"')
    if next_key is None:
        mosaic = "\n/**\n * Our Story 모자이크:"
        n = text.find(mosaic, s + len(needle))
        if n < 0:
            raise ValueError("Could not find end of interviewContent (mosaic marker)")
        return s, n
    n = text.find(f'"{next_key}":', s + len(needle))
    if n < 0:
        raise ValueError(f'next JS key after "{key}" not found: "{next_key}"')
    return s, n


def split_pipg_sections(paras: list[str]) -> dict[str, list[str]]:
    markers = ["PSC", "Thermal", "VPD/PID", "PGTLO"]
    idxs: list[int] = []
    for m in markers:
        idxs.append(next(i for i, p in enumerate(paras) if p.strip() == m))
    chunks: dict[str, list[str]] = {}
    for si, m in enumerate(markers):
        start_q = idxs[si] + 2
        end = idxs[si + 1] if si + 1 < len(markers) else len(paras)
        chunks[m] = paras[start_q:end]
    return chunks


def main() -> None:
    beca_path = DATA / "interview-content-beca-itpe-ss.json"
    ee_path = DATA / "interview-content-ee.json"
    ve_path = DATA / "interview-content-ve.json"
    js_path = ROOT / "js" / "role-interviews.js"

    beca = load_json_ordered(beca_path)
    ee = load_json_ordered(ee_path)
    ve = load_json_ordered(ve_path)

    # --- BECA / ITPE / SS ---
    beca_itpe_ss_specs: list[tuple[str, Path, list[str]]] = [
        ("BECA.docx", DATA / "BECA.docx", list(beca.keys())[:4]),
        ("ITPE.docx", DATA / "ITPE.docx", list(beca.keys())[4:8]),
        ("Software Services.docx", DATA / "Software Services.docx", list(beca.keys())[8:11]),
    ]

    for _label, doc_path, keys in beca_itpe_ss_specs:
        paras = read_docx_paras(doc_path)
        anchored: list[tuple[str, int]] = []
        pos = 0
        for k in keys:
            anchor = beca[k]["questions"][0]["q"].strip()
            idx = next((i for i in range(pos, len(paras)) if paras[i].strip() == anchor), None)
            if idx is None:
                raise SystemExit(f"Missing anchor for {k} in {doc_path.name}: {anchor!r}")
            anchored.append((k, idx))
            pos = idx + 1
        for bi, (k, s) in enumerate(anchored):
            e = anchored[bi + 1][1] if bi + 1 < len(anchored) else len(paras)
            doc_items = parse_flex_interview(paras[s:e], beca[k]["questions"])
            merge_by_kr(beca[k]["questions"], doc_items)

    # --- Engineering Excellence ---
    ee_paras = sanitize_ee_layout_paragraphs(read_docx_paras(DATA / "Engineering Excellence.docx"))
    ee_keys = list(ee.keys())
    ee_starts: dict[str, int | None] = {}

    def find_anchor(anchor: str, pos: int) -> int | None:
        return next((i for i in range(pos, len(ee_paras)) if ee_paras[i].strip() == anchor), None)

    ee_starts["ee-certification"] = find_anchor(ee["ee-certification"]["questions"][0]["q"].strip(), 0)

    spi_anchor = ee["ee-system-investigation-1"]["questions"][0]["q"].strip()
    spi_here = find_anchor(spi_anchor, 0)
    ee_starts["ee-system-investigation-1"] = spi_here
    # Second carousel persona is not duplicated in EE.docx; keep JSON qEn/aEn untouched.
    ee_starts["ee-system-investigation-2"] = None

    ee_starts["ee-verification-1"] = find_anchor(
        ee["ee-verification-1"]["questions"][0]["q"].strip(), 0
    )
    ee_starts["ee-verification-2"] = None

    prod_anchor = ee["ee-product-excellence"]["questions"][0]["q"].strip()
    prod_hits = [i for i, p in enumerate(ee_paras) if p.strip() == prod_anchor]
    if len(prod_hits) < 2:
        raise SystemExit(
            "Expected ≥2 occurrences of Product Excellence opener in EE.docx "
            f"({prod_anchor!r}), got {len(prod_hits)}"
        )
    ee_starts["ee-product-excellence"] = prod_hits[1]

    ee_starts["ee-quality"] = find_anchor(ee["ee-quality"]["questions"][0]["q"].strip(), 0)

    ai_anchor = ee["ee-ai-chief"]["questions"][0]["q"].strip()
    ai_hits = [i for i, p in enumerate(ee_paras) if p.strip() == ai_anchor]
    if len(ai_hits) < 3:
        raise SystemExit(
            "Expected ≥3 occurrences of AI Chief opener in EE.docx "
            f"({ai_anchor!r}), got {len(ai_hits)}"
        )
    ee_starts["ee-ai-chief"] = ai_hits[2]

    boundaries = sorted({v for v in ee_starts.values() if v is not None})
    for kid in ee_keys:
        s = ee_starts.get(kid)
        if s is None:
            continue
        block_end = min((u for u in boundaries if u > s), default=len(ee_paras))
        block = ee_paras[s:block_end]
        if kid == "ee-product-excellence":
            block = fix_product_excellence_en_order(block)
        doc_items = parse_flex_interview(block, ee[kid]["questions"])
        merge_by_kr(ee[kid]["questions"], doc_items)

    # --- VE: three document sections ---
    ve_paras = read_docx_paras(DATA / "VE.docx")
    spi_end = next(i for i, p in enumerate(ve_paras) if p.strip() == "Virtual Integration Center & ADAS")
    vic_end = next(i for i, p in enumerate(ve_paras) if p.strip() == "Virtual Engineering Solution")

    ve_map = [
        ("ve-ve-safety-performance-1", ve_paras[3:spi_end]),
        ("ve-ve-virtual-integration-1", ve_paras[31:vic_end]),
        ("ve-ve-virtual-engineering-solution-1", ve_paras[62:]),
    ]
    for kid, block in ve_map:
        doc_items = parse_flex_interview(block, ve[kid]["questions"])
        merge_by_kr(ve[kid]["questions"], doc_items)

    # --- AVD / SVI + PIPG (inline JS) ---
    avd_paras = read_docx_paras(DATA / "AVD SVI.docx")
    avd_split = next(i for i, p in enumerate(avd_paras) if p.strip() == "Studio & Surface Integration")
    block_avd = avd_paras[3:avd_split]
    block_svi = avd_paras[avd_split + 2 :]

    q_avd_template = [
        {"q": "AVD 담당은 어떤 일을 하는 곳인가요?"},
        {"q": "AVD 담당은 고객에게 왜 중요한가요?"},
        {"q": "AVD 담당 업무를 위해 필요한 역량은 무엇이라고 생각하나요?"},
        {"q": "AVD 담당의 매력은?"},
        {"q": "앞으로 AVD 담당이 지향하는 목표는 무엇인가요?"},
    ]
    doc_avd = parse_flex_interview(block_avd, q_avd_template)  # type: ignore[arg-type]

    q_svi = [
        {"q": "SSI 담당은 어떤 일을 하는 곳인가요?"},
        {"q": "SSI 담당은 고객에게 왜 중요한가요?"},
        {"q": "차량 개발 과정의 언제부터 SSI가 참여하나요?"},
        {"q": "SSI담당에서 일하시는 분들은 주로 어떤 전공 출신인가요?"},
        {"q": "앞으로 SSI 담당이 지향하는 목표는 무엇인가요?"},
    ]
    doc_svi = parse_flex_interview(block_svi, q_svi)  # type: ignore[arg-type]

    pipg_paras = read_docx_paras(DATA / "PIPG.docx")
    pipg_chunks = split_pipg_sections(pipg_paras)

    js_text = js_path.read_text(encoding="utf-8")

    avd_rng = js_object_slice(js_text, "avd-advanced-vehicle", "avd-studio-surface")
    svi_rng = js_object_slice(js_text, "avd-studio-surface", "pipg-psc")

    # Apply AVD from doc_avd / doc_svi into JS by qKr matching
    avd_q_kr = [x["q"] for x in q_avd_template]
    svi_q_kr = [x["q"] for x in q_svi]
    avd_by_kr = {d["kr_q"]: d for d in doc_avd if d.get("kr_q")}
    svi_by_kr = {d["kr_q"]: d for d in doc_svi if d.get("kr_q")}

    for qk in avd_q_kr:
        d = avd_by_kr.get(qk)
        if not d:
            continue
        js_text = replace_qen_aen_block(
            js_text, qk, str(d["qEn"]), str(d["aEn"]), range_start=avd_rng[0], range_end=avd_rng[1]
        )

    for qk in svi_q_kr:
        d = svi_by_kr.get(qk)
        if not d:
            continue
        js_text = replace_qen_aen_block(
            js_text, qk, str(d["qEn"]), str(d["aEn"]), range_start=svi_rng[0], range_end=svi_rng[1]
        )

    pipg_question_lists: dict[str, list[str]] = {
        "pipg-psc": [
            "담당 소개 및 현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
            "하루 업무에 대해 소개해주세요.",
            "담당하고 있는 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
            "팀 문화나 함께 일하시는 우리 팀 동료들은 어떤가요?",
            "앞으로의 목표 또는 커리어 방향",
        ],
        "pipg-thermal": [
            "담당 소개 및 현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
            "담당하고 있는 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
            "진행하셨던 프로젝트 중 인상깊었던 프로젝트가 있나요?",
            "팀 문화나 함께 일하시는 우리 팀 동료들은 어떤가요?",
            "앞으로의 목표 또는 커리어 방향",
        ],
        "pipg-vpd-pid": [
            "담당 소개 및 현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
            "담당 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
            "진행하셨던 프로젝트 중 인상깊었던 프로젝트가 있나요?",
            "팀 문화나 함께 일하시는 우리 팀 동료들은 어떤가요?",
            "내게 GMTCK란?",
        ],
        "pipg-pgtlo": [
            "담당 소개 및 현재 담당하고 계신 업무에 대해 구체적으로 알려주세요.",
            "담당 업무를 위해 필요한 역량은 무엇이라고 생각하나요?",
            "진행하셨던 프로젝트 중 인상깊었던 프로젝트가 있나요?",
            "팀 문화나 함께 일하시는 우리 팀 동료들은 어떤가요?",
            "내게 GMTCK란?",
        ],
    }

    pipg_ordered = [
        ("pipg-psc", "PSC", "pipg-vpd-pid"),
        ("pipg-vpd-pid", "VPD/PID", "pipg-thermal"),
        ("pipg-thermal", "Thermal", "pipg-pgtlo"),
        ("pipg-pgtlo", "PGTLO", None),
    ]
    for js_key, sec, next_js in pipg_ordered:
        chunk = pipg_chunks[sec]
        tmpl = [{"q": q} for q in pipg_question_lists[js_key]]
        items = parse_flex_interview(chunk, tmpl)  # type: ignore[arg-type]
        by_kr = {str(x["kr_q"]): x for x in items if x.get("kr_q")}
        pr, pe = js_object_slice(js_text, js_key, next_js)
        for qk in pipg_question_lists[js_key]:
            d = by_kr.get(qk)
            if d:
                js_text = replace_qen_aen_block(
                    js_text, qk, str(d["qEn"]), str(d["aEn"]), range_start=pr, range_end=pe
                )

    save_json(beca_path, beca)
    save_json(ee_path, ee)
    save_json(ve_path, ve)

    js_path.write_text(js_text, encoding="utf-8")

    print("Updated:", beca_path.relative_to(ROOT))
    print("Updated:", ee_path.relative_to(ROOT))
    print("Updated:", ve_path.relative_to(ROOT))
    print("Updated:", js_path.relative_to(ROOT))


if __name__ == "__main__":
    main()
