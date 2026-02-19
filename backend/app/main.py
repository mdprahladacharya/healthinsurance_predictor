from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
from .database import SessionLocal, engine
from .models import Base, Prediction


app = FastAPI()
Base.metadata.create_all(bind=engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Load trained model + feature order
#model = joblib.load("../ml/data/model.pkl")
#feature_names = joblib.load("../ml/data/feature_names.pkl")

import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
model_path = os.path.join(BASE_DIR, "ml", "model.pkl")
model = joblib.load(model_path)
feature_path = os.path.join(BASE_DIR, "ml", "feature_names.pkl")
feature_names = joblib.load(feature_path)



class InsuranceInput(BaseModel):
    age: int
    bmi: float
    children: int
    sex: str
    smoker: str
    region: str


@app.get("/")
def root():
    return {"message": "Insurance prediction API running"}


@app.post("/predict")
def predict_cost(data: InsuranceInput):

    # prepare dataframe
    input_dict = {
        "age": data.age,
        "bmi": data.bmi,
        "children": data.children,
        "sex": data.sex,
        "smoker": data.smoker,
        "region": data.region
    }

    df = pd.DataFrame([input_dict])
    df = pd.get_dummies(df)

    for col in feature_names:
        if col not in df.columns:
            df[col] = 0

    df = df[feature_names]

    prediction = model.predict(df)[0]

    # 💾 SAVE TO DATABASE
    db = SessionLocal()

    new_entry = Prediction(
        age=data.age,
        bmi=data.bmi,
        children=data.children,
        sex=data.sex,
        smoker=data.smoker,
        region=data.region,
        cost=prediction
    )

    db.add(new_entry)
    db.commit()
    db.close()

    return {"predicted_cost": round(prediction, 2)}
