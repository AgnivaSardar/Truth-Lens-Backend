import base64
import json
import os
import sys
from pathlib import Path

# Ensure UTF-8 encoding for stdout/stderr on Windows
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

import cv2
import numpy as np


def _resize_for_speed(img, max_side=896):
    height, width = img.shape[:2]
    longest = max(height, width)
    if longest <= max_side:
        return img
    scale = max_side / float(longest)
    new_w = max(1, int(width * scale))
    new_h = max(1, int(height * scale))
    return cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_AREA)


def _emit(payload):
    sys.stdout.write(json.dumps(payload, ensure_ascii=False) + "\n")
    sys.stdout.flush()


def _decode_image(image_b64: str):
    try:
        image_bytes = np.frombuffer(base64.b64decode(image_b64), dtype=np.uint8)
        img = cv2.imdecode(image_bytes, cv2.IMREAD_COLOR)
        return img
    except Exception:
        return None


def _import_ocr_engine():
    root = Path(__file__).resolve().parents[3]
    app_dir = root / "imgToText" / "truth-lens-ocr" / "app"
    sys.path.insert(0, str(app_dir))
    from ocr_engine import extract_text  # type: ignore

    return extract_text


def _init_rapid_ocr():
    try:
        from rapidocr_onnxruntime import RapidOCR  # type: ignore

        return RapidOCR()
    except Exception:
        return None


def _extract_with_rapid(rapid_engine, img):
    result = rapid_engine(img)
    if not result:
        return ""

    ocr_lines = result[0] if isinstance(result, tuple) else result
    tokens = []
    for item in ocr_lines or []:
        if not isinstance(item, (list, tuple)) or len(item) < 2:
            continue
        text = item[1]
        if isinstance(text, str) and text.strip():
            tokens.append(text.strip())
    return " ".join(tokens).strip()


def main():
    preferred_engine = (os.environ.get("OCR_ENGINE") or "auto").lower()
    rapid_engine = _init_rapid_ocr() if preferred_engine in {"auto", "rapid"} else None

    paddle_extract = None
    try:
        if preferred_engine == "paddle" or (preferred_engine == "auto" and rapid_engine is None):
            paddle_extract = _import_ocr_engine()
    except Exception as exc:
        if rapid_engine is None:
            _emit({"ok": False, "id": None, "error": f"Failed to load OCR engine: {exc}"})
            return

    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue

        req_id = None
        try:
            payload = json.loads(line)
            req_id = payload.get("id")
            image_b64 = payload.get("imageBase64", "")
            if not image_b64:
                _emit({"ok": False, "id": req_id, "error": "Missing imageBase64"})
                continue

            img = _decode_image(image_b64)
            if img is None:
                _emit({"ok": False, "id": req_id, "error": "Invalid image"})
                continue

            img = _resize_for_speed(img)

            text = ""
            if rapid_engine is not None:
                text = _extract_with_rapid(rapid_engine, img)

            if not text and paddle_extract is not None:
                text = (paddle_extract(img) or "").strip()

            _emit(
                {
                    "ok": True,
                    "id": req_id,
                    "text": text,
                    "confidence": 0,
                    "blocks": [],
                }
            )
        except Exception as exc:
            error_msg = str(exc) if exc else "Unknown error"
            # Ensure error message is valid UTF-8
            error_msg = error_msg.encode('utf-8', errors='replace').decode('utf-8')
            _emit({"ok": False, "id": req_id, "error": error_msg})


if __name__ == "__main__":
    main()
