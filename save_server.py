#!/usr/bin/env python3
"""Static file server for this project that also accepts a save request
from index.html and writes the asset data directly back into index.html
on disk (inside this Codespace/container).

Why this exists: index.html's "index.html에 저장" button used to rely on
the browser's File System Access API, which can only write files on the
machine the browser itself is running on. When this project is opened via
a Codespaces web URL (https://...app.github.dev), the browser runs on your
local PC while this file lives inside the remote container, so that API
can never reach the real index.html. This server runs inside the
container instead, so the save request (a plain same-origin fetch) is
handled right next to the real file.

Usage:
    python3 save_server.py [port]   # default port 5500

Then open the forwarded URL for that port (Codespaces will prompt you, or
check the "Ports" tab in VS Code) instead of using the Live Server
extension.
"""
import http.server
import json
import os
import sys

DIR = os.path.dirname(os.path.abspath(__file__))
INDEX_HTML = os.path.join(DIR, 'index.html')
START_MARKER = '// >>> DEFAULT_FAMILY_DATA_START'
END_MARKER = '// <<< DEFAULT_FAMILY_DATA_END'


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIR, **kwargs)

    def do_POST(self):
        if self.path != '/api/save-family':
            self.send_error(404, 'Not found')
            return

        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length)

        try:
            payload = json.loads(body)
            family = payload['family']
        except Exception as e:
            self._respond(400, str(e))
            return

        try:
            with open(INDEX_HTML, 'r', encoding='utf-8') as f:
                text = f.read()
        except OSError as e:
            self._respond(500, f'index.html을 읽을 수 없습니다: {e}')
            return

        start_idx = text.find(START_MARKER)
        end_idx = text.find(END_MARKER)
        if start_idx == -1 or end_idx == -1 or end_idx < start_idx:
            self._respond(500, '데이터 마커를 찾을 수 없습니다.')
            return

        before = text[:start_idx + len(START_MARKER)]
        after = text[end_idx:]
        new_block = (
            '\n        const defaultFamily = '
            + json.dumps(family, ensure_ascii=False, indent=2)
            + ';\n        '
        )
        new_text = before + new_block + after

        try:
            with open(INDEX_HTML, 'w', encoding='utf-8') as f:
                f.write(new_text)
        except OSError as e:
            self._respond(500, f'index.html에 쓸 수 없습니다: {e}')
            return

        self._respond(200, '{"ok": true}', content_type='application/json')

    def _respond(self, status, message, content_type='text/plain; charset=utf-8'):
        body = message.encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', content_type)
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):
        pass


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5500
    server = http.server.ThreadingHTTPServer(('0.0.0.0', port), Handler)
    print(f'우리가문 자산 시뮬레이터 저장 서버 실행 중: http://0.0.0.0:{port}')
    print('Codespaces의 "포트(Ports)" 탭에서 이 포트를 열어 접속하세요.')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
