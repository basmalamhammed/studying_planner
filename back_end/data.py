import pandas as pd
import numpy as np
import random

random.seed(42)
np.random.seed(42)

subjects = ["Networking", "Security", "ML", "Linux", "Python", "Database", "Web", "Algorithms"]

data = []

for _ in range(1000): 
    subject = random.choice(subjects)
    level = random.randint(1, 5)
    difficulty = random.randint(1, 5)
    importance = random.randint(1, 5)
    days_left = random.randint(1, 60)
    focus = random.randint(1, 5)


    hours_studied = round(
        (difficulty * 0.4 + (6 - level) * 0.3 + focus * 0.3) + np.random.normal(0, 0.5), 1
    )
    hours_studied = max(0.5, min(hours_studied, 6))


    prob_delay = (6 - focus) * 0.08 + (6 - level) * 0.05 + (days_left > 30) * 0.1
    delayed = 1 if random.random() < prob_delay else 0

    data.append({
        "subject": subject,
        "level": level,
        "difficulty": difficulty,
        "importance": importance,
        "days_left": days_left,
        "focus": focus,
        "hours_studied": hours_studied,
        "delayed": delayed
    })

df = pd.DataFrame(data)
df.to_csv("study_data.csv", index=False)
print(f" Data generated: {len(df)} rows")
print(df.head())