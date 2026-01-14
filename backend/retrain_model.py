"""
Quick script to retrain the Random Forest model with current scikit-learn version
Uses the same logic as elsemfive.ipynb
"""

import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

print("\n" + "="*70)
print("🔄 RETRAINING ML MODEL")
print("="*70)

# Check if dataset exists
if not os.path.exists('KDDTrain+.txt'):
    print("❌ KDDTrain+.txt not found!")
    print("Please ensure the dataset is in the backend folder")
    exit(1)

# Column names for KDD dataset
columns = [
    'duration','protocol_type','service','flag','src_bytes','dst_bytes','land',
    'wrong_fragment','urgent','hot','num_failed_logins','logged_in',
    'num_compromised','root_shell','su_attempted','num_root',
    'num_file_creations','num_shells','num_access_files','num_outbound_cmds',
    'is_host_login','is_guest_login','count','srv_count','serror_rate',
    'srv_serror_rate','rerror_rate','srv_rerror_rate','same_srv_rate',
    'diff_srv_rate','srv_diff_host_rate','dst_host_count','dst_host_srv_count',
    'dst_host_same_srv_rate','dst_host_diff_srv_rate',
    'dst_host_same_src_port_rate','dst_host_srv_diff_host_rate',
    'dst_host_serror_rate','dst_host_srv_serror_rate',
    'dst_host_rerror_rate','dst_host_srv_rerror_rate','label','difficulty'
]

# Selected features (same as training notebook)
selected_features = [
    'src_bytes', 'same_srv_rate', 'flag', 'dst_host_serror_rate', 
    'srv_serror_rate', 'dst_host_same_srv_rate', 'diff_srv_rate', 
    'count', 'dst_host_srv_serror_rate', 'serror_rate', 
    'dst_host_same_src_port_rate', 'dst_host_srv_diff_host_rate', 
    'dst_bytes', 'dst_host_diff_srv_rate', 'protocol_type', 
    'dst_host_srv_count', 'service', 'srv_count', 'dst_host_count', 
    'dst_host_rerror_rate'
]

print("\n📊 Loading KDD dataset...")
df_train = pd.read_csv('KDDTrain+.txt', header=None, names=columns)
print(f"✅ Loaded {len(df_train)} training samples")

# Select features and label
df_train = df_train[selected_features + ['label']]

# Encode labels
print("\n🏷️  Encoding attack labels...")
label_encoder = LabelEncoder()
y_train = label_encoder.fit_transform(df_train['label'])
X_train = df_train.drop('label', axis=1)

print(f"Classes: {label_encoder.classes_.tolist()}")

# Prepare preprocessing
categorical_features = ['protocol_type', 'service', 'flag']
numeric_features = [f for f in selected_features if f not in categorical_features]

preprocessor = ColumnTransformer(
    transformers=[
        ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), categorical_features),
        ('num', 'passthrough', numeric_features)
    ]
)

# Create and train pipeline
print("\n🚀 Training Random Forest model...")
rf_model = RandomForestClassifier(
    n_estimators=200,
    random_state=42,
    n_jobs=-1,
    class_weight='balanced'
)

pipeline = Pipeline(steps=[
    ('preprocessing', preprocessor),
    ('classifier', rf_model)
])

pipeline.fit(X_train, y_train)

# Evaluate on training set
y_pred = pipeline.predict(X_train)
accuracy = accuracy_score(y_train, y_pred)
print(f"✅ Training Accuracy: {accuracy:.4f}")

# Save models
print("\n💾 Saving model files...")
models_dir = os.path.join(os.path.dirname(__file__), 'models')

joblib.dump(pipeline, os.path.join(models_dir, 'random_forest_intrusion_model.pkl'))
joblib.dump(label_encoder, os.path.join(models_dir, 'label_encoder.pkl'))
joblib.dump(selected_features, os.path.join(models_dir, 'selected_features.pkl'))

print(f"✅ Model saved to: {models_dir}")
print("="*70)
print("✨ MODEL RETRAINING COMPLETE!")
print("="*70 + "\n")
