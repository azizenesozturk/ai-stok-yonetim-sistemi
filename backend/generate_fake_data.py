"""
Bu script, mevcut ürünler için son 90 günlük gerçekçi satış geçmişi üretir.
AI tahmin modelini test edebilmek için gerçek veri simülasyonu yapar.
"""

import random
from datetime import datetime, timedelta
from database import SessionLocal
import models

def generate_history(days=90):
    db = SessionLocal()
    products = db.query(models.Product).all()

    if not products:
        print("Önce en az bir ürün eklemelisin!")
        return

    today = datetime.now()

    for product in products:
        # Her ürün için farklı bir "temel satış hızı" belirleyelim (biraz rastgelelik katıyoruz)
        base_daily_sales = random.randint(1, 8)

        for day_offset in range(days, 0, -1):
            movement_date = today - timedelta(days=day_offset)

            # Hafta sonu satışları biraz daha az olsun (gerçekçilik için)
            is_weekend = movement_date.weekday() >= 5
            daily_sales = base_daily_sales
            if is_weekend:
                daily_sales = max(0, int(daily_sales * 0.6))

            # Rastgele dalgalanma ekleyelim (%40 varyasyon)
            daily_sales = max(0, int(daily_sales * random.uniform(0.6, 1.4)))

            # Ara sıra bir "kampanya günü" simüle edelim (satışlar aniden artsın)
            if random.random() < 0.05:  # %5 ihtimalle
                daily_sales = int(daily_sales * random.uniform(2, 3))

            if daily_sales > 0:
                movement = models.StockMovement(
                    product_id=product.id,
                    movement_type=models.HareketTipi.cikis,
                    quantity=daily_sales,
                    note="Simüle edilmiş satış verisi",
                    created_at=movement_date
                )
                db.add(movement)

        print(f"'{product.name}' için {days} günlük satış geçmişi oluşturuldu (günlük ort. {base_daily_sales} adet)")

    db.commit()
    db.close()
    print("\n✅ Sahte veri üretimi tamamlandı!")

if __name__ == "__main__":
    generate_history(days=90)