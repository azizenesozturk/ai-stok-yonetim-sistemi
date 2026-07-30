from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from enum import Enum


class HareketTipiEnum(str, Enum):
    giris = "giris"
    cikis = "cikis"
    iade = "iade"
    fire = "fire"


# ---------- Category ----------
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryOut(CategoryBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


# ---------- Supplier ----------
class SupplierBase(BaseModel):
    name: str
    contact_email: Optional[str] = None
    phone: Optional[str] = None
    lead_time_days: int = 7

class SupplierCreate(SupplierBase):
    pass

class SupplierOut(SupplierBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


# ---------- Product ----------
class ProductBase(BaseModel):
    sku: str
    name: str
    description: Optional[str] = None
    price: float = 0.0
    cost: float = 0.0
    current_stock: int = 0
    min_stock_level: int = 10
    category_id: Optional[int] = None
    supplier_id: Optional[int] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    cost: Optional[float] = None
    min_stock_level: Optional[int] = None
    category_id: Optional[int] = None
    supplier_id: Optional[int] = None

class ProductOut(ProductBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# ---------- Stock Movement ----------
class StockMovementBase(BaseModel):
    product_id: int
    movement_type: HareketTipiEnum
    quantity: int
    note: Optional[str] = None

class StockMovementCreate(StockMovementBase):
    pass

class StockMovementOut(StockMovementBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)