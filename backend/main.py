from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models
from routers import categories, suppliers, products, stock_movements
from routers import categories, suppliers, products, stock_movements, forecasting, auth as auth_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Stok Yönetim Sistemi")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://ai-stok-yonetim-sistemi.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(categories.router)
app.include_router(suppliers.router)
app.include_router(products.router)
app.include_router(stock_movements.router)
app.include_router(forecasting.router)
app.include_router(auth_router.router)

@app.get("/")
def read_root():
    return {"mesaj": "AI Stok Yönetim Sistemi API çalışıyor 🚀"}