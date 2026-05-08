import json
import io
import uuid
from pathlib import Path
from typing import Optional
from PIL import Image
from google import genai
from google.genai import types
from app.config import GEMINI_API_KEY_ECOMMERCE, OUTPUT_DIR


def save_inline_image(
    data: bytes,
    mime_type: str,
    prefix: str = "",
    created_by: str = "",
    prompt: str = "",
) -> str:
    ext = ".png"
    if "jpeg" in mime_type or "jpg" in mime_type:
        ext = ".jpg"
    elif "webp" in mime_type:
        ext = ".webp"
    filename = f"{prefix}{uuid.uuid4().hex}{ext}"
    file_path = OUTPUT_DIR / filename
    image = Image.open(io.BytesIO(data))
    if ext == ".jpg":
        image = image.convert("RGB")
    image.save(file_path)

    # Simpan metadata sidecar
    meta_path = OUTPUT_DIR / (filename + ".json")
    meta = {
        "createdBy": created_by,
        "prompt":    prompt,
    }
    try:
        meta_path.write_text(json.dumps(meta, ensure_ascii=False), encoding="utf-8")
    except Exception:
        pass

    return filename


def extract_image_filename_from_response(
    response,
    prefix: str = "",
    created_by: str = "",
    prompt: str = "",
) -> Optional[str]:
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
                    inline_data.data, mime_type, prefix,
                    created_by=created_by, prompt=prompt,
                )
    return None


def edit_image_with_gemini(
    image_bytes: bytes,
    mime_type: str,
    prompt: str,
    reference_images: Optional[list[dict]] = None,
    api_key: Optional[str] = None,
    filename_prefix: str = "",
    created_by: str = "",
) -> dict:
    """
    Edit gambar utama dengan prompt.
    Jika reference_images diberikan, gambar-gambar tersebut
    akan disertakan sebagai konteks visual/style referensi.

    api_key       : key Gemini yang akan dipakai (per-departemen)
    filename_prefix: prefix nama file output, misal 'ec_' atau 'pd_'
    reference_images format: [{"data": bytes, "mime_type": str}, ...]
    """
    key = api_key or GEMINI_API_KEY_ECOMMERCE
    client = genai.Client(api_key=key)

    contents = []

    # 1. Gambar utama yang akan diedit
    contents.append(
        types.Part.from_bytes(
            data=image_bytes,
            mime_type=mime_type,
        )
    )

    # 2. Tambahkan gambar referensi (jika ada) SEBELUM prompt teks
    #    Urutan: [main_image, ref1, ref2, ..., prompt_text]
    if reference_images:
        for ref in reference_images:
            ref_data = ref.get("data")
            ref_mime = ref.get("mime_type", "image/png")
            if ref_data:
                contents.append(
                    types.Part.from_bytes(
                        data=ref_data,
                        mime_type=ref_mime,
                    )
                )

        # Hitung jumlah referensi valid
        ref_count = len([r for r in reference_images if r.get("data")])

        # Perkuat prompt agar model tahu peran tiap gambar
        enhanced_prompt = (
            f"The first image is the main product image to edit. "
            f"The following {ref_count} image(s) are visual/style references — "
            f"use them to guide the style, mood, lighting, or composition of the result. "
            f"Do not copy the reference images directly.\n\n"
            f"{prompt}"
        )
        contents.append(enhanced_prompt)
    else:
        # Tidak ada referensi, pakai prompt langsung
        contents.append(prompt)

    response = client.models.generate_content(
        model="gemini-3.1-flash-image-preview",
        contents=contents,
        config=types.GenerateContentConfig(
            response_modalities=["TEXT", "IMAGE"]
        ),
    )

    filename = extract_image_filename_from_response(
        response, filename_prefix,
        created_by=created_by, prompt=prompt.strip(),
    )

    text_output = ""
    try:
        text_output = response.text or ""
    except Exception:
        text_output = ""

    return {
        "filename": filename,
        "text_output": text_output,
    }
