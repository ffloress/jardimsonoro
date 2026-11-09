#!/usr/bin/env python3
"""
Sincroniza GitHub Issues (criadas pelo dono do repositório) com posts em Markdown
em generator/content/ e baixa/otimiza imagens anexadas para generator/img/.
"""

import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

SCRIPT_DIR = Path(__file__).resolve().parent
CONTENT_DIR = SCRIPT_DIR / "content"
IMG_DIR = SCRIPT_DIR / "img"
BLOG_IMG_DIR = SCRIPT_DIR.parent / "blog" / "img"

DEFAULT_REPO = "ffloress/jardimsonoro"
DEFAULT_AUTHOR = "Frederico Flores"
TIMEZONE = ZoneInfo("America/Sao_Paulo")

DRAFT_LABELS = {"draft", "rascunho", "unpublished", "arquivado"}
IGNORED_TAG_LABELS = DRAFT_LABELS | {
    "publish",
    "publicado",
    "post",
    "blog",
    "bug",
    "enhancement",
    "documentation",
    "question",
    "good first issue",
    "help wanted",
    "invalid",
    "wontfix",
    "duplicate",
}


def fetch_owner_issues(repo: str, owner: str, token: str | None) -> list[dict]:
    issues: list[dict] = []
    page = 1
    while True:
        params = urllib.parse.urlencode(
            {"creator": owner, "state": "all", "per_page": 100, "page": page}
        )
        url = f"https://api.github.com/repos/{repo}/issues?{params}"
        headers = {
            "Accept": "application/vnd.github+json",
            "User-Agent": "jardimsonoro-issueblog-sync",
            "X-GitHub-Api-Version": "2022-11-28",
        }
        if token:
            headers["Authorization"] = f"Bearer {token}"

        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as resp:
            batch = json.loads(resp.read().decode("utf-8"))

        if not batch:
            break

        for item in batch:
            # Ignora Pull Requests (a API de issues do GitHub inclui PRs)
            if "pull_request" in item:
                continue
            user_login = (item.get("user") or {}).get("login", "")
            if user_login.lower() != owner.lower():
                continue
            issues.append(item)

        if len(batch) < 100:
            break
        page += 1

    return issues


def download_and_convert_image(url: str, issue_num: int, token: str | None) -> str | None:
    """
    Baixa uma imagem de uma URL (ex: github.com/user-attachments/assets/...)
    e a converte/redimensiona para generator/img/issue-<num>-<hash>.webp (ou .gif).
    Retorna o caminho relativo '../img/<filename>' usado pelos posts do Pelican.
    """
    IMG_DIR.mkdir(parents=True, exist_ok=True)
    BLOG_IMG_DIR.mkdir(parents=True, exist_ok=True)

    url_hash = hashlib.sha1(url.encode("utf-8")).hexdigest()[:8]
    parsed_path = urllib.parse.urlparse(url).path.lower()
    is_gif = parsed_path.endswith(".gif")

    # Verifica se já baixamos essa imagem antes
    for ext_candidate in (".gif", ".webp"):
        existing = IMG_DIR / f"issue-{issue_num}-{url_hash}{ext_candidate}"
        if existing.exists():
            blog_copy = BLOG_IMG_DIR / existing.name
            if not blog_copy.exists():
                shutil.copy2(existing, blog_copy)
            return f"../img/{existing.name}"

    headers = {"User-Agent": "jardimsonoro-issueblog-sync"}
    if token and ("github.com" in url or "githubusercontent.com" in url):
        headers["Authorization"] = f"Bearer {token}"

    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as resp:
            content_type = (resp.headers.get("Content-Type") or "").lower()
            data = resp.read()
    except Exception as exc:
        # Tenta novamente sem o header Authorization caso tenha havido redirect para S3/CDN
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "jardimsonoro-issueblog-sync"})
            with urllib.request.urlopen(req, timeout=30) as resp:
                content_type = (resp.headers.get("Content-Type") or "").lower()
                data = resp.read()
        except Exception as retry_exc:
            print(f"[Aviso] Falha ao baixar imagem {url}: {exc} / {retry_exc}", file=sys.stderr)
            return None

    if "image/gif" in content_type or is_gif:
        out_ext = ".gif"
    else:
        out_ext = ".webp"

    filename = f"issue-{issue_num}-{url_hash}{out_ext}"
    target_img = IMG_DIR / filename
    target_blog_img = BLOG_IMG_DIR / filename

    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        tmp.write(data)
        tmp_path = tmp.name

    try:
        magick_bin = shutil.which("magick") or shutil.which("convert")
        if magick_bin and out_ext != ".gif":
            cmd = (
                [magick_bin, tmp_path, "-resize", "500x400>", str(target_img)]
                if os.path.basename(magick_bin) == "magick"
                else [magick_bin, tmp_path, "-resize", "500x400>", str(target_img)]
            )
            subprocess.run(cmd, check=True)
        else:
            shutil.copy2(tmp_path, target_img)

        shutil.copy2(target_img, target_blog_img)
    except Exception as exc:
        print(f"[Aviso] Erro ao converter imagem {url}: {exc}", file=sys.stderr)
        shutil.copy2(tmp_path, target_img)
        shutil.copy2(target_img, target_blog_img)
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

    print(f"Imagem salva: {target_img.name}")
    return f"../img/{filename}"


