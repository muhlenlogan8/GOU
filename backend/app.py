from flask import Flask, jsonify, session
from flask_cors import CORS
from google.cloud import storage
import random
import json
import os

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "my-local-dev-secret-key")
CORS(app)  # Allow cross-origin requests

credentialsPath = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
credentialsJSON = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON")
if credentialsPath and credentialsJSON:
    with open(credentialsPath, "w") as f:
        json.dump(json.loads(credentialsJSON), f)

client = storage.Client.from_service_account_json(credentialsPath)
# client = storage.Client.from_service_account_json("../GoogleCS.json")
bucket = client.get_bucket("hackathongeoguesser")

def getCoordsData():
    blob = bucket.blob("coordinates.json")
    blob.download_to_filename("coordinates.json")
    with open("coordinates.json") as f:
        data = json.load(f)
    return data

def getDailyCoordsData():
    blob = bucket.blob("daily_coordinates.json")
    blob.download_to_filename("daily_coordinates.json")
    with open("daily_coordinates.json") as f:
        data = json.load(f)
    return data

# Quick play images & coordinates json GET route
@app.route("/api/data", methods=["GET"])
def getData():
    # Check if there already is an image list in the session
    if "shuffledData" not in session or len(session["shuffledData"]) == 0:
        data = getCoordsData() # Fetch all data from coordinates.json
        session["shuffledData"] = random.sample(data, 60) # Store a random sample of 60 items in session
        session["currentIndex"] = 0  # Track the current image index
        
    # Get the next 5 images for the game
    currentIndex = session["currentIndex"]
    selectedData = session["shuffledData"][currentIndex:currentIndex + 5] # Get the next 5 images (current index to current index + 5)

    # Update the current index for the next request
    session["currentIndex"] += 5
    
    # Reset if all images have been used
    if session["currentIndex"] >= len(session["shuffledData"]):
        session.pop("shuffledData", None)
        session.pop("currentIndex", None)
    
    return jsonify(selectedData)

# Daily play images & coordinates json GET route
@app.route("/api/daily-data", methods=["GET"])
def getDailyData():
    if "dailyData" not in session or len(session["dailyData"]) == 0:
        data = getDailyCoordsData()  # Load daily_coordinates.json data
        session["dailyData"] = data  # Cache in session
        
    return jsonify(session["dailyData"])

if __name__ == "__main__":
    app.run(debug=True)