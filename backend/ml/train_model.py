import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import joblib
import os

# Load data
print("Loading data...")
df = pd.read_csv('data/insurance.csv')
print(f"Loaded {len(df)} records")

# Prepare features (X) and target (y)
print("\nPreparing data...")
X = df[['age', 'bmi', 'children', 'sex', 'smoker', 'region']]
y = df['charges']

# Convert categorical variables to numbers (ML models need numbers!)
X = pd.get_dummies(X, drop_first=True)

print(f"Features after encoding: {list(X.columns)}")
print(f"Total features: {len(X.columns)}")

# Split into training and testing sets (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print(f"\nTraining set: {len(X_train)} samples")
print(f"Testing set: {len(X_test)} samples")

# Train the model
print("\nTraining Random Forest model...")
model = RandomForestRegressor(
    n_estimators=100,  # 100 decision trees
    random_state=42,
    max_depth=10,
    min_samples_split=5
)

model.fit(X_train, y_train)
print("✓ Model trained!")

# Make predictions on test set
print("\nEvaluating model...")
y_pred = model.predict(X_test)

# Calculate metrics
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print("\n" + "="*50)
print("MODEL PERFORMANCE")
print("="*50)
print(f"R² Score: {r2:.4f} ({r2*100:.2f}% of variance explained)")
print(f"RMSE: ${rmse:,.2f}")
print(f"MAE: ${mae:,.2f}")
print("="*50)

# Show feature importance
print("\nTop 5 Most Important Features:")
feature_importance = pd.DataFrame({
    'feature': X.columns,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

for idx, row in feature_importance.head(5).iterrows():
    print(f"  {row['feature']}: {row['importance']:.4f}")

# Save the model
model_path = 'model.pkl'
print(f"\nSaving model to {model_path}...")
joblib.dump(model, model_path)

# Save feature names (needed for predictions later)
feature_names_path = 'feature_names.pkl'
joblib.dump(list(X.columns), feature_names_path)

print("✓ Model and feature names saved!")

# Test with a sample prediction
print("\n" + "="*50)
print("SAMPLE PREDICTION TEST")
print("="*50)
sample = X_test.iloc[0:1]
actual = y_test.iloc[0]
predicted = model.predict(sample)[0]

print(f"Actual cost: ${actual:,.2f}")
print(f"Predicted cost: ${predicted:,.2f}")
print(f"Difference: ${abs(actual - predicted):,.2f}")
print("="*50)

print("\n✅ Training complete! Model is ready to use.")