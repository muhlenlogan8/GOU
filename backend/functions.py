import math
import os
import random
from google.cloud import storage

def dist_between_two_points(lat1, lon1, lat2, lon2):
    
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)
    
    # calculate distances in meters (m)
    distance = math.acos(
        math.sin(lat1_rad) * math.sin(lat2_rad) +
        math.cos(lat1_rad) * math.cos(lat2_rad) * math.cos(lon2_rad - lon1_rad)
    ) * 6371000     
    print(f"Distance: {distance} m")


def getImage():
    client = storage.Client.from_service_account_json("GoogleCS.json")
    bucket = client.get_bucket("hackathongeoguesser")
    
<<<<<<< HEAD
    imagePath = "images/IMG_20210710_131234.jpg"
    blob = bucket.blob('coordinates.json')
    # Downloads image to file image.jpg then can use image.jpg for stuff
    blob.download_to_filename("image.jpg")
    blob.upload_from_filename("/images")


def move_file_to_images():
    # Initialize the Google Cloud Storage client
    client = storage.Client.from_service_account_json("GoogleCS.json")
    bucket = client.get_bucket("hackathongeoguesser")

    # Define the source path (root) and the destination path (images folder)
    source_blob = bucket.blob("coordinates.json")
    destination_blob = bucket.blob("GameImages/coordinates.json")
    
    # Download the file temporarily
    source_blob.download_to_filename("temp_coordinates.json")
    
    # Upload the file to the new path
    destination_blob.upload_from_filename("temp_coordinates.json")


    # Clean up local temp file if needed
    import os
    os.remove("temp_coordinates.json")

# Selects 5 random images from 'images' bucket into 'GameImages' bucket for the 5 rounds
def select_random_files_and_move(bucket_name, source_directory, destination_directory, num_files=5):
    # Initialize the Google Cloud Storage client
    client = storage.Client.from_service_account_json("GoogleCS.json")
    bucket = client.get_bucket(bucket_name)

    # List all files in the source directory
    blobs = bucket.list_blobs(prefix=source_directory)
    
    # Get the file names (without the directory part)
    files = [blob.name for blob in blobs if not blob.name.endswith('/')]  # Ignore directories
    
    # Ensure there are enough files to choose from
    if len(files) < num_files:
        raise ValueError(f"Not enough files in the directory. Found {len(files)} files, but {num_files} are needed.")
    
    # Pick 'num_files' random files with no repeats
    random_files = random.sample(files, num_files)

    # Move the selected files to the new directory
    for file in random_files:
        # Define the source and destination paths for each file
        source_blob = bucket.blob(file)
        destination_blob = bucket.blob(destination_directory + os.path.basename(file))
        
        # Download the file temporarily
        temp_file = f"temp_{os.path.basename(file)}"
        source_blob.download_to_filename(temp_file)
        
        # Upload the file to the new path
        destination_blob.upload_from_filename(temp_file)
        
        # Clean up the local temp file
        os.remove(temp_file)

# Deletes 'GameImages' bucket
def delete_game_folder_contents():
    # Initialize the Google Cloud Storage client
    client = storage.Client.from_service_account_json("GoogleCS.json")
    bucket = client.get_bucket("hackathongeoguesser")

    # Define the folder path
    folder_prefix = "GameImages/"

    # List all blobs in the specified folder
    blobs = bucket.list_blobs(prefix=folder_prefix)

    # Delete each blob within the folder
    for blob in blobs:
        blob.delete()



#move_file_to_images()
#delete_game_folder_contents()
#select_random_files_and_move('hackathongeoguesser', 'images/', 'GameImages/')
=======
    folderPath = "images"
    blob = bucket.blob(folderPath)
    # Downloads image to file image.jpg then can use image.jpg for stuff
    blob.download_to_filename("images")
>>>>>>> 98a0ef9421158376a97c5f56909b2083859daf79
