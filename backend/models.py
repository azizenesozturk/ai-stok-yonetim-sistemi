from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum


class HareketTipi(str, enum.Enum):
    giris = "giris"
    cikis = "cikis"
    iade = "iade"
    fire = "fire"


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)

    products = relationship("Product", back_populates="category")


class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    contact_email = Column(String(150), nullable=True)
    phone = Column(String(30), nullable=True)
    lead_time_days = Column(Integer, default=7)  # tedarik süresi - AI önerisi için önemli

    products = relationship("Product", back_populates="supplier")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String(50), unique=True, nullable=False, index=True)  # stok kodu
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False, default=0.0)
    cost = Column(Float, nullable=False, default=0.0)  # maliyet fiyatı

    current_stock = Column(Integer, nullable=False, default=0)
    min_stock_level = Column(Integer, nullable=False, default=10)  # kritik stok eşiği

    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    category = relationship("Category", back_populates="products")
    supplier = relationship("Supplier", back_populates="products")
    movements = relationship("StockMovement", back_populates="product", cascade="all, delete-orphan")


class StockMovement(Base):
    __tablename__ = "stock_movements"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    movement_type = Column(Enum(HareketTipi), nullable=False)
    quantity = Column(Integer, nullable=False)  # pozitif sayı, tipi movement_type belirler
    note = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    product = relationship("Product", back_populates="movements")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(150), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())