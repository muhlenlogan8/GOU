from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# Path to your images directory
IMAGE_DIR = r'C:\Users\cumpl\Dropbox\Personal\MakeUC 2024'

@app.route('/image_data', methods=['GET'])
def image_data():
    try:
        # List all images in the directory
        image_files = [f for f in os.listdir(IMAGE_DIR) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        
        # Prepare a list of image data with filenames
        images_info = []
        for image in image_files:
            image_url = f'http://localhost:5000/images/{image}'
            images_info.append({
                'image': image_url,
                'filename': image  # Add the filename as additional information
            })
        
        return jsonify(images_info)  # Return the list of images with additional info

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route to serve the images
@app.route('/images/<filename>', methods=['GET'])
def serve_image(filename):
    try:
        return send_from_directory(IMAGE_DIR, filename)
    except Exception as e:
        return f"Error: {str(e)}", 500

if __name__ == '__main__':
    app.run(debug=True)
