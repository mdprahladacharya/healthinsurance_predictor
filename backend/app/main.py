from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Load trained model + feature order
model = joblib.load("../ml/model.pkl")
feature_names = joblib.load("../ml/feature_names.pkl")


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

    # Convert incoming data to dataframe
    input_dict = {
        "age": data.age,
        "bmi": data.bmi,
        "children": data.children,
        "sex": data.sex,
        "smoker": data.smoker,
        "region": data.region
    }

    df = pd.DataFrame([input_dict])

    # One-hot encoding (same as training)
    df = pd.get_dummies(df)

    # Add missing columns
    for col in feature_names:
        if col not in df.columns:
            df[col] = 0

    # Ensure same order
    df = df[feature_names]

    prediction = model.predict(df)[0]

    return {"predicted_cost": round(prediction, 2)}
