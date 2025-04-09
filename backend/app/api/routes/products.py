from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app import crud
from app.api.deps import get_db, get_current_user
from app.models import Product, ProductCreate, ProductUpdate

router = APIRouter()

@router.get("/", response_model=List[Product])
def read_products(db: Session = Depends(get_db)) -> List[Product]:
    return crud.get_products(db)

@router.post("/", response_model=Product)
def create_product(
    *, db: Session = Depends(get_db), _: dict = Depends(get_current_user), product_in: ProductCreate
) -> Product:
    return crud.create_product(db, product_in)

@router.get("/{product_id}", response_model=Product)
def read_product(product_id: str, db: Session = Depends(get_db)) -> Product:
    product = crud.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return product

@router.put("/{product_id}", response_model=Product)
def update_product(
    *, db: Session = Depends(get_db), _: dict = Depends(get_current_user), product_id: str, product_in: ProductUpdate
) -> Product:
    product = crud.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return crud.update_product(db, product, product_in)

@router.delete("/{product_id}", response_model=dict)
def delete_product(
    *, db: Session = Depends(get_db), _: dict = Depends(get_current_user), product_id: str
) -> dict:
    product = crud.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    crud.delete_product(db, product)
    return {"message": "Producto eliminado correctamente"}