def process_images_in_body(body: str, issue_num: int, token: str | None) -> str:
    """
    Converte tags HTML <img ...> e links Markdown ![alt](https://...) do corpo da Issue
    em imagens locais ![alt](../img/issue-...).
    """
    # 1. Converte <img ... src="https://..." ...> (padrão de upload do GitHub Mobile/Web)
    img_tag_pattern = re.compile(r"<img\s+[^>]*src=[\"'](https?://[^\"']+)[\"'][^>]*>", re.IGNORECASE)

    def replace_html_img(match: re.Match) -> str:
        full_tag = match.group(0)
        src_url = match.group(1)
        alt_match = re.search(r"alt=[\"']([^\"']*)[\"']", full_tag, re.IGNORECASE)
        alt_text = alt_match.group(1) if alt_match else "Imagem"
        local_path = download_and_convert_image(src_url, issue_num, token)
        if local_path:
            return f"![{alt_text}]({local_path})"
        return full_tag

    body = img_tag_pattern.sub(replace_html_img, body)

    # 2. Converte ![alt](https://...)
    md_img_pattern = re.compile(r"!\[([^\]]*)\]\((https?://[^\)\s]+)\)")

    def replace_md_img(match: re.Match) -> str:
        alt_text = match.group(1) or "Imagem"
        src_url = match.group(2)
        local_path = download_and_convert_image(src_url, issue_num, token)
        if local_path:
            return f"![{alt_text}]({local_path})"
        return match.group(0)

    body = md_img_pattern.sub(replace_md_img, body)
    return body


def process_standalone_media_links(body: str) -> str:
    """
    Converte URLs puras (isoladas em uma linha) de YouTube, Vimeo, Spotify ou Instagram
    em links Markdown [url](url) para que o script de embed do blog as transforme em players.
    """
    media_domains = (
        "youtube.com/watch",
        "youtu.be/",
        "vimeo.com/",
        "open.spotify.com/playlist/",
        "open.spotify.com/album/",
        "instagram.com/reel/",
        "instagram.com/p/",
        "instagram.com/tv/",
    )
    lines = body.splitlines()
    out_lines = []
    for line in lines:
        stripped = line.strip()
        if stripped.startswith(("http://", "https://")) and " " not in stripped:
            if any(domain in stripped for domain in media_domains):
                out_lines.append(f"[]({stripped})")
                continue
        out_lines.append(line)
    return "\n".join(out_lines)


