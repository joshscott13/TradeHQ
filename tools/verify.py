"""Verify local Markdown links, board references, and generated status."""
from __future__ import annotations

import re
from pathlib import Path
from urllib.parse import unquote, urlsplit

from status.render import ROOT, load_board, render


def without_fences(text: str) -> str:
    lines = []
    fence = None
    for line in text.splitlines():
        match = re.match(r"^\s{0,3}(`{3,}|~{3,})", line)
        if match:
            marker = match[1]
            if fence is None:
                fence = marker
            elif marker[0] == fence[0] and len(marker) >= len(fence):
                fence = None
            lines.append("")
        else:
            lines.append(line if fence is None else "")
    return "\n".join(lines)


def anchors(text: str) -> set[str]:
    found = set()
    counts: dict[str, int] = {}
    previous = ""
    for line in without_fences(text).splitlines():
        heading = re.match(r"^\s{0,3}#{1,6}\s+(.+?)(?:\s+#+)?\s*$", line)
        title = heading[1] if heading else (previous.strip() if re.match(r"^\s{0,3}(?:=+|-+)\s*$", line) and previous.strip() else None)
        if title:
            title = re.sub(r"!?\[([^]]+)\]\([^)]*\)", r"\1", title)
            title = re.sub(r"<[^>]+>", "", title)
            slug = re.sub(r"[^\w\- ]", "", title.lower()).replace(" ", "-")
            count = counts.get(slug, 0)
            counts[slug] = count + 1
            found.add(slug if count == 0 else f"{slug}-{count}")
        previous = line
    found.update(re.findall(r'<(?:a|h[1-6])\b[^>]*\b(?:id|name)=["\']([^"\']+)["\']', text, re.I))
    return found


def check_target(root: Path, source: Path, target: str) -> str | None:
    target = target.strip().strip("<>")
    parsed = urlsplit(target)
    if parsed.scheme or parsed.netloc:
        return None
    if not parsed.path and not parsed.fragment:
        return None
    path = (source.parent / unquote(parsed.path)).resolve() if parsed.path else source
    if not path.is_relative_to(root.resolve()):
        return f"local link escapes repository: {target}"
    if not path.exists():
        return f"missing local target: {target}"
    if parsed.fragment:
        if path.suffix.lower() != ".md":
            return f"cannot verify anchor in non-Markdown target: {target}"
        if unquote(parsed.fragment) not in anchors(path.read_text(encoding="utf-8")):
            return f"missing anchor: {target}"
    return None


def verify(root: Path) -> list[str]:
    errors = []
    for source in sorted(root.rglob("*.md")):
        if any(part in {".git", "node_modules", ".venv"} for part in source.relative_to(root).parts):
            continue
        text = without_fences(source.read_text(encoding="utf-8"))
        # Inline destinations may be angle-bracketed or followed by a quoted title.
        targets = re.findall(r"!?\[[^\]\n]*\]\((<[^>]+>|[^\s)]+)(?:\s+[\"'][^\n]*?[\"'])?\)", text)
        definitions = {match[1].strip().lower(): match[2] for match in re.finditer(r"^\s{0,3}\[([^]]+)\]:\s*(<[^>]+>|\S+)", text, re.M)}
        targets.extend(definitions.values())
        for label, reference in re.findall(r"!?\[([^]\n]+)\]\[([^]\n]*)\]", text):
            key = (reference or label).strip().lower()
            if key not in definitions:
                errors.append(f"{source.relative_to(root)}: missing reference definition: {key}")
        for target in targets:
            error = check_target(root, source, target)
            if error:
                errors.append(f"{source.relative_to(root)}: {error}")
    try:
        _, board = load_board(root)
        matrix = (root / "docs/testing/test-matrix.md").read_text(encoding="utf-8")
        cases = set(re.findall(r"^\|\s*([A-Z]+-\d+)\s*\|", matrix, re.M))
        for task in board["tasks"]:
            for case in task["matrix"]:
                if case not in cases:
                    errors.append(f"{task['id']}: unknown test matrix case {case}")
            for target in task["spec"] + task["docs"] + ([task["adr"]] if task["adr"] else []):
                error = check_target(root, root / "board.md", target)
                if error:
                    errors.append(f"{task['id']}: {error}")
        status = root / "STATUS.md"
        if not status.exists() or status.read_text(encoding="utf-8") != render(root):
            errors.append("STATUS.md drift: run python tools/status/render.py")
    except (ValueError, OSError) as error:
        errors.append(f"Board error: {error}")
    return errors


def main() -> int:
    errors = verify(ROOT)
    if errors:
        print("\n".join(errors))
        return 1
    print("Local Markdown links and anchors, board schema/dependencies/references, and STATUS.md passed")
    print("External URLs and source claims require the dated human/agent review; no app tests exist yet")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
