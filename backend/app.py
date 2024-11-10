from flask import Flask, jsonify
from flask_cors import CORS
from google.cloud import storage
import random
import json


app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

client = storage.Client.from_service_account_json("../GoogleCS.json")
bucket = client.get_bucket("hackathongeoguesser")
jsonFilePath = "coordinates.json"

def getCoordsData():
    blob = bucket.blob(jsonFilePath)
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

@app.route("/api/data", methods=["GET"])
def getData():
    data = getCoordsData()
    selectedData = random.sample(data, 5)
    return jsonify(selectedData)

if __name__ == "__main__":
    app.run(debug=True)