from flask import Flask, jsonify, request
from flask_cors import CORS
from google.cloud import storage
import random
import json
import os

app = Flask(__name__)
cors = CORS(app, origins = "uni-guesser-two-vercel.app")  # Allow cross-origin requests

credentialsPath = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
credentialsJSON = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON")
if credentialsPath and credentialsJSON:
    with open(credentialsPath, "w") as f:
        json.dump(json.loads(credentialsJSON), f)

client = storage.Client.from_service_account_json(credentialsPath)
bucket = client.get_bucket("hackathongeoguesser")

def getCoordsData():
    blob = bucket.blob("coordinates.json")
    blob.download_to_filename("coordinates.json")
    with open("coordinates.json") as f:
        data = json.load(f)
    return data

def getLeaderboardData():
    blob = bucket.blob("leaderboard.json")
    blob.download_to_filename("leaderboard.json")
    with open("leaderboard.json") as f:
        data = json.load(f)
    return data

def saveLeaderboardData(data):
    print(data)
    with open("leaderboard.json", "w") as f:
        json.dump(data, f)
    blob = bucket.blob("leaderboard.json")
    print(blob)
    blob.upload_from_filename("leaderboard.json")

@app.route("/api/data", methods=["GET"])
def getData():
    data = getCoordsData()
    selectedData = random.sample(data, 5)
    return jsonify(selectedData)

@app.route("/api/leaderboard", methods=["GET"])
def getLeaderboard():
    data = getLeaderboardData()
    return jsonify(data)

@app.route("/api/leaderboard", methods=["POST"])
def updateLeaderboard():
    pass
    newEntry = request.json
    print(newEntry)
    leaderboard = getLeaderboardData()

    # Add the new entry to the leaderboard
    leaderboard.append(newEntry)
    leaderboard = sorted(leaderboard, key=lambda x: x["score"], reverse=True)
    
    # Limit leaderboard to the top 10 entries
    if len(leaderboard) > 10:
        leaderboard = leaderboard[:10]
    
    # Save the updated leaderboard in memory, not through a file
    try:
        blob = bucket.blob("leaderboard.json")
        blob.upload_from_string(json.dumps(leaderboard), content_type='application/json')
        print("Leaderboard updated and saved successfully.")
    except Exception as e:
        print("Error saving leaderboard to Google Cloud Storage:", e)
        return jsonify({"error": "Failed to save leaderboard"}), 500

    return jsonify(leaderboard)

if __name__ == "__main__":
    app.run(debug=True)