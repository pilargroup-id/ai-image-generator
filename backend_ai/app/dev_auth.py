import os
import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

PILARGROUP_API_URL = os.getenv("PILARGROUP_API_URL", "http://localhost:8000/api")


class MockLoginRequest(BaseModel):
    username: str
    password: str


@router.post("/dev/login")
async def dev_login(body: MockLoginRequest):
    mock_username = os.getenv("DEV_MOCK_USERNAME", "")
    mock_password = os.getenv("DEV_MOCK_PASSWORD", "")

    if body.username != mock_username or body.password != mock_password:
        raise HTTPException(status_code=401, detail="Invalid mock credentials")

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            res = await client.post(
                f"{PILARGROUP_API_URL}/auth/login",
                json={"username": body.username, "password": body.password},
                headers={"Accept": "application/json"},
            )
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Tidak bisa konek ke pilargroup lokal")

    if res.status_code != 200:
        raise HTTPException(status_code=401, detail="Login ke pilargroup gagal")

    data = res.json()

    return {
        "access_token": data["token"],
        "user": data["user"],
    }