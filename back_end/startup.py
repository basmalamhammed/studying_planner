import os
import pickle
import pandas as pd
import numpy as np
import random
from sklearn.linear_model import LinearRegression, LogisticRegression

def train_and_save():
    random.seed(42)
    np.random.seed(42)
    rows = []
    for _ in range(1000):
        level = random.randint(1, 5)
        difficulty = random.randint(1, 5)
        importance = random.randint(1, 5)
        days_left = random.randint(1, 60)
        focus = random.randint(1, 5)
        hours = round((difficulty*0.4 + (6-level)*0.3 + focus*0.3) + np.random.normal(0,0.5), 1)
        hours = max(0.5, min(hours, 6))
        prob = (6-focus)*0.08 + (6-level)*0.05 + (days_left>30)*0.1
        delayed = 1 if random.random() < prob else 0
        rows.append({"level":level,"difficulty":difficulty,"importance":importance,
                     "days_left":days_left,"focus":focus,"hours_studied":hours,"delayed":delayed})
    df = pd.DataFrame(rows)
    X = df[["level","difficulty","importance","days_left","focus"]]
    reg = LinearRegression()
    reg.fit(X, df["hours_studied"])
    with open("regression_model.pkl","wb") as f:
        pickle.dump(reg, f)
    clf = LogisticRegression()
    clf.fit(X, df["delayed"])
    with open("classification_model.pkl","wb") as f:
        pickle.dump(clf, f)
    print(" Models ready!")

if not os.path.exists("regression_model.pkl"):
    train_and_save()