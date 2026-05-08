import io
import json
import urllib.request
import uuid
from pathlib import Path
from typing import Optional

from PIL import Image, ImageEnhance, ImageFilter, ImageOps
from google import genai
from google.genai import types

from app.config import GEMINI_API_KEY_ECOMMERCE, OUTPUT_DIR


RESAMPLING_LANCZOS = getattr(Image, "Resampling", Image).LANCZOS

# ── OpenCV DNN Super-Resolution setup ────────────────────────────────────────
try:
    import cv2
    import numpy as np
    _CV2_SR_AVAILABLE = hasattr(cv2, "dnn_superres")
except ImportError:
    cv2 = None          # type: ignore
    np = None           # type: ignore
    _CV2_SR_AVAILABLE = False

_MODELS_DIR = Path(__file__).parent / "sr_models"

# EDSR — best quality among OpenCV DNN SR models, ~2.3 MB each
_SR_MODELS: dict[int, dict] = {
    2: {
        "algo": "edsr",
        "file": "EDSR_x2.pb",
        "url":  "https://github.com/Saafke/EDSR_Tensorflow/raw/master/models/EDSR_x2.pb",
    },
    4: {
        "algo": "edsr",
        "file": "EDSR_x4.pb",
        "url":  "https://github.com/Saafke/EDSR_Tensorflow/raw/master/models/EDSR_x4.pb",
    },
}

_sr_cache: dict[int, object] = {}   # loaded models cached in memory


def _get_sr_model(scale: int):
    """Return a loaded DnnSuperResImpl or None if unavailable."""
    if not _CV2_SR_AVAILABLE:
        return None
    if scale in _sr_cache:
        return _sr_cache[scale]

    info = _SR_MODELS.get(scale)
    if not info:
        return None

    model_path = _MODELS_DIR / info["file"]
    if not model_path.exists():
        _MODELS_DIR.mkdir(parents=True, exist_ok=True)
        try:
            urllib.request.urlretrieve(info["url"], model_path)
        except Exception:
            return None

    try:
        sr = cv2.dnn_superres.DnnSuperResImpl_create()
        sr.readModel(str(model_path))
        sr.setModel(info["algo"], scale)
        _sr_cache[scale] = sr
        return sr
    except Exception:
        return None


def _cv2_upscale(pil_img: Image.Image, scale: int) -> Optional[Image.Image]:
    """Upscale using EDSR neural network. Returns None on any failure."""
    sr = _get_sr_model(scale)
    if sr is None:
        return None
    try:
        arr = np.array(pil_img.convert("RGB"))
        bgr = arr[:, :, ::-1].copy()
        result_bgr = sr.upsample(bgr)
        result_rgb = result_bgr[:, :, ::-1]
        return Image.fromarray(result_rgb, "RGB")
    except Exception:
        return None
SUPPORTED_RESOLUTIONS = {
    "1920x1080": (1920, 1080),
    "2560x1440": (2560, 1440),
    "3840x2160": (3840, 2160),
}


def parse_resolution(resolution: Optional[str]) -> Optional[tuple[int, int]]:
    value = (resolution or "").strip().lower()
    if not value or value == "original":
        return None
    return SUPPORTED_RESOLUTIONS.get(value)


def _sharpen_after_upscale(img: Image.Image, strong: bool = False) -> Image.Image:
    radius  = 1.5 if strong else 0.9
    percent = 160 if strong else 100
    img = img.filter(ImageFilter.UnsharpMask(radius=radius, percent=percent, threshold=2))
    factor = 1.45 if strong else 1.15
    img = ImageEnhance.Sharpness(img).enhance(factor)
    return img


def ensure_output_resolution(
    image: Image.Image,
    target_size: Optional[tuple[int, int]],
    output_format: str,
) -> Image.Image:
    if not target_size:
        return image.convert("RGB") if output_format == "JPEG" else image

    target_width, target_height = target_size
    src_w, src_h = image.size
    if src_w == 0 or src_h == 0:
        return image.convert("RGB") if output_format == "JPEG" else image

    # Scale so the LONGEST dimension of the output matches the LONGEST target dimension.
    # This fills the target without canvas padding and keeps aspect ratio intact.
    tgt_long = max(target_width, target_height)
    src_long = max(src_w, src_h)
    ratio = tgt_long / src_long

    if ratio <= 1.0:
        # Already large enough — just convert
        working = image.convert("RGBA")
        return working.convert("RGB") if output_format == "JPEG" else working

    new_w = round(src_w * ratio)
    new_h = round(src_h * ratio)

    working = image.convert("RGBA")

    # Multi-step upscaling: first double, then final step.
    # Each intermediate step has a light sharpen pass to preserve detail.
    if ratio > 2.0:
        mid_w = min(src_w * 2, new_w)
        mid_h = min(src_h * 2, new_h)
        working = working.resize((mid_w, mid_h), RESAMPLING_LANCZOS)
        working = _sharpen_after_upscale(working, strong=False)

    working = working.resize((new_w, new_h), RESAMPLING_LANCZOS)
    working = _sharpen_after_upscale(working, strong=True)

    return working.convert("RGB") if output_format == "JPEG" else working


