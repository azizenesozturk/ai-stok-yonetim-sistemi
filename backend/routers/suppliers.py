from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
import models
import schemas

router = APIRouter(prefix="/suppliers", tags=["Suppliers"])


@router.post("/", response_model=schemas.SupplierOut)
def create_supplier(supplier: schemas.SupplierCreate, db: Session = Depends(get_db)):
    new_supplier = models.Supplier(**supplier.model_dump())
    db.add(new_supplier)
    db.commit()
    db.refresh(new_supplier)
    return new_supplier


@router.get("/", response_model=List[schemas.SupplierOut])
def list_suppliers(db: Session = Depends(get_db)):
    return db.query(models.Supplier).all()


@router.get("/{supplier_id}", response_model=schemas.SupplierOut)
def get_supplier(supplier_id: int, db: Session = Depends(get_db)):
    supplier = db.query(models.Supplier).filter(models.Supplier.id == supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Tedarikçi bulunamadı")
    return supplier


@router.delete("/{supplier_id}")
def delete_supplier(supplier_id: int, db: Session = Depends(get_db)):
    supplier = db.query(models.Supplier).filter(models.Supplier.id == supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Tedarikçi bulunamadı")
    db.delete(supplier)
    db.commit()
    return {"mesaj": "Tedarikçi silindi"}