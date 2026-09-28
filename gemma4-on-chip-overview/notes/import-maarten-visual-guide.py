"""Snapshot the public Substack article as private writing reference.

Run from the repository root with an HTML snapshot path. This writes only to
reference/maarten-gemma4-visual-guide-2026/ and never edits other references.
"""

from __future__ import annotations

import hashlib
import json
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

import httpx
from bs4 import BeautifulSoup
from markdownify import markdownify


SOURCE = "https://newsletter.maartengrootendorst.com/p/a-visual-guide-to-gemma-4"
ROOT = Path(__file__).resolve().parents[2]
TARGET = ROOT / "reference" / "maarten-gemma4-visual-guide-2026"


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def download(item: dict) -> dict:
    path = TARGET / item["path"]
    urls = [item["url"], item["display_url"]]
    last_error: Exception | None = None
    for url in dict.fromkeys(urls):
        for attempt in range(3):
            try:
                with httpx.Client(follow_redirects=True, timeout=75) as client:
                    response = client.get(url)
                    response.raise_for_status()
                    data = response.content
                if not data:
                    raise ValueError("empty image")
                path.write_bytes(data)
                return {
                    **item,
                    "downloaded_from": url,
                    "bytes": len(data),
                    "sha256": sha256(data),
                    "status": "ok" if url == item["url"] else "display_fallback",
                }
            except Exception as exc:
                last_error = exc
                time.sleep(attempt + 1)
    return {**item, "status": "failed", "error": str(last_error)}


def main() -> None:
    html_path = Path(sys.argv[1]).resolve()
    raw = html_path.read_bytes()
    soup = BeautifulSoup(raw, "html.parser")
    article = soup.select_one("div.body.markup")
    if article is None:
        raise RuntimeError("Substack article body not found")
    imgs = article.find_all("img")
    if len(imgs) < 50:
        raise RuntimeError(f"Expected at least 50 article images; found {len(imgs)}")

    if TARGET.exists():
        raise RuntimeError(f"Refusing to overwrite existing snapshot: {TARGET}")
    (TARGET / "images").mkdir(parents=True)
    (TARGET / "page.html").write_bytes(raw)

    items = []
    for index, img in enumerate(imgs, start=1):
        attrs = json.loads(img.get("data-attrs") or "{}")
        source_url = attrs.get("src")
        if not source_url:
            raise RuntimeError(f"Image {index} lacks original source URL")
        extension = Path(urlparse(source_url).path).suffix.lower() or ".img"
        match = re.search(r"/([0-9a-f]{8})-[0-9a-f-]+_", source_url)
        short_id = match.group(1) if match else f"item{index:02d}"
        filename = f"image-{index:02d}-{short_id}{extension}"
        heading = img.find_previous(["h1", "h2", "h3", "h4"])
        item = {
            "index": index,
            "path": f"images/{filename}",
            "url": source_url,
            "display_url": img.get("src", ""),
            "section": heading.get_text(" ", strip=True) if heading else "",
            "alt_original": img.get("alt", ""),
        }
        items.append(item)
        img["src"] = item["path"]
        img["alt"] = img.get("alt") or f"Figure {index:02d} — {item['section']}"
        for attribute in ("srcset", "sizes", "data-attrs", "loading", "class"):
            img.attrs.pop(attribute, None)

    # Substack wraps each figure in a remote fullscreen link. The manifest
    # retains those URLs; Markdown figures should resolve entirely offline.
    for anchor in article.find_all("a"):
        if len(anchor.find_all("img")) == 1 and not anchor.get_text(" ", strip=True):
            anchor.unwrap()

    text = markdownify(str(article), heading_style="ATX", bullets="-")
    preamble = (
        "# A Visual Guide to Gemma 4\n\n"
        "Original article by Maarten Grootendorst, published 2026-04-03.\n\n"
        f"Source: {SOURCE}\n\n"
        "Private reference snapshot. Images are kept in their original language; "
        "this copy is not a public reuse license.\n\n---\n\n"
    )
    (TARGET / "article.md").write_text(preamble + text, encoding="utf-8")

    results = [None] * len(items)
    with ThreadPoolExecutor(max_workers=5) as pool:
        futures = {pool.submit(download, item): item["index"] for item in items}
        for future in as_completed(futures):
            result = future.result()
            results[result["index"] - 1] = result
            print(f"{result['index']:02d}/{len(items)} {result['status']} {result['path']}", flush=True)

    manifest = {
        "source": SOURCE,
        "author": "Maarten Grootendorst",
        "snapshot_utc": datetime.now(timezone.utc).isoformat(),
        "page_html_sha256": sha256(raw),
        "article_markdown_sha256": sha256((preamble + text).encode("utf-8")),
        "image_count": len(items),
        "downloaded_count": sum(item["status"] != "failed" for item in results),
        "images": results,
    }
    (TARGET / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    (TARGET / "README.md").write_text(
        "# A Visual Guide to Gemma 4 — private reference snapshot\n\n"
        f"Original: {SOURCE}\n\n"
        "- `article.md`: full English article converted to Markdown with local image links.\n"
        "- `images/`: article figures at their original source resolution when available.\n"
        "- `page.html`: HTML snapshot used for the conversion.\n"
        "- `manifest.json`: URLs, download statuses, and SHA-256 hashes.\n\n"
        "The source page displays © 2026 Maarten Grootendorst. This directory is "
        "for internal reading and fact-checking only; it does not grant publication, "
        "translation, or image-reuse rights.\n",
        encoding="utf-8",
    )
    if manifest["downloaded_count"] != len(items):
        raise RuntimeError(f"Only {manifest['downloaded_count']}/{len(items)} images downloaded")
    print(f"COMPLETE: {len(items)} images; {TARGET}")


if __name__ == "__main__":
    main()
