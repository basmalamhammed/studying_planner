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
  const [finalTable, setFinalTable] = useState({});
  const [editIndex, setEditIndex] = useState(null);

  const validateInput = (s) => {
    if (!s.name) return "Needed name of subject";
    if (s.level <= 0) return "Level should be more than 0";
    if (s.difficulty <= 0) return "Difficulty should be more than 0";
    if (s.importance <= 0) return "Importance should be more than 0";
    if (s.days <= 0) return "Days should be more than 0";
    if (s.focus <= 0 || s.focus > 5) return "Focus should be between 1 and 5";
    return null;
  };

  const getPrediction = async (subject) => {
    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level: subject.level,
          difficulty: subject.difficulty,
          importance: subject.importance,
          days_left: subject.days,
          focus: subject.focus
        })
      });
      const data = await res.json();
      return data;
    } catch (err) {
      return null;
    }
  };

  const handleAddOrEdit = async () => {
    const newSubject = {
      name,
      level: Number(level),
      difficulty: Number(difficulty),
      importance: Number(importance),
      days: Number(days),
      focus: Number(focus || 1),
    };

    const error = validateInput(newSubject);
    if (error) return alert(error);

    const prediction = await getPrediction(newSubject);
    if (prediction) {
      newSubject.predicted_hours = prediction.predicted_hours;
      newSubject.delay_probability = prediction.delay_probability;
      newSubject.warning = prediction.warning;
    }

    if (editIndex !== null) {
      const updated = [...subjects];
      updated[editIndex] = newSubject;
      setSubjects(updated);
      setEditIndex(null);
    } else {
      setSubjects([...subjects, newSubject]);
    }

    setName(""); setLevel(""); setDifficulty("");
    setImportance(""); setDays(""); setFocus("");
  };

  const handleEdit = (index) => {
    const s = subjects[index];
    setName(s.name); setLevel(s.level); setDifficulty(s.difficulty);
    setImportance(s.importance); setDays(s.days); setFocus(s.focus);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updated = subjects.filter((_, i) => i !== index);
    setSubjects(updated);
  };

  const generateTable = () => {
    if (subjects.length === 0) return alert("Please add a subject first!");

    fetch("http://127.0.0.1:5000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subjects),
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (!data || Object.keys(data).length === 0) {
          alert("Please make sure the data is correct!");
          return;
        }
        setFinalTable(data);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        alert("Connection error. Make sure Flask is running.");
      });
  };

  const getColor = (name) => {
    const colors = [
      "rgba(0, 100, 200, 0.25)",
      "rgba(0, 70, 180, 0.25)",
      "rgba(0, 120, 220, 0.25)",
      "rgba(0, 55, 160, 0.25)",
      "rgba(0, 140, 255, 0.2)",
      "rgba(10, 80, 190, 0.25)"
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
    return colors[hash % colors.length];
  };

  return (
    <div className="App">
      <h1>Study Planner</h1>

      <div className="inputs">
        <input placeholder="Subject name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Level (1-5)" type="number" value={level} onChange={e => setLevel(e.target.value)} />
        <input placeholder="Difficulty (1-5)" type="number" value={difficulty} onChange={e => setDifficulty(e.target.value)} />
        <input placeholder="Importance (1-5)" type="number" value={importance} onChange={e => setImportance(e.target.value)} />
        <input placeholder="Days left" type="number" value={days} onChange={e => setDays(e.target.value)} />
        <input placeholder="Focus (1-5)" type="number" value={focus} onChange={e => setFocus(e.target.value)} />
        <button onClick={handleAddOrEdit}>{editIndex !== null ? "Update" : "Add"}</button>
      </div>

      <h2>Subjects Added</h2>
      {subjects.length === 0 ? (
        <p>No subjects yet — add one above</p>
      ) : (
        <ul className="subject-list">
          {subjects.map((s, i) => (
            <li key={i} style={{ backgroundColor: getColor(s.name) }}>
              <span>{s.name} — Focus: {s.focus} — Days: {s.days}</span>
              {s.predicted_hours && (
                <span className="prediction">
                   {s.predicted_hours}h
                  {s.warning
                    ? <span className="warning">  {s.delay_probability}% delay risk</span>
                    : <span className="safe">  {s.delay_probability}% delay risk</span>
                  }
                </span>
              )}
              <button onClick={() => handleEdit(i)}>Edit</button>
              <button onClick={() => handleDelete(i)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      <button className="generate-btn" onClick={generateTable}>Generate Weekly Plan</button>

      {Object.keys(finalTable).length > 0 && (
        <>
          <h2>Weekly Plan</h2>
          <div className="week-table">
            {Object.keys(finalTable).map(day => (
              <div key={day} className="day-column">
                <h3>{day}</h3>
                <ul>
                  {finalTable[day].map((sub, i) => (
                    <li key={i} style={{ backgroundColor: getColor(sub.name) }}>
                      {sub.name}<br />{sub.hours} hrs
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