def parse_body_metadata(body: str) -> tuple[dict[str, str], str]:
    """
    Permite opcionalmente declarar metadados nas primeiras linhas da Issue, ex:
    Tags: cinema, music branding
    Date: 2025-09-10 10:20
    """
    meta: dict[str, str] = {}
    lines = body.splitlines()
    idx = 0
    allowed_keys = {"tags", "date", "author", "slug", "title"}

    while idx < len(lines):
        line = lines[idx].strip()
        if not line:
            if meta:
                idx += 1
                break
            idx += 1
            continue
        m = re.match(r"^([A-Za-z_]+)\s*:\s*(.+)$", line)
        if m and m.group(1).lower() in allowed_keys:
            meta[m.group(1).lower()] = m.group(2).strip()
            idx += 1
        else:
            break

    if meta:
        remaining = "\n".join(lines[idx:]).lstrip("\n")
        return meta, remaining
    return {}, body


def format_issue_to_markdown(issue: dict, token: str | None) -> str:
    issue_num = issue["number"]
    raw_body = (issue.get("body") or "").replace("\r\n", "\n").strip()
    body_meta, clean_body = parse_body_metadata(raw_body)

    title = body_meta.get("title") or issue["title"].strip()
    author = body_meta.get("author") or DEFAULT_AUTHOR

    # Data de criação convertida para America/Sao_Paulo
    if "date" in body_meta:
        date_str = body_meta["date"]
    else:
        created_at = issue["created_at"]  # ex: "2025-08-20T13:20:00Z"
        dt_utc = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
        dt_local = dt_utc.astimezone(TIMEZONE)
        date_str = dt_local.strftime("%Y-%m-%d %H:%M")

    # Combina labels da Issue com Tags: do corpo
    tags: list[str] = []
    for label in issue.get("labels", []):
        label_name = (label.get("name") or "").strip()
        if label_name and label_name.lower() not in IGNORED_TAG_LABELS:
            tags.append(label_name)

    if "tags" in body_meta:
        for t in body_meta["tags"].split(","):
            t_clean = t.strip()
            if t_clean and t_clean.lower() not in {x.lower() for x in tags}:
                tags.append(t_clean)

    clean_body = process_images_in_body(clean_body, issue_num, token)
    clean_body = process_standalone_media_links(clean_body)

    header_lines = [f"Title: {title}"]
    if tags:
        header_lines.append(f"Tags: {', '.join(tags)}")
    header_lines.append(f"Author: {author}")
    header_lines.append(f"Date: {date_str}")
    if "slug" in body_meta:
        header_lines.append(f"Slug: {body_meta['slug']}")

    return "\n".join(header_lines) + "\n\n" + clean_body + "\n"


def main() -> int:
    repo = os.environ.get("GITHUB_REPOSITORY", DEFAULT_REPO)
    owner = os.environ.get("GITHUB_REPOSITORY_OWNER", repo.split("/")[0])
    token = os.environ.get("GITHUB_TOKEN")

    CONTENT_DIR.mkdir(parents=True, exist_ok=True)

    print(f"Buscando issues de '{owner}' no repositório '{repo}'...")
    issues = fetch_owner_issues(repo, owner, token)
    print(f"Encontradas {len(issues)} issues criadas por {owner}.")

    for issue in issues:
        issue_num = issue["number"]
        md_file = CONTENT_DIR / f"issue-{issue_num}.md"
        state = issue.get("state", "open")
        label_names = {(lbl.get("name") or "").strip().lower() for lbl in issue.get("labels", [])}
        is_draft = bool(label_names & DRAFT_LABELS)

        if state != "open" or is_draft:
            if md_file.exists():
                md_file.unlink()
                print(f"Issue #{issue_num} ({state}/draft) -> Removido {md_file.name}")
            continue

        md_content = format_issue_to_markdown(issue, token)
        if md_file.exists() and md_file.read_text(encoding="utf-8") == md_content:
            print(f"Issue #{issue_num} sem alterações ({issue['title']}).")
        else:
            md_file.write_text(md_content, encoding="utf-8")
            print(f"Issue #{issue_num} sincronizada -> {md_file.name} ({issue['title']})")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
