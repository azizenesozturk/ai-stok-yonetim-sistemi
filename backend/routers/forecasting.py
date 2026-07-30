from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
import models
import forecasting

router = APIRouter(prefix="/forecast", tags=["AI Forecasting"])


@router.get("/{product_id}")
def get_product_forecast(product_id: int, days: int = 7, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")

    forecast = forecasting.forecast_demand(db, product_id, forecast_days=days)
    return {
        "product_id": product.id,
        "product_name": product.name,
        **forecast,
    }


@router.get("/{product_id}/reorder-suggestion")
def get_reorder_suggestion(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")

    suggestion = forecasting.suggest_reorder(db, product)
    return {
        "product_id": product.id,
        "product_name": product.name,
        **suggestion,
    }


@router.get("/")
def get_all_reorder_suggestions(db: Session = Depends(get_db)):
    """Tüm ürünler için toplu sipariş önerisi - dashboard'da kullanılacak"""
    products = db.query(models.Product).all()
    results = []

    for product in products:
        suggestion = forecasting.suggest_reorder(db, product)
        if suggestion.get("should_reorder"):
            results.append({
                "product_id": product.id,
                "product_name": product.name,
                "sku": product.sku,
                **suggestion,
            })

    return results

@router.get("/{product_id}/history")
def get_sales_history(product_id: int, days: int = 30, db: Session = Depends(get_db)):
    """Grafik için günlük satış geçmişini döndürür"""
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")

    daily_sales = forecasting.get_daily_sales(db, product_id, days=days)

    if daily_sales is None:
        return []

    return [
        {"date": str(date), "quantity": int(qty)}
        for date, qty in daily_sales.items()
    ]

@router.get("/{product_id}/anomalies")
def get_anomalies(product_id: int, days: int = 30, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")

    anomalies = forecasting.detect_anomalies(db, product_id, days=days)
    return {
        "product_id": product.id,
        "product_name": product.name,
        "anomaly_count": len(anomalies),
        "anomalies": anomalies,
    }


@router.get("/anomalies/all")
def get_all_anomalies(db: Session = Depends(get_db)):
    """Tüm ürünler için anomali taraması - dashboard için"""
    products = db.query(models.Product).all()
    results = []

    for product in products:
        anomalies = forecasting.detect_anomalies(db, product.id, days=30)
        if anomalies:
            results.append({
                "product_id": product.id,
                "product_name": product.name,
                "sku": product.sku,
                "anomaly_count": len(anomalies),
                "latest_anomaly": anomalies[0],
            })

    return results