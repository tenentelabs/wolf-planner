import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, clientes, carteiras

app = FastAPI(
    title="Wolf Planner API",
    description="API para gerenciamento de clientes e carteiras de investimento",
    version="1.0.0"
)

# Configurar CORS para produção
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    # Vercel domains will be added here after deployment
]

# Add production domain from environment variable
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    allowed_origins.append(frontend_url)
    allowed_origins.append(frontend_url.replace("http://", "https://"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(auth.router, prefix="/api")
app.include_router(clientes.router, prefix="/api")
app.include_router(carteiras.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Wolf Planner API", "status": "online"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}