def save_inline_image(
    data: bytes,
    mime_type: str,
    prefix: str = "",
    created_by: str = "",
    prompt: str = "",
    requested_resolution: Optional[str] = None,
) -> dict:
    ext = ".png"
    output_format = "PNG"
    if "jpeg" in mime_type or "jpg" in mime_type:
        ext = ".jpg"
        output_format = "JPEG"
    elif "webp" in mime_type:
        ext = ".webp"
        output_format = "WEBP"

    filename = f"{prefix}{uuid.uuid4().hex}{ext}"
    file_path = OUTPUT_DIR / filename

    image = Image.open(io.BytesIO(data))
    image.load()
    image = ensure_output_resolution(image, parse_resolution(requested_resolution), output_format)

    save_kwargs = {}
    if output_format == "JPEG":
        save_kwargs.update({"quality": 95, "subsampling": 0, "optimize": True})
    elif output_format == "PNG":
        save_kwargs.update({"optimize": True, "compress_level": 1})
    elif output_format == "WEBP":
        save_kwargs.update({"quality": 95, "method": 6})

    image.save(file_path, format=output_format, **save_kwargs)

    meta_path = OUTPUT_DIR / (filename + ".json")
    meta = {
        "createdBy": created_by,
        "prompt": prompt,
        "requestedResolution": requested_resolution or "original",
        "width": image.width,
        "height": image.height,
    }
    try:
        meta_path.write_text(json.dumps(meta, ensure_ascii=False), encoding="utf-8")
    except Exception:
        pass

    return {
        "filename": filename,
        "width": image.width,
        "height": image.height,
        "requested_resolution": requested_resolution or "original",
    }


def extract_image_filename_from_response(
    response,
    prefix: str = "",
    created_by: str = "",
    prompt: str = "",
    requested_resolution: Optional[str] = None,
) -> Optional[dict]:
    candidates = getattr(response, "candidates", None) or []
    if not candidates:
        return None

    for candidate in candidates:
        content = getattr(candidate, "content", None)
        if not content:
            continue

        parts = getattr(content, "parts", None) or []
        for part in parts:
            inline_data = getattr(part, "inline_data", None)
            if inline_data and getattr(inline_data, "data", None):
                mime_type = getattr(inline_data, "mime_type", "image/png")
                return save_inline_image(
                    inline_data.data,
                    mime_type,
                    prefix,
                    created_by=created_by,
                    prompt=prompt,
                    requested_resolution=requested_resolution,
                )
    return None


def build_generation_prompt(
    prompt: str,
    reference_count: int,
    aspect_ratio: Optional[str],
    requested_resolution: Optional[str],
) -> str:
    normalized_aspect_ratio = (aspect_ratio or "").strip().lower()
    parsed_resolution = parse_resolution(requested_resolution)

    quality_instructions = []
    if normalized_aspect_ratio and normalized_aspect_ratio != "original":
        quality_instructions.append(f"Use aspect ratio {normalized_aspect_ratio}.")
    if parsed_resolution:
        width, height = parsed_resolution
        quality_instructions.append(
            f"Output at maximum sharpness for a {width}x{height} high-resolution export. "
            f"Crisp edges, sharp fine texture, zero blur, professional product quality."
        )

    quality_suffix = f" {' '.join(quality_instructions)}" if quality_instructions else ""

    if reference_count > 0:
        return (
            f"The first image is the main product image to edit. "
            f"The following {reference_count} image(s) are visual/style references. "
            f"Use them only to guide the style, mood, lighting, or composition. "
            f"Do not copy the reference images directly.{quality_suffix}\n\n"
            f"{prompt}"
        )

    return f"{prompt}{quality_suffix}"


