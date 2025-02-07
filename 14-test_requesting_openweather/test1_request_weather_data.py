import requests
import logging

#current: https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
#5days: https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
#map: https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid={API key}
#airquality: http://api.openweathermap.org/data/2.5/air_pollution?lat=50&lon=50&appid={API key}

LOCATION = "Kitchener,CA"
LAT, LON = 43.47053, -80.56186  # Residence at U of Waterloo
WEATHER_API_KEY = "7a8fdd951ab780e11ad83ac773f07e7f" #don't use my key, register it yourself
WEATHER_API_URL1 = "http://api.openweathermap.org/data/2.5/weather"
PARAMS1 = {"lon": LON, "lat":LAT,
            "appid": WEATHER_API_KEY,
            "units": "metric"}
WEATHER_API_URL2 = "http://api.openweathermap.org/data/2.5/forecast"
PARAMS2 = {"q": LOCATION,
           "appid": WEATHER_API_KEY,
           "units": "metric"}
WEATHER_API_URL3 = "http://tile.openweathermap.org/map/precipitation_new/1/0/0.png"
PARAMS3 = {"appid": WEATHER_API_KEY}

WEATHER_API_URL4 = "http://api.openweathermap.org/data/2.5/air_pollution"
PARAMS4 = {"lat": LAT, "lon":LON,  "appid": WEATHER_API_KEY}

def fetch_openweather(api, params):
    try:
        response = requests.get(api, params, timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(data)
    except Exception as e:
        logging.error(f"Error fetching weather data: {e}")        

#===============================================
from PIL import Image
from io import BytesIO
def fetch_openweather4_map():
    layer = "precipitation_new"  # Change to "precipitation_new", "temp_new", etc.
    z, x, y = 1, 1, 1  # Zoom level and tile coordinates
    url = f"https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid={WEATHER_API_KEY}"    # Tile URL

    response = requests.get(url)# Fetch the tile
    if response.status_code == 200:
        img = Image.open(BytesIO(response.content))
        img.show()  # Display the image
    else:
        print("Failed to load tile:", response.status_code, response.text)

#===============================================

# temp = data['main']['temp']
# humidity = data['main']['humidity']
# weather = data['weather'][0]['description']
# return {"temp":temp, "humidity": humidity, "weather":weather}
#return {"temp":-3, "humidity": 98, "weather":mist}
    
if __name__ == "__main__":

    fetch_openweather(WEATHER_API_URL1, PARAMS1)
    # fetch_openweather(WEATHER_API_URL2, PARAMS2)
    # fetch_openweather(WEATHER_API_URL3, PARAMS3)
    # fetch_openweather4_map()