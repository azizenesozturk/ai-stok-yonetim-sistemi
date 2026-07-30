from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
import models
import schemas

router = APIRouter(prefix="/products", tags=["Products"])


@router.post("/", response_model=schemas.ProductOut)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Product).filter(models.Product.sku == product.sku).first()
    if existing:
        raise HTTPException(status_code=400, detail="Bu SKU zaten kayıtlı")
    new_product = models.Product(**product.model_dump())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product


@router.get("/", response_model=List[schemas.ProductOut])
def list_products(
    skip: int = 0,
    limit: int = 100,
    low_stock_only: bool = False,
    db: Session = Depends(get_db)
):
    query = db.query(models.Product)
    if low_stock_only:
        query = query.filter(models.Product.current_stock <= models.Product.min_stock_level)
    return query.offset(skip).limit(limit).all()


@router.get("/{product_id}", response_model=schemas.ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")
    return product


@router.put("/{product_id}", response_model=schemas.ProductOut)
def update_product(product_id: int, updates: schemas.ProductUpdate, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")

    for field, value in updates.model_dump(exclude_unset=True).items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")
    db.delete(product)
    db.commit()
    return {"mesaj": "Ürün silindi"}