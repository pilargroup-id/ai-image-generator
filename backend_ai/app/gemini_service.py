import io
import json
import uuid
from typing import Optional

from PIL import Image
from google import genai
from google.genai import types

from app.config import GEMINI_API_KEY_ECOMMERCE, OUTPUT_DIR


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
    print(f"[GEMINI NATIVE OUTPUT] {image.width}x{image.height} | mode={image.mode}")

    target_resolution = parse_resolution(requested_resolution)
    if target_resolution:
        target_w, target_h = target_resolution
        if (image.width, image.height) != (target_w, target_h):
            scale = min(target_w / image.width, target_h / image.height)
            new_w = round(image.width * scale)
            new_h = round(image.height * scale)
            resized = image.resize((new_w, new_h), Image.LANCZOS)
            base = image.convert("RGB") if output_format == "JPEG" else image
            canvas_mode = "RGB" if base.mode == "RGB" else "RGBA"
            canvas = Image.new(canvas_mode, (target_w, target_h), (255, 255, 255))
            canvas.paste(resized.convert(canvas_mode), ((target_w - new_w) // 2, (target_h - new_h) // 2))
            image = canvas

    if output_format == "JPEG":
        image = image.convert("RGB")

    save_kwargs: dict = {}
    if output_format == "JPEG":
        save_kwargs = {"quality": 95, "subsampling": 0, "optimize": True}
    elif output_format == "PNG":
        save_kwargs = {"optimize": True, "compress_level": 1}
    elif output_format == "WEBP":
        save_kwargs = {"quality": 95, "method": 6}

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
