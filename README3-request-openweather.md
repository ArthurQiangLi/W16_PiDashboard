<!-- TOC ignore:true -->

# Requesting OpenWeather data

<!-- TOC -->
<!-- TOC depthFrom:2 orderedList:true -->

- [Requesting OpenWeather data](#requesting-openweather-data)
  - [1.1. Free account can access 5 APIs](#11-free-account-can-access-5-apis)
    - [1.1.1. test API1 `current` main data](#111-test-api1-current-main-data)
    - [1.1.2. Testing API2 `5 days each 3 hours`](#112-testing-api2-5-days-each-3-hours)
    - [1.1.3. Requesting maps](#113-requesting-maps)
    - [Testing API getting air quality](#testing-api-getting-air-quality)
    - [testing API5 geo data](#testing-api5-geo-data)
  - [1.2. The website offers icons](#12-the-website-offers-icons)

## 1.1. Free account can access 5 APIs

This 5 apis basically cover everything you need. [2025-02-06]

![141](./90-markdown-resources/141-free%20account%20access.png)
API Document:

1. https://openweathermap.org/current
2. https://openweathermap.org/forecast5
3. https://openweathermap.org/api/weathermaps
4. https://openweathermap.org/api/air-pollution
5. https://openweathermap.org/api/geocoding-api

### 1.1.1. test API1 `current` main data

Example data:

```json
{
  "coord": { "lon": -80.5112, "lat": 43.4254 },
  "weather": [{ "id": 804, "main": "Clouds", "description": "overcast clouds", "icon": "04d" }],
  "base": "stations",
  "main": {
    "temp": -1.65,
    "feels_like": -8.65,
    "temp_min": -2.79,
    "temp_max": -1.4,
    "pressure": 1006,
    "humidity": 90,
    "sea_level": 1006,
    "grnd_level": 965
  },
  "visibility": 10000,
  "wind": { "speed": 10.29, "deg": 240, "gust": 15.43 },
  "clouds": { "all": 100 },
  "dt": 1738871898,
  "sys": { "type": 2, "id": 2099608, "country": "CA", "sunrise": 1738845125, "sunset": 1738881614 },
  "timezone": -18000,
  "id": 5992996,
  "name": "Kitchener",
  "cod": 200
}
```

### 1.1.2. Testing API2 `5 days each 3 hours`

```
api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
```

This return a very long json text, it contains a list of 40 forcast. 3-hour step so it's 8 piece for a day, 5day \* 8 = 40 . Forecast is available in JSON or XML format.

View the data in this [test1_request_weather_data_result.json](./14-test_requesting_openweather/test1_request_weather_data_result.json) file.

### 1.1.3. Requesting maps

When I called the api it return a 256\*256 png file.

GPT: OpenWeatherMap provides individual 256x256 PNG tiles based on the Slippy Map format (like OpenStreetMap, Google Maps, etc.). To display a full map, you overlay these tiles on a base map using a mapping library like Leaflet.js (for web) or folium (Python).

![142 get map](./90-markdown-resources/142-requesting-map.png)

### Testing API getting air quality

Data is simple, the API document has instruction about how to understand the numbers.

```json
{
  "coord": { "lon": -80.5619, "lat": 43.4705 },
  "list": [
    {
      "main": { "aqi": 2 },
      "components": { "co": 363.83, "no": 1.44, "no2": 26.05, "o3": 38.62, "so2": 4.95, "pm2_5": 10.84, "pm10": 12.4, "nh3": 2.28 },
      "dt": 1738877754
    }
  ]
}
```

### testing API5 geo data

It's about the name texts in different languages, it's an online tool might be useful for me 100 years later.

## 1.2. The website offers icons

https://openweathermap.org/weather-conditions#Icon-list
