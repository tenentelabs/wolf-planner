from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from app.models import Cliente, ClienteCreate, ClienteUpdate
from app.database import supabase
from app.auth import get_current_user

router = APIRouter(prefix="/clientes", tags=["clientes"])

@router.get("/", response_model=List[Cliente])
async def listar_clientes(current_user = Depends(get_current_user)):
    try:
        response = supabase.table("clientes").select("*").eq("user_id", current_user.id).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{cliente_id}", response_model=Cliente)
async def obter_cliente(cliente_id: str, current_user = Depends(get_current_user)):
    try:
        response = supabase.table("clientes").select("*").eq("id", cliente_id).eq("user_id", current_user.id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Cliente não encontrado")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/", response_model=Cliente)
async def criar_cliente(cliente: ClienteCreate, current_user = Depends(get_current_user)):
    try:
        data = {
            **cliente.dict(),
            "user_id": current_user.id
        }
        response = supabase.table("clientes").insert(data).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{cliente_id}", response_model=Cliente)
async def atualizar_cliente(cliente_id: str, cliente: ClienteUpdate, current_user = Depends(get_current_user)):
    try:
        # Verificar se o cliente pertence ao usuário
        check = supabase.table("clientes").select("id").eq("id", cliente_id).eq("user_id", current_user.id).execute()
        if not check.data:
            raise HTTPException(status_code=404, detail="Cliente não encontrado")
        
        # Atualizar apenas campos não nulos
        update_data = {k: v for k, v in cliente.dict().items() if v is not None}
        response = supabase.table("clientes").update(update_data).eq("id", cliente_id).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{cliente_id}")
async def deletar_cliente(cliente_id: str, current_user = Depends(get_current_user)):
    try:
        # Verificar se o cliente pertence ao usuário
        check = supabase.table("clientes").select("id").eq("id", cliente_id).eq("user_id", current_user.id).execute()
        if not check.data:
            raise HTTPException(status_code=404, detail="Cliente não encontrado")
        
        response = supabase.table("clientes").delete().eq("id", cliente_id).execute()
        return {"message": "Cliente deletado com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))