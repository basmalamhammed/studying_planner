from flask import Flask, request, jsonify
from flask_cors import CORS
from planner import generate_weekly_schedule
import pickle
import os

app = Flask(__name__)
# السماح لأي دومين بالوصول (مهم للـ React على أي جهاز)
CORS(app, resources={r"/*": {"origins": "*"}})

# تحميل الـ Models
with open("regression_model.pkl", "rb") as f:
    reg_model = pickle.load(f)

with open("classification_model.pkl", "rb") as f:
    clf_model = pickle.load(f)

# Endpoint للتنبؤ بساعات المادة واحتمالية التأخير
@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    features = [[
        data["level"],
        data["difficulty"],
        data["importance"],
        data["days_left"],
        data["focus"]
    ]]
    hours = round(float(reg_model.predict(features)[0]), 1)
    delay_prob = round(float(clf_model.predict_proba(features)[0][1]) * 100, 1)
    return jsonify({
        "predicted_hours": hours,
        "delay_probability": delay_prob,
        "warning": delay_prob > 60
    })

# Endpoint لحساب الجدول الأسبوعي
@app.route("/generate", methods=["POST"])
def generate_plan():
    data = request.json  # list من المواد
    if not data or not isinstance(data, list):
        return jsonify({"status": "error", "message": "No subjects provided"}), 400
    try:
        weekly_schedule = generate_weekly_schedule(data)
        return jsonify(weekly_schedule)
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# تشغيل على أي جهاز / Railway
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))