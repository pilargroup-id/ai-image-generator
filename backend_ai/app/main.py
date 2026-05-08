from dotenv import load_dotenv
load_dotenv()

import json
from pathlib import Path
from datetime import datetime

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from app.config import (
    APP_NAME,
    APP_ENV,
    CORS_ORIGINS,
    MAX_FILE_SIZE_BYTES,
    ALLOWED_IMAGE_TYPES,
    OUTPUT_DIR,
    GEMINI_API_KEY_ECOMMERCE,
    GEMINI_API_KEY_PRODUCT,
)
from app.gemini_service import edit_image_with_gemini, upscale_image
from app.auth import verify_token

# ── Department detection ──────────────────────────────────────────────────────

ECOMMERCE_FILENAME_PREFIX = "ec_"
PRODUCT_FILENAME_PREFIX   = "pd_"


def get_dept_category(user: dict) -> str:
    dept_raw = (
        user.get("department") or
        user.get("division") or
        user.get("department_name") or
        user.get("departmentName") or
        ""
    ).strip().lower()

    if dept_raw in ("it", "information technology", "department it", "departement it", "it department"):
        return "it"
    if ("product" in dept_raw
            and "ecommerce" not in dept_raw
            and "e-commerce" not in dept_raw
            and "e commerce" not in dept_raw):
        return "product"
    if "ecommerce" in dept_raw or "e-commerce" in dept_raw or "e commerce" in dept_raw:
        return "ecommerce"
    return "ecommerce"


def get_api_key_for_dept(dept: str) -> str:
    if dept == "product":
        return GEMINI_API_KEY_PRODUCT
    return GEMINI_API_KEY_ECOMMERCE


def get_filename_prefix_for_dept(dept: str) -> str:
    if dept == "product":
        return PRODUCT_FILENAME_PREFIX
    return ECOMMERCE_FILENAME_PREFIX


def get_file_dept(filename: str) -> str:
    if filename.startswith(PRODUCT_FILENAME_PREFIX):
        return "product"
    return "ecommerce"  # ec_ prefix atau legacy (tanpa prefix) = ecommerce


def can_view_file(filename: str, user_dept: str) -> bool:
    if user_dept == "it":
        return True
    return get_file_dept(filename) == user_dept

print("MAIN PY CORS_ORIGINS:", CORS_ORIGINS)

BASE_DIR          = Path(__file__).resolve().parent.parent
FRONTEND_DIST_DIR = BASE_DIR / "frontend_dist"
FRONTEND_ASSETS_DIR = FRONTEND_DIST_DIR / "assets"

