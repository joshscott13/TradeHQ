#!/usr/bin/env python3
"""Build and verify TradeHQ in an isolated Docker Compose project.

Requires an installed Docker CLI, Compose plugin and running Linux Docker engine.
No user Compose project, ports, images or configuration are modified.
"""

import argparse
from html.parser import HTMLParser
import os
from pathlib import Path
import shutil
import socket
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request
import uuid


ROOT = Path(__file__).resolve().parents[2]


class SmokeFailure(Exception):
    pass


class PageAssets(HTMLParser):
    def __init__(self):
        super().__init__()
        self.assets = []
        self.in_title = False
        self.in_heading = False
        self.title = ""
        self.heading = ""
        self.text = ""

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if tag == "title":
            self.in_title = True
        if tag == "h1":
            self.in_heading = True
        candidate = attributes.get("src") if tag == "script" else attributes.get("href") if tag == "link" else None
        if candidate and candidate.startswith("/_next/static/") and urllib.parse.urlsplit(candidate).path.endswith((".js", ".css")):
            self.assets.append(candidate)

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        if tag == "h1":
            self.in_heading = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        if self.in_heading:
            self.heading += data
        self.text += data + " "


def command(args, env, timeout=60, capture=False):
    print("+ " + " ".join(args), flush=True)
    try:
        result = subprocess.run(args, cwd=ROOT, env=env, timeout=timeout, text=True,
                                stdout=subprocess.PIPE if capture else None,
                                stderr=subprocess.STDOUT if capture else None)
    except (OSError, subprocess.TimeoutExpired) as error:
        raise SmokeFailure(f"Command could not complete: {error}") from error
    if result.returncode:
        if capture and result.stdout:
            print(result.stdout, file=sys.stderr)
        raise SmokeFailure(f"Command failed with exit code {result.returncode}: {' '.join(args)}")
    return result.stdout.strip() if capture else ""


def preflight(env):
    if not shutil.which("docker"):
        raise SmokeFailure("Docker CLI is missing. Install Docker with the Compose plugin, then start a Linux Docker engine.")
    command(["docker", "compose", "version"], env, capture=True)
    try:
        operating_system = command(["docker", "info", "--format", "{{.OSType}}"], env, capture=True)
    except SmokeFailure as error:
        raise SmokeFailure("Docker engine is unavailable. Start your installed Docker runtime and retry; check `docker info`. No containers were started.") from error
    if operating_system != "linux":
        raise SmokeFailure("A Linux Docker engine is required for the Node Debian image; switch to Linux containers before retrying.")


def free_port():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as probe:
        probe.bind(("127.0.0.1", 0))
        return probe.getsockname()[1]


def fetch(base, path):
    # Only request this isolated local server; never follow remote redirects.
    class NoRedirect(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, req, fp, code, msg, headers, newurl):
            return None
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}), NoRedirect())
    try:
        with opener.open(base + path, timeout=15) as response:
            if response.status != 200:
                raise SmokeFailure(f"{path} returned HTTP {response.status}.")
            return response.read(5 * 1024 * 1024), response.headers.get("Content-Type", "")
    except (urllib.error.URLError, OSError) as error:
        raise SmokeFailure(f"HTTP smoke failed for {path}: {error}") from error


def verify_http(base):
    planner_assets = []
    for path, expected in [("/", "Turn your goal into a daily plan"), ("/imports", "Review before you import")]:
        payload, content_type = fetch(base, path)
        if "text/html" not in content_type:
            raise SmokeFailure(f"{path} did not return an HTML page.")
        page = PageAssets()
        page.feed(payload.decode("utf-8"))
        if "TradeHQ" not in page.title or expected not in page.heading:
            raise SmokeFailure(f"{path} did not contain the expected TradeHQ title/page content.")
        planner_assets.extend(page.assets)
        print(f"Verified production page: {path}", flush=True)
    if not planner_assets:
        raise SmokeFailure("Production pages reference no Next.js JS/CSS assets.")
    asset = planner_assets[0]
    payload, content_type = fetch(base, asset)
    if not payload or not any(kind in content_type for kind in ["javascript", "text/css"]):
        raise SmokeFailure(f"Static asset {asset} is empty or has unexpected content type {content_type!r}.")
    print(f"Verified copied static asset: {asset} ({len(payload)} bytes)", flush=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--wait-timeout", type=int, default=120, metavar="SECONDS", help="Compose health wait (default: 120).")
    options = parser.parse_args()
    if options.wait_timeout < 1 or options.wait_timeout > 600:
        parser.error("--wait-timeout must be between 1 and 600 seconds")
    env = os.environ.copy()
    attempted_start = False
    project = "tradehq-smoke-" + uuid.uuid4().hex[:12]
    compose = ["docker", "compose", "--project-name", project, "--file", str(ROOT / "compose.yaml")]
    status = 0
    try:
        preflight(env)
        if not (ROOT / "compose.yaml").is_file():
            raise SmokeFailure("Repository compose.yaml is missing.")
        port = free_port()
        env.update(TRADEHQ_PORT=str(port), TRADEHQ_BIND_ADDRESS="127.0.0.1")
        print(f"Isolated project {project}; HTTP http://127.0.0.1:{port}", flush=True)
        attempted_start = True
        command(compose + ["up", "--build", "--detach", "--wait", "--wait-timeout", str(options.wait_timeout)], env, timeout=1200)
        uid = command(compose + ["exec", "-T", "web", "id", "-u"], env, capture=True)
        if not uid.isdecimal() or int(uid) == 0:
            raise SmokeFailure(f"Expected a non-root container UID; received {uid!r}.")
        print(f"Verified non-root runtime UID: {uid}", flush=True)
        verify_http(f"http://127.0.0.1:{port}")
    except (SmokeFailure, UnicodeError) as error:
        print(f"Docker smoke failed: {error}", file=sys.stderr, flush=True)
        status = 1
        if attempted_start:
            try:
                command(compose + ["logs", "--no-color", "--tail", "100", "web"], env)
            except SmokeFailure as log_error:
                print(f"Could not read isolated project logs: {log_error}", file=sys.stderr)
    except KeyboardInterrupt:
        print("Docker smoke interrupted; cleaning its isolated project.", file=sys.stderr)
        status = 130
    finally:
        if attempted_start:
            try:
                command(compose + ["down", "--volumes", "--remove-orphans", "--rmi", "local", "--timeout", "10"], env, timeout=90)
            except SmokeFailure as cleanup_error:
                print(f"Cleanup failed for {project}: {cleanup_error}", file=sys.stderr)
                status = status or 1
    if status == 0:
        print("Docker production smoke passed; isolated project removed.", flush=True)
    return status


if __name__ == "__main__":
    sys.exit(main())
