from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, dashboard
from utils.db_conn import Base, engine
from models.auth_users import Users, ChatThreads, ChatHistory

app = FastAPI()


# Create Tables
Base.metadata.create_all(bind=engine)

# Configure CORS
origins = ["http://localhost:3000", "http://192.168.1.6:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # Allow these origins
    allow_credentials=True,
    allow_methods=["*"],         # Allow all HTTP methods (GET, POST, etc)
    allow_headers=["*"],         # Allow all headers
)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])

@app.get("/")
def home():
    return {"message": "Welcome to FastAPI"}
