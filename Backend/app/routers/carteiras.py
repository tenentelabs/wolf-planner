from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from app.models import Objetivo, ObjetivoCreate, ObjetivoUpdate, Investimento, InvestimentoCreate, InvestimentoUpdate, ClienteCarteira
from app.database import supabase
from app.auth import get_current_user

router = APIRouter(prefix="/carteiras", tags=["carteiras"])

# Endpoints para Objetivos
@router.get("/cliente/{cliente_id}/objetivos", response_model=List[Objetivo])
async def listar_objetivos(cliente_id: str, current_user = Depends(get_current_user)):
    try:
        # Verificar se o cliente pertence ao usuário
        cliente = supabase.table("clientes").select("id").eq("id", cliente_id).eq("user_id", current_user.id).execute()
        if not cliente.data:
            raise HTTPException(status_code=404, detail="Cliente não encontrado")
        
        response = supabase.table("objetivos").select("*").eq("cliente_id", cliente_id).execute()
        
        # Converter Decimal para float em valor_meta se necessário
        objetivos = response.data
        for obj in objetivos:
            if 'valor_meta' in obj and obj['valor_meta'] is not None:
                obj['valor_meta'] = float(obj['valor_meta'])
        
        return objetivos
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/objetivos", response_model=Objetivo)
async def criar_objetivo(objetivo: ObjetivoCreate, current_user = Depends(get_current_user)):
    try:
        # Verificar se o cliente pertence ao usuário
        cliente = supabase.table("clientes").select("id").eq("id", objetivo.cliente_id).eq("user_id", current_user.id).execute()
        if not cliente.data:
            raise HTTPException(status_code=404, detail="Cliente não encontrado")
        
        response = supabase.table("objetivos").insert(objetivo.dict()).execute()
        
        # Converter Decimal para float em valor_meta se necessário
        objetivo_data = response.data[0]
        if 'valor_meta' in objetivo_data and objetivo_data['valor_meta'] is not None:
            objetivo_data['valor_meta'] = float(objetivo_data['valor_meta'])
        
        return objetivo_data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/objetivos/{objetivo_id}", response_model=Objetivo)
async def atualizar_objetivo(objetivo_id: str, objetivo: ObjetivoUpdate, current_user = Depends(get_current_user)):
    try:
        # Verificar se o objetivo pertence a um cliente do usuário
        check = supabase.table("objetivos").select("*, clientes!inner(user_id)").eq("id", objetivo_id).execute()
        if not check.data or check.data[0]["clientes"]["user_id"] != current_user.id:
            raise HTTPException(status_code=404, detail="Objetivo não encontrado")
        
        # Incluir explicitamente campos que podem ser None/null (como valor_meta)
        update_data = {}
        objetivo_dict = objetivo.dict()
        
        for k, v in objetivo_dict.items():
            if k == 'valor_meta':
                # Para valor_meta, incluir sempre (mesmo se None/null para remover)
                update_data[k] = v
            elif v is not None:
                # Para outros campos, só incluir se não for None
                update_data[k] = v
        
        response = supabase.table("objetivos").update(update_data).eq("id", objetivo_id).execute()
        
        # Converter Decimal para float em valor_meta se necessário
        objetivo_data = response.data[0]
        if 'valor_meta' in objetivo_data and objetivo_data['valor_meta'] is not None:
            objetivo_data['valor_meta'] = float(objetivo_data['valor_meta'])
        
        return objetivo_data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/objetivos/{objetivo_id}")
