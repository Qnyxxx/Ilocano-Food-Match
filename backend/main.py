from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI()

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load dishes
with open("dishes.json") as f:
    dishes = json.load(f)

@app.get("/dishes")
def get_dishes():
    return dishes

@app.post("/match")
def match_dish(prefs: dict):
    taste = prefs.get("taste")
    ingredient = prefs.get("ingredient")
    method = prefs.get("method")
    occasion = prefs.get("occasion")

    results = []

    for dish in dishes:
        score = 0

        if taste in dish["taste_profile"]:
            score += 3
        if ingredient == dish["main_ingredient"]:
            score += 3
        if method == dish["cooking_method"]:
            score += 2
        if occasion in dish["occasion"]:
            score += 1

        results.append({
            "name": dish["name"],
            "image": dish["image_url"],
            "description": dish["description"],
            "score": score
        })

    results.sort(key=lambda x: x["score"], reverse=True)
    return results[:3]
