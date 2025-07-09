from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json

# Agent fonksiyonunu içe aktar
from agent import process_message

# FastAPI uygulaması
app = FastAPI()

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Geliştirme için tüm kaynaklara izin ver
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JSON veritabanını yükle
try:
    with open("student_db.json", "r", encoding="utf-8") as f:
        student_db = json.load(f)
except FileNotFoundError:
    student_db = {}
    print("⚠️ student_db.json dosyası bulunamadı.")

# Veri modeli
class ChatRequest(BaseModel):
    user_id: str
    message: str

# Test endpoint'i
@app.get("/test")
async def test():
    return {"message": "Backend çalışıyor!", "status": "OK"}

# Chat endpoint'i
@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        result = process_message(request.user_id, request.message)
        return {
            "tool_call": result.get("tool_call", ""),
            "response": result.get("result", "Yanıt bulunamadı.")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Öğrenci bilgisi sorgulama endpoint'i
@app.post("/get_student")
async def get_student(request: Request):
    try:
        data = await request.json()
        user_id = data.get("userId")  # frontend camelCase gönderiyor

        student = student_db.get(user_id)
        if student:
            return {"success": True, "student": student}
        else:
            return {"success": False, "message": "Öğrenci bulunamadı"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