def upscale_image(
    image_bytes: bytes,
    mime_type: str,
    scale: str = "2x",
    filename_prefix: str = "",
    created_by: str = "",
    **_kwargs,
) -> dict:
    ext = ".png"
    output_format = "PNG"
    if "jpeg" in mime_type or "jpg" in mime_type:
        ext = ".jpg"
        output_format = "JPEG"
    elif "webp" in mime_type:
        ext = ".webp"
        output_format = "WEBP"

    scale_factor = 4 if scale == "4x" else 2

    src = Image.open(io.BytesIO(image_bytes))
    src.load()

    # ── Try EDSR neural-network super-resolution ──────────────────────────────
    # For 4x, run two 2x passes (2x → 2x) — better quality than one 4x pass.
    ai_result: Optional[Image.Image] = None
    if scale_factor == 4:
        step = _cv2_upscale(src.convert("RGB"), 2)
        if step is not None:
            ai_result = _cv2_upscale(step, 2)
    else:
        ai_result = _cv2_upscale(src.convert("RGB"), 2)

    if ai_result is not None:
        img = ai_result.convert("RGBA") if output_format == "PNG" else ai_result.convert("RGB")
        # Light sharpening pass after neural upscale
        img = _sharpen_after_upscale(img, strong=False)
        method = "edsr"
    else:
        # ── Fallback: multi-step Lanczos ──────────────────────────────────────
        img = src.convert("RGBA") if output_format == "PNG" else src.convert("RGB")
        new_w = img.width * scale_factor
        new_h = img.height * scale_factor
        max_dim = 3840
        if new_w > max_dim or new_h > max_dim:
            ratio = min(max_dim / new_w, max_dim / new_h)
            new_w, new_h = round(new_w * ratio), round(new_h * ratio)
        if scale_factor >= 4:
            img = img.resize((img.width * 2, img.height * 2), RESAMPLING_LANCZOS)
            img = _sharpen_after_upscale(img, strong=False)
        img = img.resize((new_w, new_h), RESAMPLING_LANCZOS)
        img = _sharpen_after_upscale(img, strong=True)
        method = "lanczos"

    filename = f"{filename_prefix}upscale_{uuid.uuid4().hex}{ext}"
    file_path = OUTPUT_DIR / filename

    save_kwargs: dict = {}
    if output_format == "JPEG":
        save_kwargs = {"quality": 95, "subsampling": 0, "optimize": True}
    elif output_format == "PNG":
        save_kwargs = {"optimize": True, "compress_level": 1}
    elif output_format == "WEBP":
        save_kwargs = {"quality": 95, "method": 6}

    img.save(file_path, format=output_format, **save_kwargs)

    meta_path = OUTPUT_DIR / (filename + ".json")
    try:
        meta_path.write_text(
            json.dumps({
                "createdBy": created_by,
                "prompt": f"Upscale {scale}",
                "scale": scale,
                "method": method,
                "width": img.width,
                "height": img.height,
            }, ensure_ascii=False),
            encoding="utf-8",
        )
    except Exception:
        pass

    return {
        "filename": filename,
        "width": img.width,
        "height": img.height,
        "scale": scale,
        "method": method,
    }


def edit_image_with_gemini(
    image_bytes: bytes,
    mime_type: str,
    prompt: str,
    reference_images: Optional[list[dict]] = None,
    api_key: Optional[str] = None,
    filename_prefix: str = "",
    created_by: str = "",
    aspect_ratio: Optional[str] = None,
    requested_resolution: Optional[str] = None,
) -> dict:
    key = api_key or GEMINI_API_KEY_ECOMMERCE
    client = genai.Client(api_key=key)

    contents = [
        types.Part.from_bytes(
            data=image_bytes,
            mime_type=mime_type,
        )
    ]

    valid_references = []
    for ref in reference_images or []:
        ref_data = ref.get("data")
        ref_mime = ref.get("mime_type", "image/png")
        if not ref_data:
            continue
        valid_references.append(ref)
        contents.append(
            types.Part.from_bytes(
                data=ref_data,
                mime_type=ref_mime,
            )
        )

    contents.append(
        build_generation_prompt(
            prompt=prompt,
            reference_count=len(valid_references),
            aspect_ratio=aspect_ratio,
            requested_resolution=requested_resolution,
        )
    )

    response = client.models.generate_content(
        model="gemini-3.1-flash-image-preview",
        contents=contents,
        config=types.GenerateContentConfig(
            response_modalities=["TEXT", "IMAGE"]
        ),
    )

    image_info = extract_image_filename_from_response(
        response,
        filename_prefix,
        created_by=created_by,
        prompt=prompt.strip(),
        requested_resolution=requested_resolution,
    )

    text_output = ""
    try:
        text_output = response.text or ""
    except Exception:
        text_output = ""

    return {
        "filename": image_info["filename"] if image_info else None,
        "width": image_info["width"] if image_info else None,
        "height": image_info["height"] if image_info else None,
        "requested_resolution": image_info["requested_resolution"] if image_info else (requested_resolution or "original"),
        "text_output": text_output,
    }
