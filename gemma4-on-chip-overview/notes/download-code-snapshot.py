"""Restore the pinned Gemma 4 source snapshot recorded in 04-code-snapshot.json.

Run from the repository root. Downloads source/configuration only, never weights.
Each file is checked against the recorded SHA-256 before replacing its target.
"""

import base64
import hashlib
import json
import subprocess
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
MANIFEST = json.loads((Path(__file__).parent / "04-code-snapshot.json").read_text(encoding="utf-8"))
REFERENCE = (ROOT / "reference").resolve()
REVISION = MANIFEST["revision"]


def fetch(url: str, *, api: bool = False) -> bytes:
    command = [
        "curl.exe",
        "--ssl-no-revoke",
        "--fail",
        "--silent",
        "--show-error",
        "--location",
        "--retry",
        "1",
        "--max-time",
        "35",
        "--header",
        "User-Agent: aixsilicon-blog-source-sync",
        url,
    ]
    response = subprocess.run(command, capture_output=True, timeout=80, check=True)
    if not api:
        return response.stdout
    payload = json.loads(response.stdout)
    if payload.get("encoding") != "base64" or not payload.get("content"):
        raise ValueError(f"Unexpected GitHub API response for {url}")
    return base64.b64decode(payload["content"])


def restore(entry: dict) -> str:
    relative = Path(entry["path"])
    target = (ROOT / relative).resolve()
    if not target.is_relative_to(REFERENCE):
        raise ValueError(f"Target outside reference: {relative}")
    expected = entry["sha256"].lower()
    if target.exists() and hashlib.sha256(target.read_bytes()).hexdigest() == expected:
        return f"EXIST {relative}"

    source = entry["url"]
    if "raw.githubusercontent.com" in source:
        source_path = source.split(f"/{REVISION}/", 1)[1]
        api_url = (
            "https://api.github.com/repos/huggingface/transformers/contents/"
            f"{source_path}?ref={REVISION}"
        )
        try:
            content = fetch(api_url, api=True)
        except (subprocess.SubprocessError, ValueError, json.JSONDecodeError):
            content = fetch(source)
    else:
        content = fetch(source)

    actual = hashlib.sha256(content).hexdigest()
    if actual != expected:
        raise ValueError(f"SHA-256 mismatch for {relative}: {actual}")
    target.parent.mkdir(parents=True, exist_ok=True)
    temporary = target.with_name(target.name + ".part")
    temporary.write_bytes(content)
    temporary.replace(target)
    return f"OK {relative}"


if __name__ == "__main__":
    with ThreadPoolExecutor(max_workers=3) as pool:
        futures = [pool.submit(restore, entry) for entry in MANIFEST["files"]]
        for future in as_completed(futures):
            print(future.result(), flush=True)
