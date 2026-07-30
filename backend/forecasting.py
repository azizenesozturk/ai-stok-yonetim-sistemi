"""
Basit ama etkili talep tahmini motoru.
Yöntem: Ağırlıklı hareketli ortalama + trend katsayısı
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
import models


def get_daily_sales(db: Session, product_id: int, days: int = 90):
    """Belirtilen ürün için son N günün günlük satış verisini çeker"""
    cutoff = datetime.now() - timedelta(days=days)

    movements = (
        db.query(models.StockMovement)
        .filter(
            models.StockMovement.product_id == product_id,
            models.StockMovement.movement_type == models.HareketTipi.cikis,
            models.StockMovement.created_at >= cutoff,
        )
        .all()
    )

    if not movements:
        return None

    # Hareketleri günlere göre grupla
    data = [(m.created_at.date(), m.quantity) for m in movements]
    df = pd.DataFrame(data, columns=["date", "quantity"])
    daily = df.groupby("date")["quantity"].sum()

    # Eksik günleri 0 ile doldur (satış olmayan günler de önemli veri)
    full_range = pd.date_range(start=daily.index.min(), end=daily.index.max())
    daily = daily.reindex(full_range.date, fill_value=0)

    return daily


def forecast_demand(db: Session, product_id: int, forecast_days: int = 7):
    """
    Önümüzdeki N gün için talep tahmini üretir.
    Yöntem: Son 30 günün ağırlıklı ortalaması + basit trend analizi
    """
    daily_sales = get_daily_sales(db, product_id, days=90)

    if daily_sales is None or len(daily_sales) < 7:
        return {
            "has_enough_data": False,
            "message": "Tahmin için yeterli geçmiş veri yok (en az 7 günlük satış geçmişi gerekli)",
        }

    values = daily_sales.values

    # Son 30 güne daha fazla ağırlık ver (yakın geçmiş daha önemli)
    recent_window = min(30, len(values))
    recent_values = values[-recent_window:]

    # Basit ağırlıklı ortalama: son günler daha ağır basar
    weights = np.linspace(0.5, 1.5, recent_window)
    weighted_avg = np.average(recent_values, weights=weights)

    # Trend hesapla: ilk yarı vs ikinci yarının ortalaması
    half = recent_window // 2
    if half > 0:
        first_half_avg = np.mean(recent_values[:half])
        second_half_avg = np.mean(recent_values[half:])
        trend_ratio = (second_half_avg + 0.1) / (first_half_avg + 0.1)
        # Trendi aşırı uçlara gitmesin diye sınırlayalım
        trend_ratio = np.clip(trend_ratio, 0.7, 1.5)
    else:
        trend_ratio = 1.0

    daily_forecast = weighted_avg * trend_ratio
    total_forecast = daily_forecast * forecast_days

    # Standart sapma ile belirsizlik aralığı (basit güven aralığı)
    std_dev = np.std(recent_values)
    lower_bound = max(0, (daily_forecast - std_dev) * forecast_days)
    upper_bound = (daily_forecast + std_dev) * forecast_days

    trend_label = "artan" if trend_ratio > 1.1 else ("azalan" if trend_ratio < 0.9 else "stabil")

    return {
        "has_enough_data": True,
        "daily_average_forecast": round(float(daily_forecast), 2),
        "total_forecast": round(float(total_forecast), 1),
        "forecast_days": forecast_days,
        "trend": trend_label,
        "trend_ratio": round(float(trend_ratio), 2),
        "confidence_range": {
            "lower": round(float(lower_bound), 1),
            "upper": round(float(upper_bound), 1),
        },
        "based_on_days": int(len(values)),
    }


def suggest_reorder(db: Session, product: models.Product, forecast_days: int = 14):
    """
    Tahmine + mevcut stoğa + tedarik süresine göre sipariş önerisi üretir.
    """
    forecast = forecast_demand(db, product.id, forecast_days=forecast_days)

    if not forecast["has_enough_data"]:
        return {
            "should_reorder": bool(product.current_stock <= product.min_stock_level),
            "reason": "Yeterli satış verisi yok, sadece minimum stok eşiğine göre değerlendirildi",
            "suggested_quantity": int(max(0, product.min_stock_level * 2 - product.current_stock)) if product.current_stock <= product.min_stock_level else 0,
        }

    lead_time = product.supplier.lead_time_days if product.supplier else 7
    daily_forecast = float(forecast["daily_average_forecast"])

    # Tedarik süresi boyunca beklenen tüketim
    expected_consumption_during_leadtime = daily_forecast * lead_time

    # Güvenlik stoğu (belirsizliğe karşı tampon - beklenen tüketimin %30'u kadar ekstra)
    safety_stock = expected_consumption_during_leadtime * 0.3

    reorder_point = expected_consumption_during_leadtime + safety_stock

    should_reorder = bool(product.current_stock <= reorder_point)

    suggested_quantity = 0
    if should_reorder:
        # Tedarik süresi + sonraki periyot için yeterli stok öner
        target_stock = daily_forecast * (lead_time + forecast_days) + safety_stock
        suggested_quantity = int(max(0, round(target_stock - product.current_stock)))

    return {
        "should_reorder": should_reorder,
        "current_stock": int(product.current_stock),
        "reorder_point": round(float(reorder_point), 1),
        "lead_time_days": int(lead_time),
        "daily_forecast": daily_forecast,
        "suggested_quantity": suggested_quantity,
        "reason": (
            f"Mevcut stok ({product.current_stock}) sipariş noktasının ({round(float(reorder_point), 1)}) altında"
            if should_reorder
            else f"Mevcut stok ({product.current_stock}) yeterli, sipariş noktası: {round(float(reorder_point), 1)}"
        ),
    }

def detect_anomalies(db: Session, product_id: int, days: int = 30, z_threshold: float = 2.0):
    """
    Son N günün satışlarında istatistiksel anomali tespiti yapar.
    Z-skoru z_threshold'u aşan günler anomali olarak işaretlenir.
    """
    daily_sales = get_daily_sales(db, product_id, days=days)

    if daily_sales is None or len(daily_sales) < 7:
        return []

    values = daily_sales.values
    mean = np.mean(values)
    std = np.std(values)

    if std == 0:
        return []

    anomalies = []
    for date, quantity in daily_sales.items():
        z_score = (quantity - mean) / std
        if abs(z_score) >= z_threshold:
            anomalies.append({
                "date": str(date),
                "quantity": int(quantity),
                "expected_average": round(float(mean), 1),
                "z_score": round(float(z_score), 2),
                "type": "yüksek_satış" if z_score > 0 else "düşük_satış",
            })

    return sorted(anomalies, key=lambda x: x["date"], reverse=True)