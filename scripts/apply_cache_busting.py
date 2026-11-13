#!/usr/bin/env python3
"""
Cache-Busting & Anti-Cache Meta Injection Pipeline
Applies aggressive anti-caching meta tags and ?v=2.0 query strings
across all HTML files, stylesheets, scripts, preloads, and media assets.
"""

import os
import re
import glob

META_BLOCK = """  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">"""

MEDIA_ASSETS = [
    'hero-walking-labib.mp4',
    'hero-walking-labib.webm',
    'hero-walking-labib-poster.jpg',
    'Labib_Fohayer_Resume.pdf',
    'resume-preview.png',
]

def process_html_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # 0. Viewport meta tag: Standardize cross-device mobile scale (single canonical tag)
    content = re.sub(r'<meta\s+name=["\']viewport["\'][^>]*>\s*', '', content, flags=re.IGNORECASE)
    content = re.sub(
        r'(<head[^>]*>)',
        r'\1\n  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">',
        content,
        count=1,
        flags=re.IGNORECASE
    )

    # 1. Meta tags: Ensure they exist right after <head>
    content = re.sub(r'<meta\s+http-equiv=["\']Cache-Control["\'][^>]*>\s*', '', content, flags=re.IGNORECASE)
    content = re.sub(r'<meta\s+http-equiv=["\']Pragma["\'][^>]*>\s*', '', content, flags=re.IGNORECASE)
    content = re.sub(r'<meta\s+http-equiv=["\']Expires["\'][^>]*>\s*', '', content, flags=re.IGNORECASE)
    content = re.sub(r'(<head[^>]*>)', r'\1\n' + META_BLOCK, content, count=1, flags=re.IGNORECASE)

    # 2. Stylesheet links (<link rel="stylesheet" ...>)
    def update_link_href(m):
        full = m.group(0)
        href_match = re.search(r'href=["\']([^"\']+)["\']', full)
        if not href_match:
            return full
        href = href_match.group(1)
        # Never add query strings to Next.js static chunks (already content-hashed and required by Turbopack)
        if '/_next/' in href or 'fonts.googleapis.com' in href or 'v=2.0' in href:
            return full
        sep = '&' if '?' in href else '?'
        new_href = href + sep + 'v=2.0'
        return full.replace(f'href="{href}"', f'href="{new_href}"').replace(f"href='{href}'", f"href='{new_href}'")

    content = re.sub(r'<link\b[^>]*\brel=["\']stylesheet["\'][^>]*>', update_link_href, content, flags=re.IGNORECASE)
    content = re.sub(r'<link\b[^>]*\bhref=["\'][^"\']+\.css(?:\?[^"\']*)?["\'][^>]*>', update_link_href, content, flags=re.IGNORECASE)

    # 3. Scripts (<script src="...">)
    def update_script_src(m):
        full = m.group(0)
        src_match = re.search(r'src=["\']([^"\']+)["\']', full)
        if not src_match:
            return full
        src = src_match.group(1)
        # Never add query strings to Next.js static chunks (breaks Turbopack document.currentScript resolution)
        if '/_next/' in src or 'v=2.0' in src:
            return full
        sep = '&' if '?' in src else '?'
        new_src = src + sep + 'v=2.0'
        return full.replace(f'src="{src}"', f'src="{new_src}"').replace(f"src='{src}'", f"src='{new_src}'")

    content = re.sub(r'<script\b[^>]*\bsrc=["\'][^"\']+["\'][^>]*>', update_script_src, content, flags=re.IGNORECASE)

    # 4. Preload links (<link rel="preload" ... href="...">)
    def update_preload_href(m):
        full = m.group(0)
        href_match = re.search(r'href=["\']([^"\']+)["\']', full)
        if not href_match:
            return full
        href = href_match.group(1)
        if '/_next/' in href or 'fonts.googleapis.com' in href or 'v=2.0' in href:
            return full
        if '.js' in href or '.css' in href:
            sep = '&' if '?' in href else '?'
            new_href = href + sep + 'v=2.0'
            return full.replace(f'href="{href}"', f'href="{new_href}"').replace(f"href='{href}'", f"href='{new_href}'")
        return full

    content = re.sub(r'<link\b[^>]*\brel=["\']preload["\'][^>]*>', update_preload_href, content, flags=re.IGNORECASE)

    # 5. Media & PDF assets
    for asset in ['hero-walking-labib.mp4', 'hero-walking-labib.webm', 'hero-walking-labib-poster.jpg']:
        pattern = re.compile(rf'({re.escape(asset)})(?!\?v=2\.0|&v=2\.0)')
        content = pattern.sub(rf'\1?v=2.0', content)

    for asset in ['Labib_Fohayer_Resume.pdf', 'resume-preview.png']:
        pattern = re.compile(rf'({re.escape(asset)})(?:\?v=[^"\'#\s&]*)?')
        content = pattern.sub(rf'\1?v=3.0', content)

    # Ensure download attribute has clean filename without ?v= query string
    content = re.sub(r'download="([^"?#]+)\?v=[^"]*"', r'download="\1"', content)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def process_directory(directory):
    files = glob.glob(os.path.join(directory, '**/*.html'), recursive=True)
    count = 0
    for f in sorted(files):
        if process_html_file(f):
            count += 1
            print(f"Updated: {f}")
        else:
            print(f"Unchanged: {f}")
    print(f"Done. {count}/{len(files)} files updated in {directory}.")

if __name__ == '__main__':
    import sys
    dirs = sys.argv[1:] if len(sys.argv) > 1 else [
        '/home/labib-fohayer/.gemini/antigravity/scratch/two26-studio-rebuild/out',
        '/home/labib-fohayer/.gemini/antigravity/scratch/github-io-target'
    ]
    for d in dirs:
        if os.path.isdir(d):
            print(f"\nProcessing directory: {d}")
            process_directory(d)
