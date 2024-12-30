from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os
import qrcode
from PIL import Image

app = FastAPI()

# CORS enabled
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your needs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
async def root():
    return {"message": "File upload API is running!"}

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    file_location = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_location, "wb") as f:
        f.write(await file.read())

    # Generate QR code
    file_url = f"http://127.0.0.1:8000/uploads/{file.filename}"
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(file_url)
    qr.make(fit=True)
    qr_image_path = os.path.join(UPLOAD_DIR, f"{file.filename}.png")
    img = qr.make_image(fill_color="black", back_color="white")
    img.save(qr_image_path)

    return JSONResponse(
        content={
            "message": "File uploaded successfully",
            "file_path": file_location,
            "qr_code_path": qr_image_path
        }
    )