from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy import create_engine, Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship, Session
from pydantic import BaseModel
from typing import List, Optional
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from uuid import uuid4
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import os

# --- CONFIG ---
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
ALGORITHM = os.getenv("ALGORITHM")

# --- DATABASE SETUP ---

# Added pool size, max overflow, and pool timeout to prevent connection exhaustion
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    pool_size=10,       # increase pool size from default 5 to 10
    max_overflow=20,    # increase max overflow from default 10 to 20
    pool_timeout=30     # timeout in seconds to wait for connection release
)

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()

# --- MODELS ---

class UserDB(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    todos = relationship("TaskDB", back_populates="owner")

class TaskDB(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    uuid = Column(String, unique=True, index=True, default=lambda: str(uuid4()))
    title = Column(String, index=True)
    description = Column(Text, nullable=True)
    status = Column(String)
    date = Column(DateTime, default=datetime.utcnow)
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("UserDB", back_populates="todos")

Base.metadata.create_all(bind=engine)

# --- Pydantic Schemas ---

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: str
    date: Optional[datetime] = None

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    uuid: str
    date: Optional[datetime] = None

    class Config:
        orm_mode = True

class UserCreate(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# --- AUTH UTILS ---

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_user_by_username(db: Session, username: str):
    return db.query(UserDB).filter(UserDB.username == username).first()

def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if not user or not verify_password(password, user.hashed_password):
        return False
    return user

# Fixed: Use get_db dependency to properly close session after use
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(lambda: next(get_db()))):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = get_user_by_username(db, username=username)
    if user is None:
        raise credentials_exception
    return user

# --- DEPENDENCY ---

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- APP ---

app = FastAPI(title="Todo API with JWT Auth")

# CORS for frontend (allow all in dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ROUTES ---

@app.post("/signup", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_username(db, user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="username already registered")
    hashed_password = get_password_hash(user.password)
    new_user = UserDB(username=user.username, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    access_token = create_access_token(data={"sub": new_user.username}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": user.username}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/tasks", response_model=List[Task])
def get_tasks(db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    tasks = db.query(TaskDB).filter(TaskDB.owner_id == current_user.id).all()
    return tasks

@app.post("/tasks", response_model=Task)
def create_task(task: TaskCreate, db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    db_task = TaskDB(**task.dict(), owner_id=current_user.id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.put("/tasks/{task_uuid}", response_model=Task)
def update_task(task_uuid: str, task: TaskBase, db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    db_task = db.query(TaskDB).filter(TaskDB.uuid == task_uuid, TaskDB.owner_id == current_user.id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    for key, value in task.dict().items():
        setattr(db_task, key, value)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.delete("/tasks/{task_uuid}")
def delete_task(task_uuid: str, db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    db_task = db.query(TaskDB).filter(TaskDB.uuid == task_uuid, TaskDB.owner_id == current_user.id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(db_task)
    db.commit()
    return {"detail": "Task deleted successfully"}

# # Serve static files (JS, CSS, etc.)
# app.mount("/assets", StaticFiles(directory="../client/dist"), name="assets")

# # Serve the index.html for all non-API GET requests
# @app.get("/{full_path:path}")
# async def serve_vue(full_path: str, request: Request):
#     index_path = os.path.join(os.path.dirname(__file__), "../client/dist", full_path)
#     if os.path.exists(index_path):
#         return FileResponse(index_path)
#     return {"error": "index.html not found"}
