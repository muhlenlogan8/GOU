import math

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

# Test with the given coordinates
dist_between_two_points(39.134918, -84.519845, 39.135287, -84.511129)
