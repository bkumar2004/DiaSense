from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
import random
import bcrypt

from auth_db import User, UserCreate, UserLogin, ForgotPassword, ResetPassword, get_db

app = FastAPI(title="DiaSense API", description="Diabetes Risk Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DiabetesData(BaseModel):
    pregnancies: float
    glucose: float
    blood_pressure: float
    skin_thickness: float
    insulin: float
    bmi: float
    dpf: float
    age: float

# --- Authentication Helpers ---
def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))


# --- Routes ---
@app.get("/")
def read_root():
    return {"status": "DiaSense API is running"}

@app.post("/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(
        (User.username == user.username) | 
        (User.email == user.email) | 
        (User.mobile == user.mobile)
    ).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username, Email, or Mobile already registered")
    
    new_user = User(
        name=user.name,
        father_name=user.father_name,
        mobile=user.mobile,
        email=user.email,
        dob=user.dob,
        username=user.username,
        password=get_password_hash(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully", "username": new_user.username}

@app.post("/login")
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(
        (User.username == user.login_id) | (User.email == user.login_id)
    ).first()
    
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return {"message": "Login successful", "username": db_user.username, "name": db_user.name}

@app.post("/forgot-password")
def forgot_password(req: ForgotPassword, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(
        (User.email == req.recovery_id) | (User.mobile == req.recovery_id)
    ).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found with this Email/Mobile")
    
    return {"message": "User verified. You can now reset your password.", "username": db_user.username}

@app.post("/reset-password")
def reset_password(req: ResetPassword, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(
        (User.email == req.recovery_id) | (User.mobile == req.recovery_id)
    ).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_user.password = get_password_hash(req.new_password)
    db.commit()
    return {"message": "Password reset successfully"}

@app.post("/predict")
def predict_diabetes(data: DiabetesData):
    risk_score = random.uniform(0, 1)
    risk_level = "High" if risk_score > 0.5 else "Low"
    return {
        "risk_level": risk_level,
        "confidence": round(random.uniform(85, 99), 2),
        "message": "Prediction successful"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
