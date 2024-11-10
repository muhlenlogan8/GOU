import os
from PIL import Image, ExifTags
import folium
from flask import Flask, render_template_string

# Flask app setup
app = Flask(__name__)

# Function to extract GPS coordinates from EXIF data
def get_coordinates(exif_data):
    gps_data = {}
    for tag, value in exif_data.items():
        tag_name = ExifTags.TAGS.get(tag)
        if tag_name == "GPSInfo":
            # Iterate over GPS information
            for key in value.keys():
                gps_tag_name = ExifTags.GPSTAGS.get(key, key)
                gps_data[gps_tag_name] = value[key]

    if gps_data:
        # Extract GPS Latitude and Longitude if available
        try:
            lat = gps_data.get('GPSLatitude')
            lon = gps_data.get('GPSLongitude')

            if lat and lon:
                # Convert GPS coordinates to degrees
                def convert_to_degrees(value):
                    d, m, s = value
                    return d + (m / 60.0) + (s / 3600.0)

                latitude = convert_to_degrees(lat)
                longitude = convert_to_degrees(lon)

                # Adjust based on the hemisphere (N/S and E/W)
                if gps_data.get('GPSLatitudeRef') == 'S':
                    latitude = -latitude
                if gps_data.get('GPSLongitudeRef') == 'W':
                    longitude = -longitude

                return latitude, longitude
        except KeyError:
            pass

    return None

# Function to read EXIF data from image and extract coordinates
def read_exif_data(image_path):
    try:
        # Open the image and retrieve EXIF data
        image = Image.open(image_path)
        exif_data = image._getexif()

        if not exif_data:
            return None  # No EXIF data found

        # Get GPS coordinates if available
        coordinates = get_coordinates(exif_data)
        if coordinates:
            return coordinates
        else:
            return None
        
    except Exception as e:
        print(f"Error reading {image_path}: {e}")
        return None

# Function to read folder and extract coordinates from JPEG files
def read_folder_exif(folder_path):
    coordinates_list = []
    for filename in os.listdir(folder_path):
        if filename.lower().endswith((".jpg", ".jpeg")):
            image_path = os.path.join(folder_path, filename)
            coordinates = read_exif_data(image_path)
            
            if coordinates:
                coordinates_list.append((filename, coordinates))
            else:
                coordinates_list.append((filename, None))
    return coordinates_list

# Generate map with the coordinates plotted
def generate_map(coordinates_list):
    # Create a map centered at a default location
    map_center = [20.0, 0.0]  # Default map center
    map_obj = folium.Map(location=map_center, zoom_start=2)

    # Plot each valid coordinate on the map
    for filename, coords in coordinates_list:
        if coords:
            folium.Marker(
                location=[coords[0], coords[1]],
                #popup=filename
            ).add_to(map_obj)

    return map_obj

@app.route('/')
def index():
    # Folder containing images
    folder_path = r"C:\Users\cumpl\Documents\MUC24"
    
    # Get coordinates from the images in the folder
    coordinates_list = read_folder_exif(folder_path)

    # Generate map with coordinates plotted
    map_obj = generate_map(coordinates_list)

    # Save map to HTML and display it
    map_html = map_obj._repr_html_()
    return render_template_string("""
        <html>
        <head><title>Map with Coordinates</title></head>
        <body>
            <h1>Map with Coordinates</h1>
            {{ map_html | safe }}
        </body>
        </html>
    """, map_html=map_html)

if __name__ == '__main__':
    app.run(debug=True)
