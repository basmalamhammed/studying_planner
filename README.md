# 📚 Study Planner — ML-Powered Study Scheduler

A full-stack web application that helps students plan their weekly study schedule using Machine Learning predictions.

---

## 🌐 Live Demo

- **Frontend:** https://studying-planner-vge6.vercel.app
- **Backend API:** https://studyingplanner-production-caf4.up.railway.app

---

## 🧠 What Does It Do?

The user enters a subject with 5 parameters:

| Parameter | Description |
|-----------|-------------|
| **Name** | Subject name |
| **Level** | Current knowledge level (1-5) |
| **Difficulty** | How hard is the subject (1-5) |
| **Importance** | How important is it (1-5) |
| **Days Left** | Days until exam/deadline |
| **Focus** | Ability to concentrate (1-5) |

The app then:
1. **Predicts** how many hours you need to study
2. **Calculates** the probability of delay/procrastination
3. **Generates** an optimized weekly study schedule

---

## 🏗️ Project Structure

```
studying_planner/
├── back_end/
│   ├── app.py              # Flask API
│   ├── planner.py          # Weekly schedule logic
│   ├── startup.py          # Auto-trains ML models on server start
│   ├── requirements.txt    # Python dependencies
│   ├── regression_model.pkl    # Trained hours prediction model
│   └── classification_model.pkl # Trained delay prediction model
└── src/
    ├── App.jsx             # React frontend
    └── App.css             # Cyberpunk dark theme
```

---

## ⚙️ Tech Stack

### Frontend
- **React** (Vite)
- **CSS** — Custom dark cyberpunk theme (black + blue)
- **Deployed on:** Vercel

### Backend
- **Python + Flask** — REST API
- **Flask-CORS** — Cross-origin support
- **Deployed on:** Railway

### Machine Learning
- **scikit-learn** — Model training
- **LinearRegression** — Predicts study hours (MSE: 0.241)
- **LogisticRegression** — Predicts delay probability (Accuracy: 67.5%)
- **1000 rows** of synthetic training data

---

## 🔌 API Endpoints

### `POST /predict`
Predicts study hours and delay probability.

**Request:**
```json
{
  "level": 2,
  "difficulty": 4,
  "importance": 5,
  "days_left": 20,
  "focus": 2
}
```

**Response:**
```json
{
  "predicted_hours": 3.1,
  "delay_probability": 54.8,
  "warning": false
}
```

### `POST /generate`
Generates an optimized weekly study plan.

**Request:**
```json
[
  { "name": "Math", "level": 2, "difficulty": 4, "importance": 5, "days": 20, "focus": 3 },
  { "name": "Physics", "level": 3, "difficulty": 3, "importance": 4, "days": 15, "focus": 4 }
]
```

**Response:**
```json
{
  "Monday": [{ "name": "Math", "hours": 2.5 }],
  "Tuesday": [{ "name": "Physics", "hours": 2.0 }]
}
```

---

## 🤖 Machine Learning Details

### Data Generation
- 1000 synthetic study sessions
- Features: level, difficulty, importance, days_left, focus
- Balanced dataset: 56% completed, 44% delayed

### Models Trained
| Model | Task | Result |
|-------|------|--------|
| LinearRegression | Predict study hours | MSE = 0.241 (~30 min error) |
| LogisticRegression | Predict delay risk | Accuracy = 67.5% |

### Why These Models?
We tested 4 algorithms (Linear Regression, Random Forest, Decision Tree, KNN) — Linear and Logistic Regression won because the data relationships are linear by design.

---

## 🚀 Run Locally

### Backend
```bash
cd back_end
pip install -r requirements.txt
python app.py
```

### Frontend
```bash
npm install
npm run dev
```

---

## 👩‍💻 Built By
*ENG : Basmala Mohamed" 
