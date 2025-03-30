import json  # Import the json module
import random  # Import the random module

def get_random_question_by_level(level, count=1):
    with open("questions.json", "r", encoding="utf-8") as json_file:
        data = json.load(json_file)
        
    filtered_questions = [q for q in data if q["Level"] == level]
    return [{"Problem": q["Problem"], "Solution": q["Solution"]} for q in random.sample(filtered_questions, min(count, len(filtered_questions)))] if filtered_questions else []

# Example usage
print(get_random_question_by_level("Level 3", 3))