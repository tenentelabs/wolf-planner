from fastapi import APIRouter, HTTPException, status
from app.models import UserCreate, UserLogin, Token
from app.database import supabase

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/register", response_model=Token)
async def register(user: UserCreate):
    try:
        # Registrar usuário no Supabase
        auth_response = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password
        })
        
        if auth_response.user:
            # Se não houver sessão (email precisa ser confirmado), fazer login automaticamente
            if not auth_response.session:
                # Tentar fazer login com as credenciais fornecidas
                login_response = supabase.auth.sign_in_with_password({
                    "email": user.email,
                    "password": user.password
                })
                
                if login_response.session:
                    return {
                        "access_token": login_response.session.access_token,
                        "user": {
                            "id": login_response.user.id,
                            "email": login_response.user.email
                        }
                    }
                else:
                    # Se ainda não conseguir fazer login, informar que precisa confirmar email
                    raise HTTPException(
                        status_code=status.HTTP_201_CREATED,
                        detail="Usuário criado. Por favor, confirme seu email antes de fazer login."
                    )
            else:
                # Se já houver sessão, retornar normalmente
                return {
                    "access_token": auth_response.session.access_token,
                    "user": {
                        "id": auth_response.user.id,
                        "email": auth_response.user.email
                    }
                }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Erro ao criar usuário"
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/login", response_model=Token)
async def login(user: UserLogin):
    try:
        # Login no Supabase
        auth_response = supabase.auth.sign_in_with_password({
            "email": user.email,
            "password": user.password
        })
        
        if auth_response.user:
            return {
                "access_token": auth_response.session.access_token,
                "user": {
                    "id": auth_response.user.id,
                    "email": auth_response.user.email
                }
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou senha incorretos"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos"
        )

@router.post("/logout")
async def logout():
    try:
        supabase.auth.sign_out()
        return {"message": "Logout realizado com sucesso"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )