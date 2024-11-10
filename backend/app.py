from flask import Flask, jsonify, request
from flask_cors import CORS
from google.cloud import storage
import random
import json


app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

client = storage.Client.from_service_account_json("../GoogleCS.json")
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
    with open("leaderboard.json", "w") as f:
        json.dump(data, f)
    blob = bucket.blob("leaderboard.json")
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
    newEntry = request.json
    print(newEntry)
    leaderboard = getLeaderboardData()
    
    # Add the new entry to the leaderboard
    leaderboard.append(newEntry)
    leaderboard = sorted(leaderboard, key=lambda x: x["score"], reverse=True)
    
    # Keep only the top 10 entries
    leaderboard = leaderboard[:10]
    
    # Save the updated leaderboard
    saveLeaderboardData(leaderboard)
    return jsonify(leaderboard)

if __name__ == "__main__":
    app.run(debug=True)