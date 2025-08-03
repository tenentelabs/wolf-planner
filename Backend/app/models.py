from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

# Modelos de Request/Response
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class ClienteBase(BaseModel):
    nome: str
    email: EmailStr
    telefone: Optional[str] = None

class ClienteCreate(ClienteBase):
    pass

class ClienteUpdate(ClienteBase):
    nome: Optional[str] = None
    email: Optional[EmailStr] = None
    telefone: Optional[str] = None

class Cliente(ClienteBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

class ObjetivoBase(BaseModel):
    nome: str
    descricao: Optional[str] = None
    valor_meta: Optional[float] = None

class ObjetivoCreate(ObjetivoBase):
    cliente_id: str

class ObjetivoUpdate(ObjetivoBase):
    nome: Optional[str] = None
    valor_meta: Optional[float] = None

class Objetivo(ObjetivoBase):
    id: str
    cliente_id: str
    created_at: datetime

class InvestimentoBase(BaseModel):
    nome: str
    valor: float
    tipo: Optional[str] = None

class InvestimentoCreate(InvestimentoBase):
    objetivo_id: str

class InvestimentoUpdate(InvestimentoBase):
    nome: Optional[str] = None
    valor: Optional[float] = None

class Investimento(InvestimentoBase):
    id: str
    objetivo_id: str
    created_at: datetime
    
    class Config:
        json_encoders = {
            Decimal: float
        }

class ClienteCarteira(BaseModel):
    cliente_id: str
    objetivos: List[Objetivo]
    investimentos_por_objetivo: dict