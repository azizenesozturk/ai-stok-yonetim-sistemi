from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
import models
import schemas

router = APIRouter(prefix="/stock-movements", tags=["Stock Movements"])


@router.post("/", response_model=schemas.StockMovementOut)
def create_movement(movement: schemas.StockMovementCreate, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == movement.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")

    # Stok miktarını güncelle
    if movement.movement_type in [models.HareketTipi.giris, models.HareketTipi.iade]:
        product.current_stock += movement.quantity
    elif movement.movement_type in [models.HareketTipi.cikis, models.HareketTipi.fire]:
        if product.current_stock < movement.quantity:
            raise HTTPException(status_code=400, detail="Yetersiz stok")
        product.current_stock -= movement.quantity

    new_movement = models.StockMovement(**movement.model_dump())
    db.add(new_movement)
    db.commit()
    db.refresh(new_movement)
    return new_movement


@router.get("/", response_model=List[schemas.StockMovementOut])
def list_movements(
    product_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(models.StockMovement)
    if product_id:
        query = query.filter(models.StockMovement.product_id == product_id)
    return query.order_by(models.StockMovement.created_at.desc()).offset(skip).limit(limit).all()