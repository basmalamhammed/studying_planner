import math
from collections import defaultdict

def calculate_priority(level, difficulty, importance):
    return level * 0.3 + difficulty * 0.4 + importance * 0.3

def calculate_urgency(days):
    return 10 / (days + 1)

def calculate_final_score(priority, urgency, focus):
    return priority + urgency + focus  

def generate_weekly_schedule(subjects):
    """
    subjects: list من dicts
    كل dict = {"name","level","difficulty","importance","days","focus"}
    """
  
    for s in subjects:
        p = calculate_priority(s["level"], s["difficulty"], s["importance"])
        u = calculate_urgency(s["days"])
        f = s.get("focus", 1)  
        s["score"] = calculate_final_score(p, u, f)


    subjects.sort(key=lambda x: x["score"], reverse=True)

    days_of_week = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
    schedule = defaultdict(list)

    day_index = 0
    for s in subjects:
        num_days = min(s["days"], 7)  
      
        hours_per_day = round(0.5 + (s.get("focus", 1)/5) * 2.5, 1)

        for i in range(num_days):
            day = days_of_week[(day_index + i) % 7]
            schedule[day].append({"name": s["name"], "hours": hours_per_day})
        day_index += 1

    return dict(schedule)