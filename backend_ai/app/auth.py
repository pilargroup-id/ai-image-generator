import os
import httpx
import jwt
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

JWT_SECRET        = os.getenv("JWT_SECRET", "")
JWT_ALGORITHM     = "HS256"
FRAMELENS_APP_KEY = os.getenv("FRAMELENS_APP_KEY", "framelens")
PILARGROUP_API_URL = os.getenv("PILARGROUP_API_URL", "https://pilargroup.id/api")

security = HTTPBearer()


async def verify_token(
    credentials: HTTPAuthorizationCredentials = Security(security),
):
    token = credentials.credentials

    if not JWT_SECRET:
        raise HTTPException(status_code=500, detail="JWT_SECRET belum dikonfigurasi di .env")

    # 1. Verify signature & expiry lokal
    try:
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM],
            options={"verify_aud": False},
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token sudah expired, silakan login ulang.")
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=f"Token tidak valid: {str(e)}")

    # 2. Cek akses framelens
    apps = payload.get("apps", [])
    if FRAMELENS_APP_KEY not in apps:
        raise HTTPException(status_code=403, detail="Akun kamu tidak punya akses ke Framelens.")

    # 3. Verify ke pilargroup — cek token_version / force logout
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            res = await client.get(
                f"{PILARGROUP_API_URL}/auth/status",
                headers={"Authorization": f"Bearer {token}"},
            )
    except httpx.TimeoutException:
        raise HTTPException(status_code=503, detail="Auth server timeout, coba lagi.")
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Auth server tidak dapat dihubungi.")

    if res.status_code == 401:
        raise HTTPException(status_code=401, detail="Sesi tidak valid, silakan login ulang.")

    if res.status_code != 200:
        raise HTTPException(status_code=503, detail="Auth server error.")

    if not res.json().get("valid", False):
        raise HTTPException(status_code=401, detail="Sesi sudah tidak aktif, silakan login ulang.")

    return payload