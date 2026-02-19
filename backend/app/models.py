from sqlalchemy import Column, Integer, Float, String
from .database import Base

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    age = Column(Integer)
    bmi = Column(Float)
    children = Column(Integer)
    sex = Column(String)
    smoker = Column(String)
    region = Column(String)
    cost = Column(Float)
