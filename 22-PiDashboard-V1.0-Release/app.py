from flask import Flask, render_template, jsonify
from datetime import datetime
import requests
import logging

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/data1')
def get_data1():
    d = fetch_openweather(WEATHER_API_URL1, PARAMS1)
    # print(d)
    return jsonify(d)

@app.route('/data2')
def get_data2():
    d = fetch_openweather(WEATHER_API_URL2, PARAMS2)
    # print(f"### data2 len = {d['cnt']}, true len={len(d['list'])}") #data['main']['humidity']
    # print(d)
    return jsonify(d)              
      
##############################################################
LAT, LON = 43.47053, -80.56186  # Residence at U of Waterloo
WEATHER_API_KEY = "7a8fdd951ab780e11ad83ac773f07e7f" #don't use my key, register it yourself
WEATHER_API_URL1 = "http://api.openweathermap.org/data/2.5/weather"
PARAMS1 = {"lon": LON, "lat":LAT,
            "appid": WEATHER_API_KEY,
            "units": "metric"}
WEATHER_API_URL2 = "http://api.openweathermap.org/data/2.5/forecast"
PARAMS2 = {"lon": LON, "lat":LAT,
           "appid": WEATHER_API_KEY,
           "units": "metric"}

def fetch_openweather(api, params):
    try:
        response = requests.get(api, params, timeout=5)
        if response.status_code == 200:
            data = response.json()
            return data
    except Exception as e:
        logging.error(f"Error fetching weather data: {e}")
        return None    

##############################################################


if __name__ == '__main__':
    app.run(debug=False)