async def deletar_objetivo(objetivo_id: str, current_user = Depends(get_current_user)):
    try:
        # Verificar se o objetivo pertence a um cliente do usuário
        check = supabase.table("objetivos").select("*, clientes!inner(user_id)").eq("id", objetivo_id).execute()
        if not check.data or check.data[0]["clientes"]["user_id"] != current_user.id:
            raise HTTPException(status_code=404, detail="Objetivo não encontrado")
        
        response = supabase.table("objetivos").delete().eq("id", objetivo_id).execute()
        return {"message": "Objetivo deletado com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Endpoints para Investimentos
@router.get("/objetivo/{objetivo_id}/investimentos", response_model=List[Investimento])
async def listar_investimentos(objetivo_id: str, current_user = Depends(get_current_user)):
    try:
        # Verificar se o objetivo pertence a um cliente do usuário
        check = supabase.table("objetivos").select("*, clientes!inner(user_id)").eq("id", objetivo_id).execute()
        if not check.data or check.data[0]["clientes"]["user_id"] != current_user.id:
            raise HTTPException(status_code=404, detail="Objetivo não encontrado")
        
        response = supabase.table("investimentos").select("*").eq("objetivo_id", objetivo_id).execute()
        # Converter Decimal para float em todos os investimentos
        investimentos = response.data
        for inv in investimentos:
            if 'valor' in inv and inv['valor'] is not None:
                inv['valor'] = float(inv['valor'])
        return investimentos
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/investimentos", response_model=Investimento)
async def criar_investimento(investimento: InvestimentoCreate, current_user = Depends(get_current_user)):
    try:
        # Verificar se o objetivo pertence a um cliente do usuário
        check = supabase.table("objetivos").select("*, clientes!inner(user_id)").eq("id", investimento.objetivo_id).execute()
        if not check.data or check.data[0]["clientes"]["user_id"] != current_user.id:
            raise HTTPException(status_code=404, detail="Objetivo não encontrado")
        
        response = supabase.table("investimentos").insert(investimento.dict()).execute()
        # Converter Decimal para float se necessário
        investimento_data = response.data[0]
        if 'valor' in investimento_data and investimento_data['valor'] is not None:
            investimento_data['valor'] = float(investimento_data['valor'])
        return investimento_data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/investimentos/{investimento_id}", response_model=Investimento)
async def atualizar_investimento(investimento_id: str, investimento: InvestimentoUpdate, current_user = Depends(get_current_user)):
    try:
        # Verificar se o investimento pertence a um objetivo de um cliente do usuário
        check = supabase.table("investimentos").select("*, objetivos!inner(*, clientes!inner(user_id))").eq("id", investimento_id).execute()
        if not check.data or check.data[0]["objetivos"]["clientes"]["user_id"] != current_user.id:
            raise HTTPException(status_code=404, detail="Investimento não encontrado")
        
        update_data = {k: v for k, v in investimento.dict().items() if v is not None}
        response = supabase.table("investimentos").update(update_data).eq("id", investimento_id).execute()
        # Converter Decimal para float se necessário
        investimento_data = response.data[0]
        if 'valor' in investimento_data and investimento_data['valor'] is not None:
            investimento_data['valor'] = float(investimento_data['valor'])
        return investimento_data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/investimentos/{investimento_id}")
async def deletar_investimento(investimento_id: str, current_user = Depends(get_current_user)):
    try:
        # Verificar se o investimento pertence a um objetivo de um cliente do usuário
        check = supabase.table("investimentos").select("*, objetivos!inner(*, clientes!inner(user_id))").eq("id", investimento_id).execute()
        if not check.data or check.data[0]["objetivos"]["clientes"]["user_id"] != current_user.id:
            raise HTTPException(status_code=404, detail="Investimento não encontrado")
        
        response = supabase.table("investimentos").delete().eq("id", investimento_id).execute()
        return {"message": "Investimento deletado com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Endpoint para obter carteira completa
@router.get("/cliente/{cliente_id}/completa", response_model=ClienteCarteira)
async def obter_carteira_completa(cliente_id: str, current_user = Depends(get_current_user)):
    try:
        # Verificar se o cliente pertence ao usuário
        cliente = supabase.table("clientes").select("id").eq("id", cliente_id).eq("user_id", current_user.id).execute()
        if not cliente.data:
            raise HTTPException(status_code=404, detail="Cliente não encontrado")
        
        # Buscar objetivos
        objetivos = supabase.table("objetivos").select("*").eq("cliente_id", cliente_id).execute()
        
        # Converter Decimal para float em valor_meta para todos os objetivos
        objetivos_data = objetivos.data
        for obj in objetivos_data:
            if 'valor_meta' in obj and obj['valor_meta'] is not None:
                obj['valor_meta'] = float(obj['valor_meta'])
        
        # Buscar investimentos para cada objetivo
        investimentos_por_objetivo = {}
        for objetivo in objetivos_data:
            investimentos = supabase.table("investimentos").select("*").eq("objetivo_id", objetivo["id"]).execute()
            # Converter Decimal para float em todos os investimentos
            investimentos_data = investimentos.data
            for inv in investimentos_data:
                if 'valor' in inv and inv['valor'] is not None:
                    inv['valor'] = float(inv['valor'])
            investimentos_por_objetivo[objetivo["id"]] = investimentos_data
        
        return {
            "cliente_id": cliente_id,
            "objetivos": objetivos_data,
            "investimentos_por_objetivo": investimentos_por_objetivo
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))