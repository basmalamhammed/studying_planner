import React, { useState } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [importance, setImportance] = useState("");
  const [days, setDays] = useState("");
  const [focus, setFocus] = useState("");

  const [subjects, setSubjects] = useState([]);
  const [weeklyPlan, setWeeklyPlan] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const backendUrl = "https://studyingplanner-production-caf4.up.railway.app";

  // ======== Validation ========
  const validate = (s) => {
    if (!s.name) return "Enter subject name";
    if (s.level < 1 || s.level > 5) return "Level 1-5";
    if (s.difficulty < 1 || s.difficulty > 5) return "Difficulty 1-5";
    if (s.importance < 1 || s.importance > 5) return "Importance 1-5";
    if (s.days < 1) return "Days should be > 0";
    if (s.focus < 1 || s.focus > 5) return "Focus 1-5";
    return null;
  };

  // ======== Prediction ========
  const getPrediction = async (subject) => {
    try {
      const res = await fetch(`${backendUrl}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level: subject.level,
          difficulty: subject.difficulty,
          importance: subject.importance,
          days_left: subject.days,
          focus: subject.focus,
        }),
      });
      if (!res.ok) throw new Error("Failed prediction");
      return await res.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  // ======== Add Subject ========
  const addSubject = async () => {
    const newSub = {
      name,
      level: Number(level),
      difficulty: Number(difficulty),
      importance: Number(importance),
      days: Number(days),
      focus: Number(focus || 1),
    };

    const err = validate(newSub);
    if (err) return alert(err);

    const prediction = await getPrediction(newSub);
    if (prediction) Object.assign(newSub, prediction);

    setSubjects([...subjects, newSub]);
    setName(""); setLevel(""); setDifficulty(""); setImportance(""); setDays(""); setFocus("");
  };

  // ======== Generate Weekly Plan ========
  const generatePlan = async () => {
    if (subjects.length === 0) return alert("Add subjects first!");
    setLoading(true); setError("");
    try {
      const res = await fetch(`${backendUrl}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subjects),
      });
      if (!res.ok) throw new Error("Failed to generate plan");
      const data = await res.json();
      setWeeklyPlan(data);
    } catch (err) {
      setError("Connection error. Make sure backend is running.");
      console.error(err);
    }
    setLoading(false);
  };

  // ======== Color Helper ========
  const getColor = (name) => {
    const colors = ["#054a72", "#874747", "#a2d5f2", "#f2a2a2", "#a2f2b5", "#f2e2a2"];
    return colors[name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length];
  };

  // ======== Render ========
  return (
    <div className="App">
      <h1>Study Planner</h1>

      <div className="inputs">
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="number" placeholder="Level" value={level} onChange={(e) => setLevel(e.target.value)} />
        <input type="number" placeholder="Difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} />
        <input type="number" placeholder="Importance" value={importance} onChange={(e) => setImportance(e.target.value)} />
        <input type="number" placeholder="Days" value={days} onChange={(e) => setDays(e.target.value)} />
        <input type="number" placeholder="Focus" value={focus} onChange={(e) => setFocus(e.target.value)} />
        <button onClick={addSubject}>Add Subject</button>
      </div>

      {subjects.length > 0 && (
        <ul>
          {subjects.map((s, i) => (
            <li key={i} style={{ backgroundColor: getColor(s.name) }}>
              {s.name} — {s.predicted_hours ?? "N/A"}h — {s.delay_probability ?? "N/A"}% delay
            </li>
          ))}
        </ul>
      )}

      <button onClick={generatePlan}>Generate Weekly Plan</button>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {Object.keys(weeklyPlan).length > 0 && (
        <div className="week-table">
          {Object.entries(weeklyPlan).map(([day, subs]) => (
            <div key={day}>
              <h3>{day}</h3>
              <ul>
                {subs.map((s, i) => (
                  <li key={i} style={{ backgroundColor: getColor(s.name) }}>
                    {s.name} — {s.hours} hrs
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;