app = FastAPI(title=APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_basic_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response


if FRONTEND_ASSETS_DIR.exists():
    app.mount("/assets", StaticFiles(directory=FRONTEND_ASSETS_DIR), name="assets")


def frontend_index_exists() -> bool:
    return (FRONTEND_DIST_DIR / "index.html").exists()


def serve_frontend_index():
    index_file = FRONTEND_DIST_DIR / "index.html"
    if not index_file.exists():
        raise HTTPException(
            status_code=404,
            detail="Frontend belum tersedia. Build frontend lalu copy ke backend_ai/frontend_dist",
        )
    return FileResponse(index_file)


def get_created_at(file_path: Path) -> str:
    try:
        return datetime.fromtimestamp(file_path.stat().st_ctime).strftime("%Y-%m-%d %H:%M:%S")
    except Exception:
        return "-"


# ── Public routes ─────────────────────────────────────────────────────────────

@app.get("/")
def root():
    if frontend_index_exists():
        return serve_frontend_index()
    return {"message": f"{APP_NAME} running", "env": APP_ENV, "cors_origins": CORS_ORIGINS}


@app.get("/health")
@app.get("/api/health")
def health():
    return {"status": "ok"}


# GET gallery — butuh JWT, difilter berdasarkan departemen user
@app.get("/gallery")
@app.get("/api/gallery")
async def get_gallery(current_user: dict = Depends(verify_token)):
    user_dept = get_dept_category(current_user)

    if not OUTPUT_DIR.exists():
        return []

    allowed_exts = {".png", ".jpg", ".jpeg", ".webp"}
    items = []

    for file_path in OUTPUT_DIR.iterdir():
        if not file_path.is_file():
            continue
        if file_path.suffix.lower() not in allowed_exts:
            continue
        if not can_view_file(file_path.name, user_dept):
            continue

        # Baca sidecar metadata jika ada
        meta_path = OUTPUT_DIR / (file_path.name + ".json")
        created_by = ""
        prompt_meta = ""
        if meta_path.exists():
            try:
                meta = json.loads(meta_path.read_text(encoding="utf-8"))
                created_by  = meta.get("createdBy", "")
                prompt_meta = meta.get("prompt", "")
            except Exception:
                pass

        items.append({
            "id":          file_path.name,
            "fileName":    file_path.name,
            "filename":    file_path.name,
            "imageUrl":    f"/image/{file_path.name}",
            "apiImageUrl": f"/api/image/{file_path.name}",
            "createdAt":   get_created_at(file_path),
            "prompt":      prompt_meta or file_path.stem,
            "createdBy":   created_by,
        })

    items.sort(
        key=lambda item: (OUTPUT_DIR / item["filename"]).stat().st_ctime,
        reverse=True,
    )
    return items


@app.get("/image/{filename}")
@app.get("/api/image/{filename}")
def get_image(filename: str):
    file_path = OUTPUT_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File tidak ditemukan")
    return FileResponse(file_path)


# ── Protected routes (butuh JWT) ─────────────────────────────────────────────

@app.post("/image/edit")
@app.post("/api/image/edit")
async def edit_image(
    request: Request,
    file: UploadFile = File(...),
    prompt: str = Form(...),
    aspect_ratio: str = Form("original"),
    resolution: str = Form("original"),
    reference_image_count: int = Form(0),
    current_user: dict = Depends(verify_token),
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="File tidak ditemukan")
    if not prompt or not prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt wajib diisi")

    mime_type = (file.content_type or "").lower().strip()
    if mime_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Format file harus PNG, JPG, JPEG, atau WEBP")

    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="File gambar kosong")
    if len(image_bytes) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=400, detail=f"Ukuran file maksimal {MAX_FILE_SIZE_BYTES // (1024 * 1024)} MB")

    reference_images = []
    if reference_image_count > 0:
        form_data = await request.form()
        for i in range(reference_image_count):
            ref_field = form_data.get(f"reference_image_{i}")
            if ref_field is None:
                continue
            try:
                ref_bytes = await ref_field.read()
                if not ref_bytes:
                    continue
                ref_mime = (getattr(ref_field, "content_type", None) or "image/png").lower().strip()
                if ref_mime not in ALLOWED_IMAGE_TYPES:
                    continue
                if len(ref_bytes) > MAX_FILE_SIZE_BYTES:
                    continue
                reference_images.append({"data": ref_bytes, "mime_type": ref_mime})
            except Exception:
                continue

    user_dept   = get_dept_category(current_user)
    dept_api_key = get_api_key_for_dept(user_dept)
    dept_prefix  = get_filename_prefix_for_dept(user_dept)

    # Ambil nama user dari JWT
    user_display_name = (
        current_user.get("name") or
        current_user.get("full_name") or
        current_user.get("fullName") or
        current_user.get("username") or
        current_user.get("email") or
        ""
    ).strip()

    if not dept_api_key:
        raise HTTPException(
            status_code=503,
            detail="API key untuk departmen Anda belum dikonfigurasi. Hubungi admin IT.",
        )

    try:
        result = edit_image_with_gemini(
            image_bytes=image_bytes,
            mime_type=mime_type,
            prompt=prompt.strip(),
            reference_images=reference_images if reference_images else None,
            api_key=dept_api_key,
            filename_prefix=dept_prefix,
            created_by=user_display_name,
            aspect_ratio=aspect_ratio,
            requested_resolution=resolution,
        )

        if not result.get("filename"):
            raise HTTPException(
                status_code=502,
                detail=f"Model tidak mengembalikan gambar. Response text: {result.get('text_output') or 'kosong'}",
            )

        return {
            "success":      True,
            "message":      "Gambar berhasil diedit",
            "filename":     result["filename"],
            "image_url":    f"/image/{result['filename']}",
            "api_image_url": f"/api/image/{result['filename']}",
            "width":        result.get("width"),
            "height":       result.get("height"),
            "requested_resolution": result.get("requested_resolution"),
            "text_output":  result.get("text_output"),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/image/upscale")
@app.post("/api/image/upscale")
async def upscale_image_endpoint(
    file: UploadFile = File(...),
    scale: str = Form("2x"),
    current_user: dict = Depends(verify_token),
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="File tidak ditemukan")

    mime_type = (file.content_type or "").lower().strip()
    if mime_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Format file harus PNG, JPG, JPEG, atau WEBP")

    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="File gambar kosong")
    if len(image_bytes) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=400, detail=f"Ukuran file maksimal {MAX_FILE_SIZE_BYTES // (1024 * 1024)} MB")

    if scale not in ("2x", "4x"):
        scale = "2x"

    user_dept    = get_dept_category(current_user)
    dept_api_key = get_api_key_for_dept(user_dept)
    dept_prefix  = get_filename_prefix_for_dept(user_dept)

    user_display_name = (
        current_user.get("name") or
        current_user.get("full_name") or
        current_user.get("fullName") or
        current_user.get("username") or
        current_user.get("email") or
        ""
    ).strip()

    if not dept_api_key:
        raise HTTPException(
            status_code=503,
            detail="API key untuk departmen Anda belum dikonfigurasi. Hubungi admin IT.",
        )

    try:
        result = upscale_image(
            image_bytes=image_bytes,
            mime_type=mime_type,
            scale=scale,
            api_key=dept_api_key,
            filename_prefix=dept_prefix,
            created_by=user_display_name,
        )
        return {
            "success":      True,
            "message":      f"Gambar berhasil diupscale {scale}",
            "filename":     result["filename"],
            "image_url":    f"/image/{result['filename']}",
            "api_image_url": f"/api/image/{result['filename']}",
            "width":        result["width"],
            "height":       result["height"],
            "ai_enhanced":  result.get("ai_enhanced", False),
            "scale":        result.get("scale", scale),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/gallery/{filename}")
@app.delete("/api/gallery/{filename}")
def delete_gallery_item(
    filename: str,
    current_user: dict = Depends(verify_token),
):
    user_dept = get_dept_category(current_user)
    safe_name = Path(filename).name
    file_path = OUTPUT_DIR / safe_name

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File tidak ditemukan")

    allowed_exts = {".png", ".jpg", ".jpeg", ".webp"}
    if file_path.suffix.lower() not in allowed_exts:
        raise HTTPException(status_code=400, detail="Tipe file tidak diizinkan")

    if not can_view_file(safe_name, user_dept):
        raise HTTPException(status_code=403, detail="Tidak punya akses untuk menghapus file ini")

    try:
        file_path.unlink()
        # Hapus sidecar jika ada
        meta_path = OUTPUT_DIR / (safe_name + ".json")
        if meta_path.exists():
            try: meta_path.unlink()
            except Exception: pass
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal menghapus file: {e}")

    return {"success": True, "message": f"{safe_name} berhasil dihapus"}


@app.delete("/gallery")
@app.delete("/api/gallery")
def delete_all_gallery(current_user: dict = Depends(verify_token)):
    user_dept = get_dept_category(current_user)

    if not OUTPUT_DIR.exists():
        return {"success": True, "message": "Gallery sudah kosong", "deleted": 0}

    allowed_exts = {".png", ".jpg", ".jpeg", ".webp"}
    deleted = 0
    errors  = []

    for file_path in OUTPUT_DIR.iterdir():
        if not file_path.is_file():
            continue
        if file_path.suffix.lower() not in allowed_exts:
            continue
        if not can_view_file(file_path.name, user_dept):
            continue
        try:
            file_path.unlink()
            # Hapus sidecar jika ada
            meta_path = OUTPUT_DIR / (file_path.name + ".json")
            if meta_path.exists():
                try: meta_path.unlink()
                except Exception: pass
            deleted += 1
        except Exception as e:
            errors.append(f"{file_path.name}: {e}")

    if errors:
        raise HTTPException(status_code=500, detail=f"Sebagian file gagal dihapus: {'; '.join(errors)}")

    return {"success": True, "message": f"{deleted} file berhasil dihapus", "deleted": deleted}


@app.delete("/gallery/bulk")
@app.delete("/api/gallery/bulk")
async def delete_gallery_bulk(
    request: Request,
    current_user: dict = Depends(verify_token),
):
    user_dept = get_dept_category(current_user)

    try:
        body = await request.json()
        ids  = body.get("ids", [])
    except Exception:
        raise HTTPException(status_code=400, detail="Body JSON tidak valid")

    if not isinstance(ids, list) or len(ids) == 0:
        raise HTTPException(status_code=400, detail="ids harus berupa list dan tidak boleh kosong")

    allowed_exts = {".png", ".jpg", ".jpeg", ".webp"}
    deleted = 0
    errors  = []

    for filename in ids:
        safe_name = Path(str(filename)).name
        file_path = OUTPUT_DIR / safe_name
        if not file_path.exists():
            errors.append(f"{safe_name}: tidak ditemukan")
            continue
        if file_path.suffix.lower() not in allowed_exts:
            errors.append(f"{safe_name}: tipe file tidak diizinkan")
            continue
        if not can_view_file(safe_name, user_dept):
            errors.append(f"{safe_name}: tidak punya akses")
            continue
        try:
            file_path.unlink()
            deleted += 1
        except Exception as e:
            errors.append(f"{safe_name}: {e}")

    return {"success": True, "message": f"{deleted} file berhasil dihapus", "deleted": deleted, "errors": errors}


# ── Static & SPA ─────────────────────────────────────────────────────────────

@app.get("/favicon.ico")
def favicon():
    f = FRONTEND_DIST_DIR / "favicon.ico"
    if f.exists(): return FileResponse(f)
    raise HTTPException(status_code=404, detail="Favicon tidak ditemukan")

@app.get("/icons.svg")
def icons_svg():
    f = FRONTEND_DIST_DIR / "icons.svg"
    if f.exists(): return FileResponse(f)
    raise HTTPException(status_code=404, detail="icons.svg tidak ditemukan")

@app.get("/favicon.svg")
def favicon_svg():
    f = FRONTEND_DIST_DIR / "favicon.svg"
    if f.exists(): return FileResponse(f)
    raise HTTPException(status_code=404, detail="favicon.svg tidak ditemukan")


@app.get("/{full_path:path}")
def serve_react_app(full_path: str):
    if (
        full_path.startswith("image/")
        or full_path.startswith("api/image/")
        or full_path.startswith("gallery")
        or full_path.startswith("api/gallery/")
        or full_path == "api/gallery"
    ):
        raise HTTPException(status_code=404, detail="Route tidak ditemukan")

    if frontend_index_exists():
        requested_file = FRONTEND_DIST_DIR / full_path
        if requested_file.exists() and requested_file.is_file():
            return FileResponse(requested_file)
        return serve_frontend_index()

    raise HTTPException(status_code=404, detail="Route tidak ditemukan")


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(status_code=exc.status_code, content={"success": False, "detail": exc.detail})

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"success": False, "detail": str(exc)})
