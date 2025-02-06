import folium

WEATHER_API_KEY = "7a8fdd951ab780e11ad83ac773f07e7f" #don't use my key, register it yourself
LAYER = "clouds_new"  # Change to your desired layer
LAT, LON = 43.47053, -80.56186  # Residence at U of Waterloo

# Create map centered at the given coordinates
m = folium.Map(location=[LAT, LON], zoom_start=6)

# Add OpenWeatherMap tile layer
tile_url = f"https://tile.openweathermap.org/map/{LAYER}/{{z}}/{{x}}/{{y}}.png?appid={WEATHER_API_KEY}"
folium.TileLayer(tile_url, attr="OpenWeatherMap").add_to(m)

# Save and display map
m.save("./map.html")
print("Map saved as map.html")


#url = "https://tile.openweathermap.org/map/clouds_new/6/15/25.png?appid=7a8fdd951ab780e11ad83ac773f07e7f"
# or you can simply put this url in you browser address to see the full map.